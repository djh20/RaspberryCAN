"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem_1 = __importDefault(require("../util/FileSystem"));
const Trip_1 = require("./Trip");
class TripManager {
    constructor() {
        this.trips = [];
    }
    async load(folderPath) {
        let directory = await FileSystem_1.default.readDirectory({ path: folderPath });
        for (let child of directory.children) {
            let data = await FileSystem_1.default.readFile({ path: child.path, json: true });
            this.trips.push(new Trip_1.Trip(data.json));
        }
    }
}
exports.default = TripManager;
