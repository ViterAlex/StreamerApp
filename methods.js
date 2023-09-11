const fs = require('fs');
const sm = require("./StreamManager");
const cs = require("./ChannelsSettings");
const { exec } = require('child_process');

const getClubInfo = () => {
  return JSON.stringify({
    'city': cs.instance.city,
    'club': cs.instance.club
  });
};

const getChannels = () => {
  const res = {};
  for (const ch of cs.instance.channels) {
    if (sm.instance[ch.key] == undefined) {
      res[ch.key] = 'play';
    }
    else {
      res[ch.key] = 'stop';
    }
  }
  return res;
};

const getAdminPage = () => {
  const html = fs.readFileSync(__dirname + '/pages/admin.html', 'utf-8');
  return { 'html': html };
};

const restart = () => {
  exec('pm2 restart streamer_app', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

const getSettings = () => {
  return cs.instance;
};

const saveSettings = (params, res) => {
  cs.instance.fromObject(params);
  cs.instance.save();
  return cs.instance;
};

const play = (params) => {
  const isStreaming = sm.instance.play(params.key);
  const result = {key:params.key};
  result.state = isStreaming ? 'stop' : 'play';
  return result;
};

const stop = (params) => {
  const isStreaming = sm.instance.stop(params.key);
  const result = {key:params.key};
  result.state = isStreaming ? 'stop' : 'play';
  return result;
};

module.exports = {
  getChannels,
  getClubInfo,
  getAdminPage,
  getSettings,
  saveSettings,
  play,
  stop,
  restart,
};