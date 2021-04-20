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
const socketcan = __importStar(require("socketcan"));
const Logger_1 = __importDefault(require("../util/Logger"));
class CanModule {
    constructor(vehicle) {
        this.vehicle = vehicle;
    }
    connect(channelName) {
        try {
            this.channel = socketcan.createRawChannel(channelName, false, null);
            Logger_1.default.info('CAN', "Connected!");
        }
        catch (err) {
            Logger_1.default.warn('CAN', "Failed to connect!");
        }
    }
    listen() {
        if (!this.channel)
            return;
        this.channel.addListener('onMessage', (frame) => {
            if (!this.vehicle.definition)
                return;
            let group = this.vehicle.definition.can.find(g => g.id == frame.id);
            if (!group)
                return;
            group.points.forEach(point => {
                let metric = this.vehicle.getMetric(point);
                metric.setValue(point.process(frame.data));
            });
        });
        this.channel.start();
    }
}
exports.default = CanModule;
