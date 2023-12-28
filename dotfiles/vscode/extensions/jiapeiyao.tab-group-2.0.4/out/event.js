"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExclusiveHandle = void 0;
/**
 * When an change event is fired, prevent mutual event triggering (infinite loop)
 */
class ExclusiveHandle {
    constructor() {
        this.running = undefined;
    }
    run(listener) {
        this.running ?? (this.running = Promise.resolve(listener()).finally(() => this.running = undefined));
        return this.running;
    }
}
exports.ExclusiveHandle = ExclusiveHandle;
