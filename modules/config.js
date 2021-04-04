const fs = require('fs');

class Config {
  constructor(path) {
    this.json = {};
    this.path = path;
  }

  read() {
    this.json = JSON.parse( fs.readFileSync(this.path, 'utf-8') );
  }

  save() {
    let data = JSON.stringify(this.json, null, 2);
    fs.writeFileSync(this.path, data, {encoding: 'utf-8'})
  }
}

module.exports = {Config}