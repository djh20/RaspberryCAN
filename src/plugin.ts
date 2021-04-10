import { EventEmitter } from 'events';
import * as p from 'path';
import App from "./app";
import Logger from './logger';

export default class AppPluginManager {
  public app: App;
  public path: string;
  public plugins: Map<string, AppPlugin>;
  public events: EventEmitter;

  private logger: Logger;

  constructor(app: App) {
    this.app = app;
    this.path = p.resolve(__dirname, '../plugins');
    this.plugins = new Map<string, AppPlugin>();
    this.logger = new Logger('Plugins');
    this.events = new EventEmitter();
  }
  
  public async load() {
    this.logger.info('Loading plugins...');

    // read the plugin directory
    let directory = await this.app.fileManager.readDirectory({path: this.path});

    // iterate through each child and create an AppPlugin instance for it
    for (let name of directory.children) {
      // get plugin config from main config
      let config = this.app.config.data.plugins[name];
      if (!config || !config.enabled) continue;

      let plugin = new AppPlugin(this, {
        name: name, 
        path: p.resolve(this.path, name), 
        config: config
      });

      let loaded = await plugin.load(); // load the plugin
      if (loaded) {
        this.logger.info(`- ${name} (loaded)`);
        this.plugins.set(name, plugin);
      } else {
        this.logger.info(`- ${name} (failed to load)`);
      }
    }
  }

  public start() {
    this.plugins.forEach((plugin) => {
      if (!plugin.instance?.start) return;
      plugin.instance.start();
    });
  }
}

export class AppPlugin extends EventEmitter {
  public name: string;
  public path: string;
  public logger: Logger;
  public instance?: AppPluginStructure;
  public manager: AppPluginManager;
  public data: any[];

  private config?: any;

  constructor(manager: AppPluginManager, params: {name: string, path: string, config: any}) {
    super();
    this.manager = manager;
    this.name = params.name;
    this.path = params.path;
    this.config = params.config;
    this.logger = new Logger(this.name);
    this.data = [];
  }

  public async load(): Promise<boolean> {
    let index_path = p.resolve(this.path, `${this.name}.js`);

    let index_exists = await this.manager.app.fileManager.exists({path: index_path});
    if (!index_exists) return false;
    
    // require the index file as type AppPluginStructure
    let plugin_instance: AppPluginStructure = require(index_path);
    if (!plugin_instance) return false;

    this.instance = plugin_instance;

    // call the register method on the plugin instance
    return await plugin_instance.register(this);
  }
}

// this interface describes the structure of a plugin index file.
// if you're creating a plugin, this is a good way to see how you should structure the index file.
interface AppPluginStructure {
  plugin: AppPlugin;
  register(plugin: AppPlugin): Promise<boolean>;
  start(): void;
}