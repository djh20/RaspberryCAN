"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem_1 = __importDefault(require("../util/FileSystem"));
class Config {
    constructor(path) {
        this.path = path;
        this.data = {};
    }
    async load() {
        // read the config file
        let file = await FileSystem_1.default.readFile({ path: this.path, json: true });
        // check if json data was sent back
        if (file.json) {
            this.data.port = file.json.port || 8080;
            this.data.canInterface = file.json.can_interface || 'can0';
            this.data.canDefinition = file.json.can_definition || 'nissan-leaf-2011-ze0';
            this.data.gpsPort = file.json.gps_port;
            console.log("SUCCESS Load config");
        }
        else {
            console.log("ERROR Config failed to load");
        }
    }
}
exports.default = Config;
