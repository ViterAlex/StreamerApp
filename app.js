const fs = require('fs');
const express = require('express');
const router = express.Router();
const app = express();
// const multer = require('multer');
const verbs = require('./methods.js');
const ChannelSettings = require("./ChannelsSettings");
const StreamManager = require("./StreamManager");
const path = require('path');
app.use(express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));
// app.use(multer().none());
app.use(router);

router.route('/')
  .get((req, res) => {
    let page = 'index';
    if (req.query.page) {
      page = req.query.page;
    }
    page = path.join(`${__dirname}/pages/${page}.html`);
    res.sendFile(page);
    console.log(`${page} sent to client`);
  })
  .post((req, res) => {
    const verb = req.body.verb;
    if (verb) {
      console.log(`verb = ${verb}`);
      if (verbs[verb]) {
        //Method must send result through res
        verbs[verb](req.body, res);
      }
    }
  });

const onServerStop = () => {
  console.log('Зупинення всіх трансляцій');
  StreamManager.killThemAll();
  console.log('Видалення файлів журналів');
  for (const ch of ChannelSettings.instance.channels) {
    try {
      fs.unlinkSync(`/data/data/com.termux/files/usr/var/services/streamerd/${ch.key}.log`);
    } catch {
      continue;
    }
  }
  server.close(() => {
    console.log('Сервер зупинено');
  });
};
new ChannelSettings(`${__dirname}/settings.json`);
new StreamManager(process.env.STREAMS);
StreamManager.killThemAll();

const server = app.listen(process.env.PORT, () => {
  console.log(`Додаток стрімера запущено. Порт ${process.env.PORT}`);
});
process.on('SIGINT', () => onServerStop());
process.on('SIGTERM', () => onServerStop());
