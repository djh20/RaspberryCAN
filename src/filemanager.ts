import * as fs from 'fs';

interface ReadFileResults {
  data: string;
  json?: any;
}
interface ReadDirectoryResults {
  children: string[];
}

class FileManager {
  public readFile(params: {path: string, encoding?: BufferEncoding, json?: boolean}): Promise<ReadFileResults> {
    return new Promise((resolve, reject) => {
      fs.readFile(params.path, {encoding: params.encoding || 'utf-8'}, (err, data) => {
        resolve({
          data: data,
          json: params.json && data ? JSON.parse(data) : undefined
        });
      });
    });
  }

  public readDirectory(params: {path: string}): Promise<ReadDirectoryResults> {
    return new Promise((resolve, reject) => {
      fs.readdir(params.path, (err, data) => {
        resolve({
          children: data || []
        });
      });
    });
  }

  public exists(params: {path: string}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.stat(params.path, (err, data) => !err && data ? resolve(true) : resolve(false));
    });
  }
}

export default new FileManager();