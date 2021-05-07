"use strict";
/*
This module is a wrapper for the built-in 'fs' module.
It's much better than the default module, as it features promisies,
and it's just much easier to use overall.
*/
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
const node_fs = __importStar(require("fs"));
const p = __importStar(require("path"));
var FileSystem;
(function (FileSystem) {
    function readFile(params) {
        // if a directory is given, use path to get the full path
        if (params.dir)
            params.path = p.resolve(params.dir, params.path);
        return new Promise((resolve, reject) => {
            node_fs.readFile(params.path, { encoding: params.encoding || 'utf-8' }, (err, data) => {
                resolve({
                    data: data,
                    json: params.json && data ? JSON.parse(data) : undefined
                });
            });
        });
    }
    FileSystem.readFile = readFile;
    function createDirectory(path) {
        return new Promise((resolve, reject) => {
            node_fs.mkdir(path, (err) => {
                !err ? resolve(true) : resolve(false);
            });
        });
    }
    FileSystem.createDirectory = createDirectory;
    function readDirectory(params) {
        // if a directory is given, use path to get the full path
        if (params.dir)
            params.path = p.resolve(params.dir, params.path);
        return new Promise((resolve, reject) => {
            node_fs.readdir(params.path, (err, data) => {
                let children = [];
                for (let file_name of data) {
                    let path = p.resolve(params.path, file_name);
                    children.push({ name: file_name, path: path });
                }
                resolve({ children: children });
            });
        });
    }
    FileSystem.readDirectory = readDirectory;
})(FileSystem || (FileSystem = {}));
exports.default = FileSystem;
