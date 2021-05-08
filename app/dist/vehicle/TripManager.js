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
const Trip_1 = require("./Trip");
class TripManager {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.trips = [];
    }
    async load(folderPath) {
        let directory = await FileSystem_1.default.readDirectory({ path: folderPath });
        for (let child of directory.children) {
            let trip = await this.loadTrip(child.path);
            if (trip.info.timeEnd == null)
                this.currentTrip = trip;
        }
        this.folderPath = folderPath;
    }
    async addWaypoint(lat, lon) {
        // TODO: manage files
        if (!this.currentTrip) {
            let path = p.resolve(this.folderPath, `trip_${Date.now()}.json`);
            this.currentTrip = await this.loadTrip(path);
        }
        let metrics = {};
        for (let metric of this.vehicle.metrics.values()) {
            // if the metric is loggable, add it to the metrics object.
            if (metric.point.log)
                metrics[metric.point.name] = metric.value;
        }
        this.currentTrip.info.waypoints.push({ lat: lat, lon: lon, metrics: metrics });
        this.currentTrip.save();
    }
    endTrip() {
        if (!this.currentTrip)
            return;
        this.currentTrip.info.timeEnd = Date.now();
        this.currentTrip.save();
        this.currentTrip = null;
    }
    async loadTrip(path) {
        let data = await FileSystem_1.default.readFile({ path: path, json: true });
        let json = data.json || { timeStart: Date.now(), timeEnd: null, waypoints: [] };
        let trip = new Trip_1.Trip(path, json);
        this.trips.push(trip);
        return trip;
    }
}
exports.default = TripManager;
