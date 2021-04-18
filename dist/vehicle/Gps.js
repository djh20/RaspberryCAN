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
class GpsModule {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.gps = new gps_1.default();
        this.travelled = 0;
    }
    update() {
        let lat = this.gps.state.lat;
        let lon = this.gps.state.lon;
        if (lat == null || lon == null)
            return;
        if (lat == this.lat && lon == this.lon)
            return;
        // this makes sure we're in a gear that isn't park
        // (we can't be moving if we're in park)
        // this should be changed to actually support other cars
        // as not all vehicles will have the same gear metric.
        let gear = this.vehicle.metrics.get('gear');
        if (this.lat != null && this.lon != null && gear && gear.value != 0 && gear.value != 1) {
            let distance = gps_1.default.Distance(this.lat, this.lon, lat, lon) * 1000; // convert from km to m
            distance = Math.round((distance + Number.EPSILON) * 100) / 100;
            console.log(`Moved: ${distance}m`);
            // to try and correct for gps wandering and glitching.
            // this isn't a very good way of doing it, it should probably be changed.
            if (distance <= 0.3 || distance >= 1000)
                return;
            this.travelled += distance;
            this.updateMetric();
        }
        this.lat = lat;
        this.lon = lon;
    }
    updateMetric() {
        let metric = this.vehicle.getMetric({
            name: 'travelled',
            id: 255,
            convert: (value) => new Uint16Array([value / 100])
        });
        metric.setValue(this.travelled);
    }
    reset() {
        this.travelled = 0;
        this.updateMetric();
    }
    listen() {
        if (!this.socket)
            return;
        let parser = this.socket.pipe(new serialport_1.parsers.Readline({ delimiter: '\r\n' }));
        parser.on('data', data => this.gps.update(data));
        setInterval(() => this.update(), 3000);
    }
    connect(port) {
        return new Promise((resolve, reject) => {
            let socket = new serialport_1.default(port, { baudRate: 9600 }, (err) => {
                if (!err)
                    console.log("SUCCESS Initalize GPS");
                resolve();
            });
            this.socket = socket;
        });
    }
}
exports.default = GpsModule;
