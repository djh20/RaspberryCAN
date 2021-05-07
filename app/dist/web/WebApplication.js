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
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("../util/Logger"));
const pug_1 = require("pug");
class WebApplication {
    constructor(app) {
        this.app = app;
        this.expressApp = express_1.default();
    }
    start() {
        let pages = [
            {
                name: 'metrics',
                paths: ['/', '/metrics']
            },
            {
                name: 'map',
                paths: ['/map']
            },
            {
                name: 'settings',
                paths: ['/settings']
            },
            {
                name: 'logs',
                paths: ['/logs']
            }
        ];
        let staticPath = p.resolve(this.app.rootPath, 'web/static');
        let viewsPath = p.resolve(this.app.rootPath, 'web/views');
        this.expressApp.use(express_1.default.static(staticPath));
        pages.forEach(page => {
            let filePath = p.resolve(viewsPath, page.name + '.pug');
            page.template = pug_1.compileFile(filePath);
            page.paths.forEach(path => {
                this.expressApp.get(path, (req, res) => {
                    res.status(200).send(this.getPageData(page));
                });
            });
        });
        this.expressApp.get('/api/trips', (req, res) => {
            res.type('json');
            res.send(this.app.vehicle.tripManager.trips);
        });
        this.expressApp.get('/api/logs', (req, res) => {
            res.type('json');
            res.send(Logger_1.default.history);
        });
        Logger_1.default.info('Web', "Ready!");
    }
    getPageData(page) {
        return page.template({
            data: { page: page.name, config: this.app.config.data, version: this.app.version }
        });
    }
}
exports.default = WebApplication;
