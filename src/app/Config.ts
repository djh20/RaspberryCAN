import FileSystem from '../util/FileSystem';

interface ConfigData {
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
      this.data.port = file.json.port || 8080;
      this.data.canInterface = file.json.can_interface || 'can0';
      this.data.canDefinition = file.json.can_definition || 'nissan-leaf-2011-ze0';
      this.data.gpsPort = file.json.gps_port;

      console.log("SUCCESS Load config");
    } else {
      console.log("ERROR Config failed to load");
    }
  }
}