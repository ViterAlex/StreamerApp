import xht from './xht.js';

const loaded = (ev) => {
  //make request to server, parse json, show buttons
  const buttons = document.getElementsByClassName('playButtons');
  for (const b of buttons) {
    b.style.visibility = 'visible';
  }
};
const createQr = (ev) => {
  const api = 'https://chart.googleapis.com/chart?';
  const xht = new XMLHttpRequest();
  const size = 540;
  const text = document.getElementById("qrText").value;
  const src = `${api}chs=${size}x${size}&cht=qr&chl=${encodeURI(text)}`;
  xht.open('POST', src, true);
  xht.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
  xht.responseType = "arraybuffer";
  xht.onreadystatechange = () => {
    if (xht.readyState == 4 && xht.status == 200) {
      const imgSrc = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(xht.response)))}`;
      document.querySelector('#qrImg').setAttribute('src', imgSrc);
      document.querySelector('#qrSave').setAttribute('href', imgSrc);
      document.querySelector('#qrWrapper').style.visibility = 'visible';
      document.querySelector('#qrText').value = '';
    }
  };
  xht.send();
};

const hideQr = (ev) => {
  document.querySelector('#qrWrapper').style.visibility = "collapse";
  document.querySelector('#qrImg').setAttribute('src', '');
  document.querySelector('#qrSave').setAttribute('href', '');
};

const setupEvents = () => {
  document.addEventListener('DOMContentLoaded', loaded);
  document.querySelector('#qrClose').addEventListener('click', hideQr);
  document.querySelector('#qrSave').addEventListener('click', hideQr);
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
      btn.name= channel.name;
      btn.addEventListener('click', (ev) => {
        xht('/', `verb=${ev.target.state}&key=${ev.target.key}`);
        ev.target.state = 'wait';
        setTimeout(() => {
          ev.target.state = 'stop';
        }, 3000);
      });
      wrapper.appendChild(btn);
    }
    wrapper.classList.remove('hide');
  });
};

const getClubInfo = () => {
  const wrapper = document.querySelector('.clubInfo');
  const settings = JSON.parse(localStorage.getItem('settings'));
  wrapper.innerHTML = `${settings.city} — ${settings.club}`;
};


export { getClubInfo, getSettings, getChannels as getStreams, setupEvents };

