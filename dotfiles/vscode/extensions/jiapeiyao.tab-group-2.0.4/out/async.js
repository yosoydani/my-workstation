"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asPromise = void 0;
function asPromise(thenable) {
    return new Promise((resolve, reject) => thenable.then(resolve, reject));
}
exports.asPromise = asPromise;
