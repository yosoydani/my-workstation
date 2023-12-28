"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextColorId = void 0;
const colorIds = [
    "charts.foreground",
    "charts.lines",
    "charts.red",
    "charts.blue",
    "charts.yellow",
    "charts.orange",
    "charts.green",
    "charts.purple",
];
function getNextColorId(usedColorIds = []) {
    const colorIdsUseCount = colorIds.map(colorId => usedColorIds.filter(usedColorId => usedColorId === colorId).length);
    const smallestUseCount = Math.min(...colorIdsUseCount);
    const firstSmallestUseCountIndex = colorIdsUseCount.indexOf(smallestUseCount);
    return colorIds[firstSmallestUseCountIndex];
}
exports.getNextColorId = getNextColorId;
