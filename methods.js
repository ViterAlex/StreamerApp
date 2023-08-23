const fs = require('fs');
const { exec } = require('child_process');

const getClubInfo = () => {
  const settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf-8'));
  return JSON.stringify({ 'city': settings.city, 'club': settings.club });
};

const getChannels = () => {
  const min = 2, max = 5;
  let n = 0;
  const len = Math.trunc(Math.random() * (max - min) + min);
  const buttons = {
    'streams': Array(len)
      .fill()
      .map((val) => val = { 'id': 0, 'result': false })
  };
  for (const stream of buttons.streams) {
    stream.id = ++n;
    stream.result = true;
  }
  return JSON.stringify(buttons);
};

const getAdminPage = () => {
  const html = fs.readFileSync(__dirname + '/pages/admin.html', 'utf-8');
  return { 'html': html };
};

const restart = () => {
  exec('pm2 restart streamerApp', (error, stdout, stderr) => {
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
  const settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf-8'));
  return settings;
};

const saveSettings = (params, res) => {
  const settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf-8'));
  console.log(params);
  settings.channels = [];
  params.channels.forEach(ch => {
    settings.channels.push(JSON.parse(ch));
  });
  settings.cities = [];
  params.cities.forEach(city => {
    settings.cities.push(JSON.parse(city));
  });
  for (const name of ['city', 'club', 'login', 'password']) {
    settings[name] = params[name];
  }
  fs.writeFileSync(`${__dirname}/settings.json`, JSON.stringify(settings));
  console.log(settings);
  return "";
};

const play = (params) => {
  const settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf-8'));
  const channel = settings.channels.find(ch => ch.key == params.key);
  let login = settings.login;
  if (channel.login) {
    login = channel.login;
  }
  let password = settings.password;
  if (channel.password) {
    password = channel.password;
  }
  const proc = exec(`bash ${__dirname}/scripts/streamer.sh ` +
    `-l "${login}" ` +
    `-p "${password}" ` +
    `-i "${channel.ip}" ` +
    `-t "${channel.port}" ` +
    `-u "${channel.url}" ` +
    `-k "${channel.key}" `, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
      if (stdout) {

        console.log(stdout);
      }

    });
};

const stop = (params) => {
  console.log(`Channel ${params.key} stopped`);
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