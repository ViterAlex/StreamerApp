const fs = require('fs');
module.exports = class ChannelsSettings {
  constructor(path) {
    if (!fs.existsSync(path)) {
      throw new Error(`${path} doesn't exist`);
    }
    if (!ChannelsSettings.instance) {
      const set_obj = JSON.parse(fs.readFileSync(path));
      for (let prop of Object.keys(set_obj)) {
        this[prop] = set_obj[prop];
      }
      ChannelsSettings.filePath = path;
      ChannelsSettings.instance = this;
    }
    return ChannelsSettings.instance;
  }

  fromObject(obj) {
    this.__clear();
    this.login = obj.login;
    this.password = obj.password;
    this.city = obj.city;
    this.club = obj.club;
    this.channels = [];
    for (const ch of obj.channels) {
      this.channels.push(JSON.parse(ch));
    }
    this.cities = [];
    for (const city of obj.cities) {
      this.cities.push(JSON.parse(city));
    }
  }

  save() {
    fs.writeFileSync(ChannelsSettings.filePath, JSON.stringify(this));
  }

  __clear() {
    const keys = Object.keys(ChannelsSettings.instance);
    for (let i = keys.length - 1; i >= 0; i--) {
      const element = keys[i];
      delete ChannelsSettings.instance[element];
    }
  }
};