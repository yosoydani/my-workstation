"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLongestCommonFilePathPrefixIndex = exports.TreeDataProvider = exports.getNativeTabs = void 0;
const vscode = require("vscode");
const node_path_1 = require("node:path");
const lifecycle_1 = require("./lifecycle");
const TabTypeHandler_1 = require("./TabTypeHandler");
const TreeData_1 = require("./TreeData");
const types_1 = require("./types");
const path = require("node:path");
function getNativeTabs(tab) {
    const currentNativeTabs = vscode.window.tabGroups.all.flatMap(tabGroup => tabGroup.tabs);
    return currentNativeTabs.filter(nativeTab => {
        const handler = (0, TabTypeHandler_1.getHandler)(nativeTab);
        return tab.id === handler?.getNormalizedId(nativeTab);
    });
}
exports.getNativeTabs = getNativeTabs;
class TreeDataProvider extends lifecycle_1.Disposable {
    constructor() {
        super(...arguments);
        this._onDidChangeTreeData = this._register(new vscode.EventEmitter());
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.treeData = new TreeData_1.TreeData();
        /**
         * To reuse tree item object
         */
        this.treeItemMap = {};
        /**
         * Store file path of open tab with resourceUri as tree map to use for label if duplicated file name showing
         */
        this.filePathTree = {};
        this.sortMode = false;
        this.dropMimeTypes = [TreeDataProvider.TabDropMimeType];
        this.dragMimeTypes = ['text/uri-list'];
    }
    getChildren(element) {
        const children = this.treeData.getChildren(element);
        if (this.sortMode && Array.isArray(children) && children.length > 0) {
            let groupId = (0, types_1.isGroup)(children[0]) ? null : children[0].groupId;
            const slottedChildren = children.slice(0);
            slottedChildren.push({ type: 2 /* TreeItemType.Slot */, index: children.length, groupId });
            return slottedChildren;
        }
        return children;
    }
    getTreeItem(element) {
        if (element.type === 0 /* TreeItemType.Tab */) {
            var newTreeItem = this.createTabTreeItem(element);
            const tabId = element.id;
            if (!this.treeItemMap[tabId]) {
                this.treeItemMap[tabId] = newTreeItem;
            }
            if (newTreeItem.resourceUri) {
                // use to update tab label if duplicated file name showing
                var filePathArray = tabId.split(node_path_1.sep);
                if (filePathArray.length > 1) {
                    if (!this.filePathTree[filePathArray[-1]]) {
                        this.filePathTree[filePathArray[-1]] = {};
                    }
                    if (!this.filePathTree[filePathArray[-1]][tabId]) {
                        this.filePathTree[filePathArray[-1]][tabId] = { pathList: filePathArray, id: tabId };
                    }
                }
            }
            this.treeItemMap[tabId].contextValue = element.groupId === null ? 'tab' : 'grouped-tab';
            return this.treeItemMap[tabId];
        }
        if (element.type === 2 /* TreeItemType.Slot */) {
            const treeItem = new vscode.TreeItem('');
            treeItem.iconPath = new vscode.ThemeIcon('indent');
            return treeItem;
        }
        if (!this.treeItemMap[element.id]) {
            const treeItem = new vscode.TreeItem(element.label, element.collapsed ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.Expanded);
            treeItem.contextValue = 'group';
            treeItem.iconPath = new vscode.ThemeIcon('layout-sidebar-left', new vscode.ThemeColor(element.colorId));
            this.treeItemMap[element.id] = treeItem;
        }
        else {
            const treeItem = this.treeItemMap[element.id];
            treeItem.label = element.label;
            treeItem.iconPath = new vscode.ThemeIcon('layout-sidebar-left', new vscode.ThemeColor(element.colorId));
        }
        return this.treeItemMap[element.id];
    }
    getParent(element) {
        return this.treeData.getParent(element);
    }
    createTabTreeItem(tab) {
        const nativeTabs = getNativeTabs(tab);
        if (nativeTabs.length === 0) {
            // todo: remove tab without any native Tab
            return {};
        }
        const handler = (0, TabTypeHandler_1.getHandler)(nativeTabs[0]);
        const treeItem = handler.createTreeItem(nativeTabs[0]);
        return treeItem;
    }
    async handleDrag(source, treeDataTransfer, token) {
        treeDataTransfer.set(TreeDataProvider.TabDropMimeType, new vscode.DataTransferItem(source.filter(item => !(0, types_1.isSlot)(item))));
    }
    async handleDrop(target, treeDataTransfer, token) {
        const draggeds = (treeDataTransfer.get(TreeDataProvider.TabDropMimeType)?.value ?? []).filter((tab) => tab !== target);
        if (this.sortMode) {
            this.doHandleSorting(target, draggeds);
        }
        else {
            if (target && (0, types_1.isSlot)(target)) {
                return; // should not have slot in group mode
            }
            this.doHandleGrouping(target, draggeds.filter(types_1.isTab));
            this.doHandleGrouping(target, draggeds.filter(types_1.isTab));
        }
        this._onDidChangeTreeData.fire();
    }
    doHandleSorting(target, draggeds) {
        if (target === undefined) {
            this.treeData.pushBack(null, draggeds);
        }
        else if ((0, types_1.isSlot)(target)) {
            this.treeData.pushBack(target.groupId, draggeds);
        }
        else {
            this.treeData.moveTo(target, draggeds);
        }
    }
    doHandleGrouping(target, tabs) {
        if (target === undefined) {
            this.treeData.ungroup(tabs, true);
        }
        else {
            const isCreatingNewGroup = (0, types_1.isTab)(target) && target.groupId === null && tabs.length > 0;
            this.treeData.group(target, tabs);
            if (isCreatingNewGroup && tabs[0].groupId !== null) {
                const group = this.treeData.getGroup(tabs[0].groupId);
                if (group) {
                    vscode.window.showInputBox({ placeHolder: 'Name this Group' }).then(input => {
                        if (input) {
                            this.treeData.renameGroup(group, input);
                            this.triggerRerender();
                        }
                    });
                }
            }
        }
    }
    triggerRerender() {
        this._onDidChangeTreeData.fire();
        this.refreshFilePathTree();
    }
    setState(state) {
        this.treeData.setState(state);
        this.triggerRerender();
    }
    async activate(tab) {
        const nativeTabs = getNativeTabs(tab);
        const handler = (0, TabTypeHandler_1.getHandler)(nativeTabs[0]);
        return handler.openEditor(nativeTabs[0]);
    }
    appendTabs(nativeTabs) {
        nativeTabs.forEach((nativeTab) => {
            try {
                const tabId = (0, TabTypeHandler_1.getNormalizedTabId)(nativeTab);
                this.treeData.appendTab(tabId);
            }
            catch {
                // skip
            }
        });
    }
    closeTabs(nativeTabs) {
        nativeTabs.forEach((nativeTab) => {
            try {
                const tabId = (0, TabTypeHandler_1.getNormalizedTabId)(nativeTab);
                const tab = this.treeData.getTab(tabId);
                if (tab && getNativeTabs(tab).length === 0) {
                    this.treeData.deleteTab(tabId);
                }
            }
            catch {
                // skip
            }
        });
    }
    getTab(nativeTab) {
        try {
            const tabId = (0, TabTypeHandler_1.getNormalizedTabId)(nativeTab);
            return this.treeData.getTab(tabId);
        }
        catch {
            return undefined;
        }
    }
    getState() {
        return this.treeData.getState();
    }
    ungroup(tab) {
        this.treeData.ungroup([tab]);
        this.triggerRerender();
    }
    renameGroup(group, input) {
        this.treeData.renameGroup(group, input);
        this.triggerRerender();
    }
    cancelGroup(group) {
        this.treeData.cancelGroup(group);
        this.triggerRerender();
    }
    toggleSortMode(sortMode) {
        this.sortMode = sortMode;
        this.triggerRerender();
    }
    isAllCollapsed() {
        return this.treeData.isAllCollapsed();
    }
    setCollapsedState(group, collapsed) {
        this.treeData.setCollapsedState(group, collapsed);
        // sync data from tree view, so rerendering is not needed
    }
    refreshFilePathTree() {
        this.filePathTree = {};
        this.getLeafNodes(this.treeData.getState()).forEach((leafNode) => {
            const tabId = leafNode.id;
            const leafItem = this.getTreeItem(leafNode);
            const nativeTabs = getNativeTabs(leafNode);
            if (nativeTabs[0].input instanceof vscode.TabInputText && leafItem.resourceUri) {
                // use to update tab label if duplicated file name showing
                var filePathArray = leafItem.resourceUri.fsPath.split(path.sep);
                if (filePathArray.length > 1) {
                    var fileName = filePathArray[filePathArray.length - 1];
                    if (!this.filePathTree[fileName]) {
                        this.filePathTree[fileName] = {};
                    }
                    if (!this.filePathTree[fileName][tabId]) {
                        this.filePathTree[fileName][tabId] = { pathList: filePathArray, id: tabId };
                        this.onChangeFilePathTree(fileName);
                    }
                }
            }
        });
    }
    getLeafNodes(root) {
        const leafNodes = [];
        root.forEach((item) => {
            if ((0, types_1.isTab)(item)) {
                leafNodes.push(item);
            }
            else {
                leafNodes.push(...this.getLeafNodes(item.children));
            }
        });
        return leafNodes;
    }
    onChangeFilePathTree(fileName) {
        let distinceNodeCount = Object.keys(this.filePathTree[fileName]).length;
        if (distinceNodeCount > 1) {
            var commonAncestorDirIndex = findLongestCommonFilePathPrefixIndex(Object.values(this.filePathTree[fileName]).map(node => node.pathList));
            // map back to treeItemMap to change the description
            Object.values(this.filePathTree[fileName]).forEach((node) => {
                this.updateTreeItemDescription(node.id, node.pathList.slice(commonAncestorDirIndex + 1, -1));
            });
        }
        else if (distinceNodeCount === 1) {
            var node = Object.values(this.filePathTree[fileName])[0];
            this.updateTreeItemDescription(node.id);
        }
    }
    updateTreeItemDescription(tabId, pathSequence) {
        if (this.treeItemMap[tabId]) {
            this.treeItemMap[tabId].description = pathSequence?.length ? path.join(...pathSequence) : undefined;
        }
    }
}
exports.TreeDataProvider = TreeDataProvider;
TreeDataProvider.TabDropMimeType = 'application/vnd.code.tree.tabstreeview';
function findLongestCommonFilePathPrefixIndex(filePathArrays) {
    const size = filePathArrays.length;
    if (size === 0) {
        return -1;
    }
    else if (size === 1) {
        return 0;
    }
    filePathArrays.sort((a, b) => a.length - b.length);
    // find the minimum length from first and last array
    const minLength = Math.min(filePathArrays[0].length, filePathArrays[size - 1].length);
    // find the common prefix between the first and last array
    let i = 0;
    while (i < minLength && filePathArrays[0][i] === filePathArrays[size - 1][i]) {
        i++;
    }
    return i - 1;
}
exports.findLongestCommonFilePathPrefixIndex = findLongestCommonFilePathPrefixIndex;
