import xht from './xht.js';

const loaded = (ev) => {
  //make request to server, parse json, show buttons
  const buttons = document.getElementsByClassName('playButtons');
  for (const b of buttons) {
    b.style.visibility = 'visible';
  }
};

const createQr = (ev) => {
  const text = document.getElementById("qrText").value;
  xht('/', `verb=qr&text=${text}`, (resp) => {
    document.querySelector('#qrImg').setAttribute('src', resp.data);
    document.querySelector('#qrSave').setAttribute('href', resp.data);
    document.querySelector('#qrWrapper').classList.toggle('hide');
    document.querySelector('#qrText').value = '';
  });
};

const hideQr = (ev) => {
  document.querySelector('#qrWrapper').classList.toggle('hide');
  document.querySelector('#qrImg').setAttribute('src', '');
};

const setupEvents = () => {
  document.querySelector('#qrClose').addEventListener('click', ev => hideQr(ev));
  document.querySelector('#qrSave').addEventListener('click', ev => hideQr(ev));
  document.querySelector('#qrCreate').addEventListener('click', createQr);
  document.querySelector('footer .goToAdmin').addEventListener('click', goToAdminPage);
};

const getSettings = () => {
  xht('/', 'verb=getSettings', (res) => {
    console.log(res);
    localStorage.setItem('settings', JSON.stringify(res));
    localStorage.setItem('cities', JSON.stringify(res.cities));
    localStorage.setItem('selectedClub', res.club);
    localStorage.setItem('selectedCity', res.city);
  });
};

const goToAdminPage = (ev) => {
  document.location.replace('/?page=admin');
};

const getChannels = () => {
  xht('/', 'verb=getChannels', (res) => {
    const wrapper = document.querySelector('#channelButtons');
    wrapper.innerHTML = '';
    const settings = JSON.parse(localStorage.getItem('settings'));
    for (const channel of settings.channels) {
      const btn = document.createElement('channel-button');
      btn.key = channel.key;
      btn.name = channel.name;
      btn.state = res[channel.key];
      btn.addEventListener('click', (ev) => {
        xht('/', `verb=${ev.target.state}&key=${ev.target.key}`, (resp) => {
          ev.target.state = resp.state;
        });
        ev.target.state = 'wait';
      });
      wrapper.appendChild(btn);
    }
    wrapper.classList.remove('hide');
  });
};

const getClubInfo = () => {
  document
    .querySelector('.clubInfo')
    .innerHTML = `${localStorage.getItem('selectedCity')} — ${localStorage.getItem('selectedClub')}`;
};


export { getChannels, getClubInfo, getSettings, setupEvents };

