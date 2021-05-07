"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor() {
        this.history = [];
    }
    info(prefix, msg) {
        this.send('INFO', prefix, msg);
    }
    warn(prefix, msg) {
        this.send('WARNING', prefix, msg);
    }
    error(prefix, msg) {
        this.send('ERROR', prefix, msg);
    }
    send(type, prefix, msg) {
        console.log(`${type} [${prefix}] ${msg}`);
        this.history.push({ type: type, prefix: prefix, message: msg });
    }
}
exports.default = new Logger();
