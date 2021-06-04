"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./app/App"));
const Logger_1 = __importDefault(require("./util/Logger"));
const VERSION = "2021.06-1d";
console.log(`RaspberryCAN (${VERSION})`);
Logger_1.default.info('App', `Starting...`);
const app = new App_1.default(VERSION);
app.start();
