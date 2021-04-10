import App from './app';
import Logger from './logger';

interface ConfigData {
  port?: number | string;
  plugins?: any;
}
export default class Config {
  public data: ConfigData;

  private app: App;
  private path: string;
  private logger: Logger;
  
  constructor(app: App, path: string) {
    this.app = app;
    this.path = path;
    this.data = {};
    this.logger = new Logger('Config');
  }
  
  public async load() {
    this.logger.info('Loading file...');

    // read the config file
    let file = await this.app.fileManager.readFile({path: this.path, json: true});

    // check if json data was sent back
    if (file.json) {
      this.logger.info('Successfully loaded!')
      this.data.port = file.json.port || 8080;
      this.data.plugins = file.json.plugins || {};
    } else {
      this.logger.warn('Failed to load config data, using defaults...');
    }
  }
}