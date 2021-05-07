class Logger {
  public history: LogMessage[];

  constructor() {
    this.history = [];
  }

  info(prefix: string, msg: any) {
    this.send('INFO', prefix, msg);
  }

  warn(prefix: string, msg: any) {
    this.send('WARNING', prefix, msg);
  }

  error(prefix: string, msg: any) {
    this.send('ERROR', prefix, msg);
  }

  private send(type: string, prefix: string, msg: any) {
    console.log(`${type} [${prefix}] ${msg}`);
    this.history.push({type:type, prefix:prefix, message:msg});
  }
}

interface LogMessage {
  type: string;
  prefix: string;
  message: string;
}

export default new Logger();