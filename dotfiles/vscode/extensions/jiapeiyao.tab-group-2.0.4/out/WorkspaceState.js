"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceState = void 0;
class WorkspaceState {
    static use(context) {
        WorkspaceState.context = context;
    }
    static getState() {
        return WorkspaceState.context.workspaceState.get(WorkspaceState.workspaceStateKey);
    }
    /**
     *
     * @param state state information that can be "JSON.stringify"ed
     */
    static setState(state) {
        WorkspaceState.context.workspaceState.update(WorkspaceState.workspaceStateKey, state);
    }
}
exports.WorkspaceState = WorkspaceState;
WorkspaceState.workspaceStateKey = 'tabs.workspace.state.key';
