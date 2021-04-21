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
const gps_1 = __importDefault(require("gps"));
const serialport_1 = __importStar(require("serialport"));
const Logger_1 = __importDefault(require("../util/Logger"));
class GpsModule {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.gps = new gps_1.default();
        this.travelled = 0;
        this.connected = false;
    }
    listen() {
        if (!this.socket)
            return;
        let parser = this.socket.pipe(new serialport_1.parsers.Readline({ delimiter: '\r\n' }));
        parser.on('data', data => {
            try {
                this.gps.update(data);
            }
            catch (err) {
                Logger_1.default.info('GPS', "Error while parsing data, ignoring...");
            }
            ;
        });
        setInterval(() => this.update(), 3000);
        this.update();
    }
    connect(port) {
        return new Promise((resolve) => {
            let socket = new serialport_1.default(port, { baudRate: 9600 }, (err) => {
                if (!err) {
                    Logger_1.default.info('GPS', "Connected!");
                    this.connected = true;
                    resolve(true);
                }
                else {
                    Logger_1.default.warn('GPS', "Failed to connect!");
                    this.connected = false;
                    resolve(false);
                }
            });
            this.socket = socket;
        });
    }
    update() {
        let lat = this.gps.state.lat;
        let lon = this.gps.state.lon;
        this.locked = lat != null && lon != null;
        this.statusMetric = this.vehicle.getMetric({
            name: 'gps_status',
            id: 254
        });
        this.tripMetric = this.vehicle.getMetric({
            name: 'gps_trip_distance',
            id: 255,
            convert: (value) => new Uint16Array([value / 100])
        });
        this.statusMetric.setValue(this.locked ? 1 : 0);
        if (!this.locked)
            return;
        if (lat == this.lat && lon == this.lon)
            return;
        let info = this.vehicle.definition.getInfo(this.vehicle.metrics);
        if (this.lat != null && this.lon != null && info.moving) {
            let distance = gps_1.default.Distance(this.lat, this.lon, lat, lon) * 1000; // convert from km to m
            distance = Math.round((distance + Number.EPSILON) * 100) / 100;
            // to try and correct for gps wandering and glitching.
            // this isn't a very good way of doing it, it should probably be changed.
            if (distance <= 0.3 || distance >= 1000)
                return;
            this.travelled += distance;
            Logger_1.default.info('GPS', `Moved ${distance}m (total: ${this.travelled}m)`);
            this.tripMetric.setValue(this.travelled);
        }
        this.lat = lat;
        this.lon = lon;
    }
    reset() {
        this.travelled = 0;
        if (!this.tripMetric)
            return;
        this.tripMetric.setValue(0);
    }
}
exports.default = GpsModule;
