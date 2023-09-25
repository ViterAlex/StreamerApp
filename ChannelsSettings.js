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
  }

  static fromObject(obj) {
    ChannelsSettings.instance.__clear();
    ChannelsSettings.instance.login = obj.login;
    ChannelsSettings.instance.password = obj.password;
    ChannelsSettings.instance.city = obj.city;
    ChannelsSettings.instance.club = obj.club;
    ChannelsSettings.instance.channels = [];
    for (const ch of obj.channels) {
      ChannelsSettings.instance.channels.push(JSON.parse(ch));
    }
    ChannelsSettings.instance.cities = [];
    for (const city of obj.cities) {
      ChannelsSettings.instance.cities.push(JSON.parse(city));
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