const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const multer = require('multer');
const port = 33333;
const {
  getClubInfo,
  getChannels,
  restart,
  getAdminPage,
  getSettings,
  saveSettings,
  play,
  stop
} = require('./methods.js');

app.use(express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));
app.use(multer().none());
app.use(router);
const verbs = {
  'getClubInfo': getClubInfo,
  'getChannels': getChannels,
  'restart': restart,
  'getAdminPage': getAdminPage,
  'getSettings': getSettings,
  'saveSettings': saveSettings,
  'play': play,
  'stop': stop
};

router.route('/')
  .get((req, res) => {
    let page = 'index';
    if (req.query.page) {
      page = req.query.page;
    }
    res.sendFile(path.join(`${__dirname}/pages/${page}.html`));
  })
  .post((req, res) => {
    const verb = req.body.verb;
    if (verb) {
      console.log(`verb = ${verb}`);
      if (verbs[verb]) {
        res.send(verbs[verb](req.body));
      }
    }
  });
app.listen(port, () => {
  console.log(`Додаток стрімера запущено. Порт ${port}`);
});

