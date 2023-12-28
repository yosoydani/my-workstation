"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkspaceState_1 = require("./WorkspaceState");
const TreeView_1 = require("./TreeView");
function activate(context) {
    WorkspaceState_1.WorkspaceState.use(context);
    context.subscriptions.push(new TreeView_1.TabsView());
}
// this method is called when your extension is deactivated
function deactivate() { }
// eslint-disable-next-line no-undef
module.exports = {
    activate,
    deactivate
};
