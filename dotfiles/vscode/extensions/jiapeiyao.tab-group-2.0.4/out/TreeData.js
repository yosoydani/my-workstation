"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeData = void 0;
const crypto_1 = require("crypto");
const Arrays_1 = require("./Arrays");
const color_1 = require("./color");
const types_1 = require("./types");
class TreeData {
    constructor() {
        this.root = [];
        /**
         * To quickly access group
         */
        this.groupMap = {};
        /**
         * To quickly access tab
         */
        this.tabMap = {};
    }
    setState(state) {
        this.root = state;
        this.tabMap = {};
        this.groupMap = {};
        for (const item of this.root) {
            if (item.type === 0 /* TreeItemType.Tab */) {
                this.tabMap[item.id] = item;
            }
            else {
                this.groupMap[item.id] = item;
                for (const child of item.children) {
                    this.tabMap[child.id] = child;
                }
            }
        }
    }
    getState() {
        this.removeEmptyGroups();
        return this.root;
    }
    removeEmptyGroups() {
        for (let i = this.root.length - 1; i >= 0; i--) {
            const item = this.root[i];
            if ((0, types_1.isGroup)(item) && item.children.length === 0) {
                this.root.splice(i, 1);
                delete this.groupMap[item.id];
            }
        }
    }
    getChildren(element) {
        if (!element) {
            this.removeEmptyGroups();
            return this.root;
        }
        if (element.type === 0 /* TreeItemType.Tab */) {
            return null;
        }
        return element.children;
    }
    getParent(element) {
        if (element.type === 1 /* TreeItemType.Group */) {
            return undefined;
        }
        if (element.groupId === null) {
            return undefined;
        }
        return this.groupMap[element.groupId];
    }
    _insertTabToGroup(tab, group, index) {
        tab.groupId = group.id;
        group.children.splice(index ?? group.children.length, 0, tab);
    }
    _insertTabToRoot(tab, index) {
        tab.groupId = null;
        this.root.splice(index ?? this.root.length, 0, tab);
    }
    _removeTab(tab) {
        const from = tab.groupId === null ? this.root : this.groupMap[tab.groupId].children;
        (0, Arrays_1.safeRemove)(from, tab);
        tab.groupId = null;
    }
    _getUsedColorIds() {
        return Object.values(this.groupMap).map(group => group.colorId);
    }
    ;
    group(target, tabs) {
        if (tabs.length === 0) {
            return;
        }
        if ((0, types_1.isGroup)(target)) {
            tabs.forEach(tab => this._group(target, tab));
            return;
        }
        if (target.groupId) {
            const group = this.groupMap[target.groupId];
            const index = group.children.indexOf(target);
            tabs.forEach(tab => this._group(group, tab, index));
            return;
        }
        const group = {
            type: 1 /* TreeItemType.Group */,
            colorId: (0, color_1.getNextColorId)(this._getUsedColorIds()),
            id: (0, crypto_1.randomUUID)(),
            label: '',
            children: [],
            collapsed: false,
        };
        this.groupMap[group.id] = group;
        this.root.splice(this.root.indexOf(target), 1, group);
        this._insertTabToGroup(target, group);
        tabs.forEach(tab => this._group(group, tab));
        return;
    }
    _group(group, tab, index) {
        this._removeTab(tab);
        this._insertTabToGroup(tab, group, index);
    }
    ungroup(tabs, pushBack = false) {
        tabs.forEach(tab => {
            if (tab.groupId === null) {
                return;
            }
            const group = this.groupMap[tab.groupId];
            const index = this.root.indexOf(group);
            (0, Arrays_1.safeRemove)(group.children, tab);
            tab.groupId = null;
            this._insertTabToRoot(tab, pushBack ? undefined : index + 1);
        });
    }
    appendTab(tabId) {
        if (!this.tabMap[tabId]) {
            this.tabMap[tabId] = {
                type: 0 /* TreeItemType.Tab */,
                groupId: null,
                id: tabId,
            };
            this.root.push(this.tabMap[tabId]);
        }
    }
    deleteTab(tabId) {
        const tab = this.tabMap[tabId];
        this._removeTab(tab);
        delete this.tabMap[tabId];
    }
    getTab(tabId) {
        return this.tabMap[tabId];
    }
    getGroup(groupId) {
        return this.groupMap[groupId];
    }
    renameGroup(group, input) {
        group.label = input;
    }
    cancelGroup(group) {
        this.ungroup(group.children.slice(0).reverse());
    }
    moveTo(target, draggeds) {
        if ((0, types_1.isTab)(target) && target.groupId) {
            const draggedTabs = draggeds.filter(types_1.isTab);
            draggedTabs.forEach(tab => this._removeTab(tab));
            const group = this.groupMap[target.groupId];
            group.children.splice(group.children.indexOf(target), 0, ...draggedTabs);
            draggedTabs.forEach(tab => tab.groupId = target.groupId);
            return;
        }
        draggeds.forEach(dragged => {
            if ((0, types_1.isGroup)(dragged)) {
                (0, Arrays_1.safeRemove)(this.root, dragged);
            }
            else {
                this._removeTab(dragged);
            }
        });
        this.root.splice(this.root.indexOf(target), 0, ...draggeds);
    }
    pushBack(groupId, draggeds) {
        if (groupId) {
            const draggedTabs = draggeds.filter(types_1.isTab);
            draggedTabs.forEach(tab => this._removeTab(tab));
            this.groupMap[groupId].children.push(...draggedTabs);
            draggedTabs.forEach(tab => tab.groupId = groupId);
            return;
        }
        draggeds.forEach(dragged => {
            if ((0, types_1.isGroup)(dragged)) {
                (0, Arrays_1.safeRemove)(this.root, dragged);
            }
            else {
                this._removeTab(dragged);
            }
        });
        this.root.push(...draggeds);
    }
    isAllCollapsed() {
        for (const item of this.root) {
            if ((0, types_1.isGroup)(item) && !item.collapsed) {
                return false;
            }
        }
        return true;
    }
    setCollapsedState(group, collapsed) {
        this.groupMap[group.id].collapsed = collapsed;
    }
}
exports.TreeData = TreeData;
