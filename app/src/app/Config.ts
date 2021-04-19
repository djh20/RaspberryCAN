import FileSystem from '../util/FileSystem';
import Logger from '../util/Logger';

interface ConfigData {
  name?: string,
  port?: number,
  canInterface?: string,
  canDefinition?: string,
  gpsPort?: string
}
export default class Config {
  public data: ConfigData;
  private path: string;

  constructor(path: string) {
    this.path = path;
    this.data = {};
  }

  public async load() {
    // read the config file
    let file = await FileSystem.readFile({path: this.path, json: true});
    
    // check if json data was sent back
    if (file.json) {
      this.data.name = file.json.name || "RaspberryCAN";
      this.data.port = file.json.port || 8080;
      this.data.canInterface = file.json.can_interface || 'can0';
      this.data.canDefinition = file.json.can_definition || 'nissan-leaf-2011-ze0';
      this.data.gpsPort = file.json.gps_port;

      Logger.info('Config', "Loaded");
    } else {
      Logger.error('Config', "Failed to load!");
    }
  }
}