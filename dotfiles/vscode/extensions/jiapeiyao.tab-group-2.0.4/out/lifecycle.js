"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disposable = void 0;
class Disposable {
    constructor() {
        this.store = new Set();
    }
    _register(disposable) {
        this.store.add(disposable);
        return disposable;
    }
    dispose() {
        this.store.forEach(disposable => disposable.dispose());
        this.store.clear();
    }
}
exports.Disposable = Disposable;
