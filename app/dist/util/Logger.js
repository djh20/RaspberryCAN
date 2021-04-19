"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    info(prefix, msg) {
        console.log(`INFO [${prefix}] ${msg}`);
    }
    warn(prefix, msg) {
        console.log(`WARNING [${prefix}] ${msg}`);
    }
    error(prefix, msg) {
        console.log(`ERROR [${prefix}] ${msg}`);
    }
}
exports.default = new Logger();
