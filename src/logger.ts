export default class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  info(msg: any) {
    console.log(`[${this.prefix}] ${msg}`);
  }

  warn(msg: any) {
    console.log(`WARNING: [${this.prefix}] ${msg}`)
  }

  error(msg: any) {
    console.log(`ERROR: [${this.prefix}] ${msg}`)
  }
}