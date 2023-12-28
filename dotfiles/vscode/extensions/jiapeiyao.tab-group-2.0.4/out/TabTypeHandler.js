"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalizedTabId = exports.TabInputWebviewHandler = exports.TabInputCustomHandler = exports.TabInputTextDiffHandler = exports.TabInputTextHandler = exports.getHandler = exports.unknownInputTypeHandler = exports.UnknownInputTypeHandler = void 0;
const path = require("node:path");
const vscode = require("vscode");
const TreeDataProvider_1 = require("./TreeDataProvider");
const handlers = [];
function getNormalizedIdForUnknownObject(input) {
    const getNormalizedObject = (object, depth = 2) => {
        const result = {};
        for (const key of Object.keys(object).sort()) {
            if (typeof object[key] === 'object' && !Array.isArray(object[key]) && object[key] !== null) {
                result[key] = depth > 0 ? getNormalizedObject(object[key], depth - 1) : object[key].toString();
            }
            result[key] = object[key];
        }
        return result;
    };
    return JSON.stringify(getNormalizedObject(input));
}
/**
 * This class is a default for logic safety.
 * Unknown-typed tab won't be added to the tree data, because we cannot find the way to find a unique id which can bind tree data and actual tab.
 */
class UnknownInputTypeHandler {
    constructor() {
        this.name = 'unknownInputType';
    }
    is(tab) {
        return true;
    }
    getNormalizedId(tab) {
        if (typeof tab.input === 'object' && tab.input !== null) {
            return `${tab.label}:${getNormalizedIdForUnknownObject(tab.input)}`;
        }
        if (tab.input === undefined) {
            return tab.label;
        }
        return `${tab.label}:${tab.input.toString()}`;
    }
    createTreeItem(tab) {
        return new vscode.TreeItem(tab.label);
    }
    openEditor(tab) {
        return Promise.resolve();
    }
}
exports.UnknownInputTypeHandler = UnknownInputTypeHandler;
exports.unknownInputTypeHandler = new UnknownInputTypeHandler();
function getHandler(tab, useDefault) {
    for (const handler of handlers) {
        if (handler.is(tab)) {
            return handler;
        }
    }
    return useDefault ? exports.unknownInputTypeHandler : undefined;
}
exports.getHandler = getHandler;
/**
 * Register handler
 * Note: The order matters! Place more specifc handler before the general one. e.g. `TabInputReadmePreviewHandler`, then `TabInputWebviewHandler`
 * @param ctor
 */
function Registered(ctor) {
    handlers.push(new ctor());
}
let TabInputTextHandler = class TabInputTextHandler {
    constructor() {
        this.name = "TabInputText";
    }
    is(tab) {
        return tab.input instanceof vscode.TabInputText;
    }
    getNormalizedId(tab) {
        return tab.input.uri.toString();
    }
    createTreeItem(tab) {
        return new vscode.TreeItem(tab.input.uri);
    }
    async openEditor(tab) {
        await vscode.commands.executeCommand("vscode.open", tab.input.uri, { viewColumn: tab.group.viewColumn }).then(undefined, (e) => console.error(e));
        return;
    }
};
TabInputTextHandler = __decorate([
    Registered
], TabInputTextHandler);
exports.TabInputTextHandler = TabInputTextHandler;
let TabInputTextDiffHandler = class TabInputTextDiffHandler {
    constructor() {
        this.name = "TabInputTextDiff";
    }
    is(tab) {
        return tab.input instanceof vscode.TabInputTextDiff;
    }
    getNormalizedId(tab) {
        return JSON.stringify({
            original: tab.input.original.toJSON(),
            modified: tab.input.modified.toJSON(),
        });
    }
    createTreeItem(tab) {
        const treeItem = new vscode.TreeItem(tab.input.modified);
        treeItem.label = tab.label;
        // generate discription
        var originalFilePathArray = tab.input.original.fsPath.split(path.sep);
        var modifiedFilePathArray = tab.input.modified.fsPath.split(path.sep);
        var filePathArray = new Array();
        filePathArray.push(originalFilePathArray);
        filePathArray.push(modifiedFilePathArray);
        if (originalFilePathArray[originalFilePathArray.length - 1] == modifiedFilePathArray[modifiedFilePathArray.length - 1]) {
            var commonAncestorDirIndex = (0, TreeDataProvider_1.findLongestCommonFilePathPrefixIndex)(filePathArray);
            treeItem.description = path.join(...originalFilePathArray.slice(commonAncestorDirIndex + 1, -1))
                + " - " + path.join(...modifiedFilePathArray.slice(commonAncestorDirIndex + 1, -1));
        }
        return treeItem;
    }
    async openEditor(tab) {
        await vscode.commands.executeCommand("vscode.diff", tab.input.original, tab.input.modified, tab.label, { viewColumn: tab.group.viewColumn }).then(undefined, (e) => console.error(e));
        return;
    }
};
TabInputTextDiffHandler = __decorate([
    Registered
], TabInputTextDiffHandler);
exports.TabInputTextDiffHandler = TabInputTextDiffHandler;
let TabInputCustomHandler = class TabInputCustomHandler {
    constructor() {
        this.name = "TabInputCustom";
    }
    is(tab) {
        return tab.input instanceof vscode.TabInputCustom;
    }
    getNormalizedId(tab) {
        return JSON.stringify({
            uri: tab.input.uri.path,
            viewType: tab.input.viewType,
        });
    }
    createTreeItem(tab) {
        return new vscode.TreeItem(tab.input.uri);
    }
    async openEditor(tab) {
        await vscode.commands.executeCommand("vscode.openWith", tab.input.uri, tab.input.viewType, { viewColumn: tab.group.viewColumn }).then(undefined, (e) => console.error(e));
        return;
    }
};
TabInputCustomHandler = __decorate([
    Registered
], TabInputCustomHandler);
exports.TabInputCustomHandler = TabInputCustomHandler;
let TabInputWebviewHandler = class TabInputWebviewHandler {
    constructor() {
        this.name = "TabInputWebview";
    }
    is(tab) {
        return tab.input instanceof vscode.TabInputWebview;
    }
    getNormalizedId(tab) {
        return tab.input.viewType;
    }
    createTreeItem(tab) {
        return new vscode.TreeItem(tab.label);
    }
    async openEditor(tab) {
        return Promise.resolve();
    }
};
TabInputWebviewHandler = __decorate([
    Registered
], TabInputWebviewHandler);
exports.TabInputWebviewHandler = TabInputWebviewHandler;
class UnimplementedError extends Error {
    constructor(message) {
        super(message);
    }
}
function getNormalizedTabId(tab) {
    const handler = getHandler(tab);
    if (!handler) {
        throw new UnimplementedError();
    }
    return handler.getNormalizedId(tab);
}
exports.getNormalizedTabId = getNormalizedTabId;
