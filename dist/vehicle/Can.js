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
Object.defineProperty(exports, "__esModule", { value: true });
const socketcan = __importStar(require("socketcan"));
class CanModule {
    constructor(vehicle) {
        this.vehicle = vehicle;
    }
    connect(channelName) {
        try {
            this.channel = socketcan.createRawChannel(channelName);
            console.log("SUCCESS Initalize cansocket");
        }
        catch (err) {
            console.log("ERROR Failed to create cansocket");
        }
    }
    listen() {
        if (!this.channel)
            return;
        this.channel.addListener('onMessage', (frame) => {
            if (!this.definition)
                return;
            let group = this.definition.groups.find(g => g.id == frame.id);
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
