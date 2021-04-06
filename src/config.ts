import FileManager from './filemanager';
import Logger from './logger';

interface ConfigData {
  port?: number | string;
  plugins?: any;
}
export default class Config {
  public data: ConfigData;

  private path: string;
  private logger: Logger;
  
  constructor(path: string) {
    this.path = path;
    this.data = {};
    this.logger = new Logger('Config');
  }
  
  public async load() {
    this.logger.info('Loading file...');

    // read the config file
    let file = await FileManager.readFile({path: this.path, json: true});

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