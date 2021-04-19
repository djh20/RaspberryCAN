"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p = __importStar(require("path"));
const FileSystem_1 = __importDefault(require("../util/FileSystem"));
const Vehicle_1 = __importDefault(require("../vehicle/Vehicle"));
const Config_1 = __importDefault(require("./Config"));
const WebSocket_1 = __importDefault(require("../web/WebSocket"));
const Gps_1 = __importDefault(require("../vehicle/Gps"));
const WebApplication_1 = __importDefault(require("../web/WebApplication"));
const http_1 = require("http");
const Logger_1 = __importDefault(require("../util/Logger"));
class App {
    constructor() {
        this.vehicle = new Vehicle_1.default();
        this.rootPath = p.resolve(__dirname, '../../../');
        this.definitionsPath = p.resolve(this.rootPath, 'definitions');
        this.configPath = p.resolve(this.rootPath, 'config.json');
        this.config = new Config_1.default(this.configPath);
        this.ws = new WebSocket_1.default(this);
        this.webApp = new WebApplication_1.default(this);
        this.server = new http_1.Server(this.webApp.expressApp);
    }
    async start() {
        await this.config.load();
        // TODO: move this connection logic into the vehicle class (under a connect() method).
        // this would allow multiple vehicles instances to be running at the same time.
        let definitions = await this.getDefinitions();
        let definition = definitions.find(d => d.id == this.config.data.canDefinition);
        if (definition) {
            this.vehicle.setDefinition(definition);
            this.vehicle.can.connect(this.config.data.canInterface);
            this.vehicle.can.listen();
        }
        let gpsPort = this.config.data.gpsPort;
        if (gpsPort) {
            this.vehicle.gps = new Gps_1.default(this.vehicle);
            let connected = await this.vehicle.gps.connect(gpsPort);
            if (connected)
                this.vehicle.gps.listen();
        }
        let port = this.config.data.port;
        this.server.listen(port, () => {
            Logger_1.default.info('Server', `Listening on port ${port}`);
            this.ws.start(this.server);
            this.webApp.start();
        });
    }
    async getDefinitions() {
        let directory = await FileSystem_1.default.readDirectory({ path: this.definitionsPath });
        return directory.children.map(child => require(child.path));
    }
}
exports.default = App;
