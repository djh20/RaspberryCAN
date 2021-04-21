import * as p from 'path';
import App from "../app/App";
import express, { Application as ExpressApplication } from 'express'
import Logger from "../util/Logger";
import { compileFile, compileTemplate } from 'pug';

export default class WebApplication {
  public app: App;
  public expressApp: ExpressApplication;

  constructor(app: App) {
    this.app = app;
    this.expressApp = express();
  }

  start() {
    let pages: Page[] = [
      {
        name: 'metrics',
        paths: ['/', '/metrics']
      },
      {
        name: 'map',
        paths: ['/map']
      },
      {
        name: 'settings',
        paths: ['/settings']
      },
      {
        name: 'logs',
        paths: ['/logs']
      }
    ];
    let staticPath = p.resolve(this.app.rootPath, 'web/dist');
    let viewsPath = p.resolve(this.app.rootPath, 'web/views');

    this.expressApp.use(express.static(staticPath));

    pages.forEach(page => {
      let filePath = p.resolve(viewsPath, page.name + '.pug');
      page.template = compileFile(filePath);

      page.paths.forEach(path => {
        this.expressApp.get(path, (req, res) => {
          res.status(200).send(this.getPageData(page));
        });
      });
    });

    Logger.info('Web', "Ready!");
  }

  getPageData(page: Page): string {
    return page.template({
      data: {page: page.name, config: this.app.config.data}
    });
  }
}

type Page = {
  name: string;
  paths: string[];
  template?: compileTemplate;
}