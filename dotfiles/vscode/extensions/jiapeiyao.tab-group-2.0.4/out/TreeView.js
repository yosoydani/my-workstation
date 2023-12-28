"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsView = void 0;
const vscode = require("vscode");
const TabTypeHandler_1 = require("./TabTypeHandler");
const WorkspaceState_1 = require("./WorkspaceState");
const event_1 = require("./event");
const async_1 = require("./async");
const types_1 = require("./types");
const TreeDataProvider_1 = require("./TreeDataProvider");
const lifecycle_1 = require("./lifecycle");
const context_1 = require("./context");
class TabsView extends lifecycle_1.Disposable {
    constructor() {
        super();
        this.treeDataProvider = this._register(new TreeDataProvider_1.TreeDataProvider());
        this.exclusiveHandle = new event_1.ExclusiveHandle();
        const initialState = this.initializeState();
        this.saveState(initialState);
        this.treeDataProvider.setState(initialState);
        (0, context_1.setContext)("tabGroup.groups:allCollapsed" /* ContextKeys.AllCollapsed */, this.treeDataProvider.isAllCollapsed());
        const view = this._register(vscode.window.createTreeView('tabsTreeView', {
            treeDataProvider: this.treeDataProvider,
            dragAndDropController: this.treeDataProvider,
            canSelectMany: true
        }));
        this._register(this.treeDataProvider.onDidChangeTreeData(() => this.saveState(this.treeDataProvider.getState())));
        this._register(vscode.commands.registerCommand('tabsTreeView.tab.close', (tab) => vscode.window.tabGroups.close((0, TreeDataProvider_1.getNativeTabs)(tab))));
        this._register(vscode.commands.registerCommand('tabsTreeView.tab.ungroup', (tab) => this.treeDataProvider.ungroup(tab)));
        this._register(vscode.commands.registerCommand('tabsTreeView.group.rename', (group) => {
            vscode.window.showInputBox({ placeHolder: 'Name this Group', value: group.label }).then(input => {
                if (input) {
                    this.treeDataProvider.renameGroup(group, input);
                }
            });
        }));
        this._register(vscode.commands.registerCommand('tabsTreeView.group.cancelGroup', (group) => this.treeDataProvider.cancelGroup(group)));
        this._register(vscode.commands.registerCommand('tabsTreeView.group.close', (group) => {
            vscode.window.tabGroups.close(group.children.map((tab) => (0, TreeDataProvider_1.getNativeTabs)(tab)).flat());
        }));
        this._register(vscode.commands.registerCommand('tabsTreeView.reset', () => {
            WorkspaceState_1.WorkspaceState.setState([]);
            const initialState = this.initializeState();
            this.treeDataProvider.setState(initialState);
        }));
        this._register(vscode.commands.registerCommand('tabsTreeView.enableSortMode', () => {
            (0, context_1.setContext)("tabGroup.sortMode:enabled" /* ContextKeys.SortMode */, true);
            view.title = (view.title ?? '') + ' (Sorting)';
            this.treeDataProvider.toggleSortMode(true);
        }));
        this._register(vscode.commands.registerCommand('tabsTreeView.disableSortMode', () => {
            (0, context_1.setContext)("tabGroup.sortMode:enabled" /* ContextKeys.SortMode */, false);
            view.title = (view.title ?? '').replace(' (Sorting)', '');
            this.treeDataProvider.toggleSortMode(false);
        }));
        this._register(vscode.window.tabGroups.onDidChangeTabs(e => {
            this.treeDataProvider.appendTabs(e.opened);
            this.treeDataProvider.closeTabs(e.closed);
            if (e.changed[0] && e.changed[0].isActive) {
                const tab = this.treeDataProvider.getTab(e.changed[0]);
                if (tab) {
                    if (view.visible) {
                        this.exclusiveHandle.run(() => (0, async_1.asPromise)(view.reveal(tab, { select: true, expand: true })));
                    }
                }
            }
            this.treeDataProvider.triggerRerender();
        }));
        this._register(view.onDidChangeSelection(e => {
            if (e.selection.length > 0) {
                const item = e.selection[e.selection.length - 1];
                if (item.type === 0 /* TreeItemType.Tab */) {
                    this.exclusiveHandle.run(() => (0, async_1.asPromise)(this.treeDataProvider.activate(item)));
                }
            }
        }));
        this._register(vscode.commands.registerCommand('tabsTreeView.collapseAll', () => vscode.commands.executeCommand('list.collapseAll')));
        this._register(vscode.commands.registerCommand('tabsTreeView.expandAll', () => {
            for (const item of this.treeDataProvider.getState()) {
                if ((0, types_1.isGroup)(item) && item.children.length > 0) {
                    view.reveal(item, { expand: true });
                }
            }
        }));
        this._register(view.onDidExpandElement((element) => {
            if ((0, types_1.isGroup)(element.element)) {
                this.treeDataProvider.setCollapsedState(element.element, false);
                this.saveState(this.treeDataProvider.getState());
                (0, context_1.setContext)("tabGroup.groups:allCollapsed" /* ContextKeys.AllCollapsed */, false);
            }
        }));
        this._register(view.onDidCollapseElement((element) => {
            if ((0, types_1.isGroup)(element.element)) {
                this.treeDataProvider.setCollapsedState(element.element, true);
                this.saveState(this.treeDataProvider.getState());
                (0, context_1.setContext)("tabGroup.groups:allCollapsed" /* ContextKeys.AllCollapsed */, this.treeDataProvider.isAllCollapsed());
            }
        }));
    }
    initializeState() {
        const jsonItems = WorkspaceState_1.WorkspaceState.getState() ?? [];
        const nativeTabs = vscode.window.tabGroups.all.flatMap(tabGroup => tabGroup.tabs);
        return this.mergeState(jsonItems, nativeTabs);
    }
    mergeState(jsonItems, nativeTabs) {
        const mergedTabs = [];
        for (const jsonItem of jsonItems) {
            if (jsonItem.type === 0 /* TreeItemType.Tab */) {
                const length = nativeTabs.length;
                nativeTabs = nativeTabs.filter((nativeTab) => !this.isCorrespondingTab(nativeTab, jsonItem));
                if (nativeTabs.length < length) {
                    mergedTabs.push(jsonItem);
                }
            }
            else {
                const children = [];
                jsonItem.children.forEach(tab => {
                    const length = nativeTabs.length;
                    nativeTabs = nativeTabs.filter((nativeTab) => !this.isCorrespondingTab(nativeTab, tab));
                    if (nativeTabs.length < length) {
                        children.push(tab);
                    }
                });
                if (children.length > 0) {
                    mergedTabs.push({ ...jsonItem, children });
                }
            }
        }
        const tabMap = {}; // if there are same resources in multiple tab group, add only one
        nativeTabs.forEach(tab => {
            try {
                const id = (0, TabTypeHandler_1.getNormalizedTabId)(tab);
                if (!tabMap[id]) {
                    tabMap[id] = { type: 0 /* TreeItemType.Tab */, groupId: null, id };
                    mergedTabs.push(tabMap[id]);
                }
            }
            catch {
                // won't add unimplemented-typed tab into tree
            }
        });
        return mergedTabs;
    }
    saveState(state) {
        WorkspaceState_1.WorkspaceState.setState(state);
    }
    isCorrespondingTab(tab, jsonTab) {
        try {
            return jsonTab.id === (0, TabTypeHandler_1.getNormalizedTabId)(tab);
        }
        catch {
            return false;
        }
    }
}
exports.TabsView = TabsView;
