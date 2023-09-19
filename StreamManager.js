const fs = require('fs');
const cs = require("./ChannelsSettings");
const { exec } = require('child_process');

module.exports = class StreamManager {
  constructor(path) {
    fs.writeFileSync(path, JSON.stringify({}, undefined, 2));
    StreamManager.filePath = path;
    if (!StreamManager.instance) {
      //TODO: Add check if file exists
      const obj = JSON.parse(fs.readFileSync(StreamManager.filePath));
      for (const prop of Object.keys(obj)) {
        this[prop] = obj[prop];
      }
      StreamManager.instance = this;
    }
  }
  /**
   * Starts streaming a channel with provided YouTube-key
   * @param {string} key 
   */
  play(key) {
    const channel = cs.instance.channels.find(ch => ch.key == key);
    if (!channel) {
      console.error(`No channel with key '${key}'`);
      return;
    }
    const login = channel.login ? channel.login : cs.instance.login;
    const password = channel.password ? channel.password : cs.instance.password;
    const proc = exec(`bash ${__dirname}/scripts/streamer.sh ` +
      `-l "${login}" ` +
      `-p "${password}" ` +
      `-i "${channel.ip}" ` +
      `-t "${channel.port}" ` +
      `-u "${channel.url}" ` +
      `-k "${channel.key}" `);
    this[key] = proc.pid + 1;
    this.save();
    return StreamManager.isStreaming(key);
  }

  stop(key) {
    try {
      process.kill(this[key]);
      delete this[key];
      this.save();
      fs.unlinkSync(`/data/data/com.termux/files/usr/var/service/streamerd/${key}.log`)
      return false;
    }
    catch (error) {
      console.log(error);
      return true;
    }
  }

  save() {
    fs.writeFileSync(StreamManager.filePath, JSON.stringify(this, undefined, 2));
  }

  static killThemAll() {
    exec('pidof ffmpeg', (err, stdout, stderr) => {
      if (stdout) {
        const pids = stdout.split(' ');
        for (let i = 0; i < pids.length; i++) {
          process.kill(pids[i]);
          console.log(`Process ${pids[i]} killed`);
        }
      }
    });
  }

  static isStreaming(key) {
    //TODO Check if process exists by key
    try {
      process.kill(StreamManager.instance[key], 0);
      return false;
    } catch (error) {
      return true;
    }
  }
};