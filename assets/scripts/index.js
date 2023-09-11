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
      document.querySelector('#qrWrapper').classList.toggle('hide');
      document.querySelector('#qrText').value = '';
    }
  };
  xht.send();
};

const hideQr = (ev) => {
  document.querySelector('#qrWrapper').classList.toggle('hide');
  document.querySelector('#qrImg').setAttribute('src', '');
  document.querySelector('#qrSave').setAttribute('href', '');
  document.querySelector('#qrSave').setAttribute('download', '');
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
      btn.name = channel.name;
      btn.state = res[channel.key]
      btn.addEventListener('click', (ev) => {
        xht('/', `verb=${ev.target.state}&key=${ev.target.key}`, (resp) => {
          setTimeout(() => {
            ev.target.state = resp.state;
          }, 3000);
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


export { getClubInfo, getSettings, getChannels as getStreams, setupEvents };

