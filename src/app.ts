import * as p from 'path';
import Config from './config'
import AppPluginManager from './plugin';
import FileManager from './filemanager';

export default class App {
  public config: Config;
  public pluginManager: AppPluginManager;
  public fileManager: FileManager;

  constructor(params: {configPath: string}) {
    this.config = new Config(this, params.configPath);
    this.pluginManager = new AppPluginManager(this);
    this.fileManager = new FileManager();
  }

  public async init() {
    console.log("----- RaspberryCAN -----");
    await this.config.load();
    await this.pluginManager.load();

    this.pluginManager.start();
  }
}