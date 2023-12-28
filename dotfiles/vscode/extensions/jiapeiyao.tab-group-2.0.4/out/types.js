"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSlot = exports.isGroup = exports.isTab = void 0;
;
function isTab(item) {
    return item.type === 0 /* TreeItemType.Tab */;
}
exports.isTab = isTab;
function isGroup(item) {
    return item.type === 1 /* TreeItemType.Group */;
}
exports.isGroup = isGroup;
function isSlot(item) {
    return item.type === 2 /* TreeItemType.Slot */;
}
exports.isSlot = isSlot;
