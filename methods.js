const fs = require('fs');
const sm = require("./StreamManager");
const cs = require("./ChannelsSettings");
const { exec } = require('child_process');
const { create } = require('domain');

const getClubInfo = (_, res) => {
  res
    .status(200)
    .send({
      'city': cs.instance.city,
      'club': cs.instance.club
    });
};

const getChannels = (_, res) => {
  const result = {};
  for (const ch of cs.instance.channels) {
    result[ch.key] = sm.isStreaming(ch.key) ? 'stop' : 'play';
  }
  res
    .status(200)
    .send(result);
};

const getAdminPage = (_, res) => {
  const html = fs.readFileSync(__dirname + '/pages/admin.html', 'utf-8');
  res
    .status(200)
    .send({ 'html': html });
};

const restart = (_, res) => {
  const PREFIX = '/data/data/com.termux/files/usr';
  exec(`node ${PREFIX}/bin/pm2 reload 0`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      res
        .status(500)
        .send();
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res
        .status(500)
        .send();
    }
    console.log(`stdout: ${stdout}`);
    res
      .status(200)
      .send({ result: 'server restarted' });
  });
};

const getSettings = (_, res) => {
  res
    .status(200)
    .send(cs.instance);
};

const saveSettings = (params, res) => {
  cs.fromObject(params);
  cs.instance.save();
  res
    .status(200)
    .send(cs.instance);
};

const play = (params, res) => {
  const isStreaming = sm.instance.play(params.key);
  const result = { key: params.key };
  result.state = isStreaming ? 'stop' : 'play';
  res
    .status(200)
    .send(result);
};

const stop = (params, res) => {
  const isStreaming = sm.instance.stop(params.key);
  const result = { key: params.key };
  result.state = isStreaming ? 'stop' : 'play';
  res
    .status(200)
    .send(result);
};

const qr = (params, res) => {
  const qrcode = require('qrcode');
  //to avoid error if text is empty
  const text = params.text == '' ? ' ' : params.text;
  const w = 300;
  const opts = {
    errorCorrectionLevel: 'H',
    width: w,
    height: w,
    color: {
      dark: "#5D4E9AFF",
      light: "#FFFF"
    },
    margin: 1
  };
  console.log(params);
  qrcode.toDataURL(text, opts)
    .then(url => {
      res
        .status(200)
        .send({
          data: url
        });
    })
    .catch(err => {
      console.log(err);
    }
    );
};



module.exports = {
  getChannels,
  getClubInfo,
  getAdminPage,
  getSettings,
  saveSettings,
  play,
  qr,
  stop,
  restart,
};