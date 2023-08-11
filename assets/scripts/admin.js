import xht from './xht.js';

const fillCities = () => {
  const cities = document.querySelector('#citiesSelect');
  const settings = JSON.parse(localStorage.getItem('settings'));
  cities.addEventListener('change', (ev) => {
    //Заповнення списку з клубами при зміні міста
    const clubsSelect = document.querySelector('#clubsSelect');
    clubsSelect.innerHTML = '';
    const clubs = settings.cities.find(c => c.name == ev.target.value).clubs;
    localStorage.setItem('selectedCity', ev.target.value);
    localStorage.setItem('clubs', JSON.stringify(clubs));
    if (clubs.length > 0) {
      clubsSelect.classList.remove('hide');
      document.querySelector('#editClubs').classList.remove('hide');
    }
    else {
      clubsSelect.classList.add('hide');
      document.querySelector('#editClubs').classList.add('hide');
    }
    for (const club of clubs) {
      const opt = document.createElement('option');
      opt.innerText = club;
      opt.setAttribute('value', club);
      if (settings.club == club) {
        opt.setAttribute('selected', true);
      }
      clubsSelect.appendChild(opt);
    }
  });
  //Заповнення списку з містами
  for (const city of settings.cities) {
    const opt = document.createElement('option');
    opt.innerText = city.name;
    opt.setAttribute('value', city.name);
    if (settings.city == city.name) {
      opt.setAttribute('selected', true);
    }
    cities.appendChild(opt);
  }
  cities.dispatchEvent(new Event('change'));
};

const fillChannels = () => {
  const settings = JSON.parse(localStorage.getItem('settings'));
  const channels = settings.channels;
  const wrapper = document.querySelector('#channelsWrapper');
  wrapper.innerHTML = '';
  for (const prop of ['login', 'password']) {
    document.querySelector(`#${prop}`).setAttribute('value', settings[prop]);
  }
  const prefix = 'ch_';
  let n = 0;
  for (const channel of channels) {
    const row = document.querySelector('#channelTemplate').cloneNode(true);
    row.setAttribute('id', `${prefix}${n}`);
    for (const prop of Object.keys(channel)) {
      const input = row.querySelector(`#${prefix}${prop}`);
      if (input) {
        input.setAttribute('value', channel[prop]);
        input.setAttribute('id', `${prefix}${prop}[${n}]`);
        input.setAttribute('name', input['id']);
      }
    }
    let elem = row.querySelector(`#${prefix}audio`);
    elem.setAttribute('checked', true);
    elem.setAttribute('id', `${prefix}audio[${n}]`);
    elem.setAttribute('name', elem['id']);

    elem = row.querySelector(`#${prefix}delete`);
    elem.setAttribute('id', `${prefix}delete[${n}]`);
    elem.setAttribute('name', elem['id']);
    elem.addEventListener('click', (ev) => {
      const ch_index = parseInt(row['id'].slice(prefix.length));
      const settings = JSON.parse(localStorage.getItem('settings'));
      settings.channels.splice(ch_index, 1);
      localStorage.setItem('settings', JSON.stringify(settings));
      row.remove();
    });
    n++;
    row.querySelector('#loginPassSpoiler').addEventListener('click', (ev) => {
      row.querySelector('.animateWrapper').classList.toggle('open');
    });
    wrapper.appendChild(row);
  }
};

const assignEvents = () => {
  document.querySelector('#editCities').addEventListener('click', (ev) => edit('cities'));
  document.querySelector('#editClubs').addEventListener('click', (ev) => edit('clubs'));
  document.querySelector('#restartWebServer').addEventListener('click', (ev) => restart());
  document.querySelector('#addChannel').addEventListener('click', (ev) => addChannel());
  document.querySelector('list-editor').addEventListener('onsave', (ev) => {
    ev.target.parentElement.classList.remove('open');
    // ev.target.parentElement.classList.add('hide');
  });
  document.querySelector('list-editor').addEventListener('ondiscard', (ev) => {
    ev.target.parentElement.classList.remove('open');
    // ev.target.parentElement.classList.add('hide');
  });
  for (const el of document.querySelectorAll('.overlay .fas')) {
    el.addEventListener('click', (ev) => showHidePassword(ev));
  }

  document.querySelector('#saveSettings').addEventListener('click', (ev) => {
    const form = document.querySelector('#settingsForm');
    const fd = new FormData(form);
    const x = new XMLHttpRequest();
    x.open('POST', '/');
    x.send(fd);
  });
};

const showHidePassword = (ev) => {
  const input = ev.target.parentElement.querySelector('input');
  input.setAttribute('type', input.type == 'text' ? 'password' : 'text');
  ev.target.classList.toggle('fa-eye');
  ev.target.classList.toggle('fa-eye-slash');
};

const addChannel = () => {
  const settings = JSON.parse(localStorage.getItem('settings'));
  const newChannel = { ...settings.channels[0] };
  for (const prop of Object.keys(newChannel)) {
    newChannel[prop] = '';
  }
  settings.channels.push(newChannel);
  localStorage.setItem('settings', JSON.stringify(settings));
  fillChannels();
};

const restart = () => {
  xht('/', 'verb=restart', (res) => {
    location.reload();
  });
};

const edit = (o) => {
  const editor = document.querySelector('list-editor');
  const wrapper = editor.parentElement;
  const opened = wrapper.classList.contains('open');
  if (opened) {
    wrapper.classList.remove('open');
    // wrapper.classList.remove('hide');
  }
  else {
    wrapper.classList.add('open');
  }
  switch (o) {
    case 'cities':
      const settings = JSON.parse(localStorage.getItem('settings'));
      editor.setAttribute('save-button-title', 'Зберегти список міст');
      editor.items = settings.cities.map(c => c.name);
      break;
    case 'clubs':
      editor.items = JSON.parse(localStorage.getItem('clubs'));
      editor.setAttribute('save-button-title', 'Зберегти список клубів');
      break;
    default:
      break;
  }
  if (opened) {
    wrapper.classList.add('open');
  }
};

export { assignEvents, edit, fillChannels, fillCities, restart };

