import * as p from 'path';
import FileSystem from '../util/FileSystem';
import Vehicle from "../vehicle/Vehicle";
import { CanDefinition } from '../vehicle/Can';
import Config from './Config';
import WebSocketServer from './WebSocket';

export default class App {
  public rootPath: string;
  public vehicle: Vehicle;
  public ws: WebSocketServer;
  public config: Config;

  private definitionsPath: string;
  private configPath: string;

  constructor() {
    this.vehicle = new Vehicle();
    this.rootPath = p.resolve(__dirname, '../../');

    this.definitionsPath = p.resolve(this.rootPath, 'definitions');
    this.configPath = p.resolve(this.rootPath, 'config.json');

    this.config = new Config(this.configPath);
    this.ws = new WebSocketServer(this);
  }

  async start() {
    await this.config.load();

    // TODO: move this connection logic into the vehicle class (under a connect() method).
    // this would allow multiple vehicles instances to be running at the same time.
    
    let definitions = await this.getDefinitions();
    let definition = definitions.find(d => d.id == this.config.data.canDefinition);
    
    if (definition) {
      this.vehicle.can.definition = definition;
      this.vehicle.can.connect(this.config.data.canInterface);
      this.vehicle.can.listen();
    }

    let gpsPort = this.config.data.gpsPort;
    if (gpsPort) {
      await this.vehicle.gps.connect(gpsPort);
      this.vehicle.gps.listen();
    }

    this.ws.start(this.config.data.port);
  }

  async getDefinitions(): Promise<CanDefinition[]> {
    let directory = await FileSystem.readDirectory({path: this.definitionsPath});
    return directory.children.map(child => require(child.path));
  }
}