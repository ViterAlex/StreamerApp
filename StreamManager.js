const cs = require("./ChannelsSettings");

const { exec, execSync } = require('child_process');

module.exports = class StreamManager {
  constructor(path) {
    StreamManager.filePath = path;
    if (!StreamManager.instance) {
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
    console.log(`Start streaming for key ${key}`);
    const login = channel.login ? channel.login : cs.instance.login;
    const password = channel.password ? channel.password : cs.instance.password;
    exec(`bash ${__dirname}/scripts/streamer.sh ` +
      `-l '${login}' ` +
      `-p '${password}' ` +
      `-i '${channel.ip}' ` +
      `-t '${channel.port}' ` +
      `-u '${channel.url}' ` +
      `-a '${channel.audio}' ` +
      `-k '${channel.key}' `, (err, stdout, stderr) => {
        /*if (err) {
          console.log(err);
        }*/
        if (stdout) {
          console.log(stdout);
        }
        /*if (stderr) {
          console.log(stderr);
        }*/
    }
   );
    execSync('sleep 2');
    const result = StreamManager.isStreaming(key);
    if (result) {
      console.log(`Successfully started`);
    }
    else {
      console.log(`Unable to start stream`);
    }
    return result;
  }

  stop(key) {
    try {
      console.log('Run pgrep');
      const pids = execSync(`pgrep -f ${key}`)
        .toString()
        .trim()
        .split('\n',);
      console.log(pids);
      for (const pid of pids) {
        try {
          console.log(`Killing ${pid} process`);
          process.kill(pid);
        } catch (error) {
          continue;
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    //Delay for 2 seconds to let the thread stop
    execSync('sleep 2');
    console.log(`Stream ${key} stopped`);
    const result = StreamManager.isStreaming(key);
    console.log(`isStreaming = ${result}`);
    return result;
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
    try {
      execSync(`pgrep -f ${key}`);
      return true;
    } catch (error) {
      return false;
    }
  }
};