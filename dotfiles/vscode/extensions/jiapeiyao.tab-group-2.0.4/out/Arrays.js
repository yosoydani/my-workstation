"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeRemove = void 0;
function safeRemove(array, item) {
    const index = array.indexOf(item);
    if (index === -1) {
        return;
    }
    array.splice(index, 1);
}
exports.safeRemove = safeRemove;
