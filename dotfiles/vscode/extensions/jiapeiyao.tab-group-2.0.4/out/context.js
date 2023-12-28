"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = exports.getContext = void 0;
const vscode = require("vscode");
const async_1 = require("./async");
;
const context = {};
function getContext(key, defaultValue) {
    return context[key] ?? defaultValue;
}
exports.getContext = getContext;
async function setContext(key, value) {
    context[key] = value;
    return (0, async_1.asPromise)(vscode.commands.executeCommand('setContext', key, value));
}
exports.setContext = setContext;
