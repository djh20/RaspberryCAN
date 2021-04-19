class Logger {
  info(prefix: string, msg: any) {
    console.log(`INFO [${prefix}] ${msg}`);
  }

  warn(prefix: string, msg: any) {
    console.log(`WARNING [${prefix}] ${msg}`);
  }

  error(prefix: string, msg: any) {
    console.log(`ERROR [${prefix}] ${msg}`);
  }
}

export default new Logger();