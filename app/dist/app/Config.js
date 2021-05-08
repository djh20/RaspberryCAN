"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystem_1 = __importDefault(require("../util/FileSystem"));
const Logger_1 = __importDefault(require("../util/Logger"));
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
            this.data.name = file.json.name || "RaspberryCAN";
            this.data.port = file.json.port || 8080;
            this.data.canInterface = file.json.can_interface || 'can0';
            this.data.canDefinition = file.json.definition;
            this.data.gpsPort = file.json.gps_port;
            Logger_1.default.info('Config', "Loaded");
        }
        else {
            Logger_1.default.error('Config', "Failed to load!");
        }
    }
}
exports.default = Config;
