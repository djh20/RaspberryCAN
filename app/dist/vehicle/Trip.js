"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
const FileSystem_1 = __importDefault(require("../util/FileSystem"));
class Trip {
    constructor(path, info) {
        this.path = path;
        this.info = info;
    }
    async save() {
        return FileSystem_1.default.writeFile(this.path, JSON.stringify(this.info, null, 2));
    }
}
exports.Trip = Trip;
