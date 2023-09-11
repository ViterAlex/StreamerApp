import xht from './xht.js';

const fillCities = () => {
  const citiesSelect = document.querySelector('#citiesSelect');
  const cities = JSON.parse(localStorage.getItem('cities'));
  const selectedCity = localStorage.getItem('selectedCity');
  const selectedClub = localStorage.getItem('selectedClub');
  citiesSelect.addEventListener('change', (ev) => {
    //Заповнення списку з клубами при зміні міста
    const clubsSelect = document.querySelector('#clubsSelect');
    clubsSelect.innerHTML = '';
    const clubs = cities.find(c => c.name == ev.target.value).clubs;
    localStorage.setItem('selectedCity', ev.target.value);
    localStorage.setItem('clubs', JSON.stringify(clubs));
    for (const club of clubs) {
      const opt = document.createElement('option');
      opt.innerText = club;
      opt.setAttribute('value', club);
      clubsSelect.appendChild(opt);
      if (selectedClub == club) {
        clubsSelect.value = club;
      }
    }
    document.querySelector('#clubsSelect')
      .dispatchEvent(new Event('change'));
  });
  citiesSelect.innerHTML = '';
  //Заповнення списку з містами
  for (const city of cities) {
    const opt = document.createElement('option');
    opt.innerText = city.name;
    opt.setAttribute('value', city.name);
    citiesSelect.appendChild(opt);
    if (selectedCity == city.name) {
      citiesSelect.value = city.name;
    }
  }

  const clubs = document.querySelector('#clubsSelect');
  clubs.addEventListener('change', (ev) => {
    localStorage.setItem('selectedClub', ev.target.value);
  });

  citiesSelect.dispatchEvent(new Event('change'));
  clubs.dispatchEvent(new Event('change'));
};

const fillChannels = () => {
  const settings = JSON.parse(localStorage.getItem('settings'));
  const channels = settings.channels;
  const wrapper = document.querySelector('#channelsWrapper');
  wrapper.innerHTML = '';
  for (const prop of ['login', 'password']) {
    document.querySelector(`#${prop}`).setAttribute('value', settings[prop]);
  }
  channels.forEach((channel, n) => {
    const ch = document.createElement('channel-fields');
    ch.setAttribute('value', JSON.stringify(channel));
    ch.setAttribute('index', `${n}`);
    ch.setAttribute('name', `channels[${n}]`);
    ch.addEventListener('deleteChannel', (ev) => {
      deleteChannel(ev);
    });
    wrapper.appendChild(ch);
  });
};

const deleteChannel = (ev) => {
  ev.target.remove();
  document
    .querySelector('#channelsWrapper')
    .querySelectorAll('channel-fields')
    .forEach((el, n) => el.setAttribute('name', `channels[${n}]`));
  return true;
};

const assignEvents = () => {
  document.querySelector('#editCities').addEventListener('click', (ev) => edit('cities'));
  document.querySelector('#editClubs').addEventListener('click', (ev) => edit('clubs'));
  document.querySelector('#restartWebServer').addEventListener('click', (ev) => restart());
  document.querySelector('#addChannel').addEventListener('click', (ev) => addChannel());
  document.querySelector('list-editor').addEventListener('onsave', (ev) => {
    editorSave();
  });
  document.querySelector('list-editor').addEventListener('ondiscard', (ev) => {
    ev.target.parentElement.classList.remove('open');
  });
  for (const el of document.querySelectorAll('.overlay .fas')) {
    el.addEventListener('click', (ev) => showHidePassword(ev));
  }

  document.querySelector('#saveSettings').addEventListener('click', (ev) => {
    const form = document.querySelector('#settingsForm');
    const fd = new FormData(form);
    fd.append('city', localStorage.getItem('selectedCity'));
    fd.append('club', localStorage.getItem('selectedClub'));
    JSON.parse(localStorage.getItem('settings')).cities
      .forEach((city, n) => {
        fd.append(`cities[${n}]`, JSON.stringify(city));
      });
    const x = new XMLHttpRequest();
    const toast = document.createElement('toast-message');
    x.onreadystatechange = () => {
      if (x.status == 200 && x.readyState == 4) {
        toast.message = 'Збережено';
        toast.status = 'success';
        localStorage.setItem('settings', x.responseText);
      }
      else if (x.status == 404) {
        toast.message = 'Помилка';
        toast.status = 'fail';
      }
      document.body.append(toast);
    };
    x.open('POST', '/');
    x.send(fd);
  });
};

const editorSave = () => {
  const editor = document.querySelector('list-editor');
  const subject = editor.getAttribute('subject');
  switch (subject) {
    case 'cities':
      saveCities(editor);
      fillCities();
      break;
    case 'clubs':
      saveClubs(editor);
      fillCities();
      break;
    default:
      break;
  }
  editor.parentElement.classList.remove('open');

};

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
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
  }
  else {
    wrapper.classList.add('open');
  }
  editor.setAttribute('subject', o);
  switch (o) {
    case 'cities':
      editor.setAttribute('save-button-title', 'Зберегти список міст');
      editor.items = JSON.parse(localStorage.getItem('cities')).map(el => el.name);
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

const saveClubs = (editor) => {
  let clubs = JSON.parse(localStorage.getItem('clubs'));
  let empty = new Array(editor.__items.length);
  for (let i = 0; i < empty.length; i++) {
    const editedItem = editor.__items[i];
    const item = clubs[editedItem.index];
    const val = editedItem.newValue === ''
      ? editedItem.value
      : editedItem.newValue;
    //deleted item
    if (editedItem.deleted) {
      empty[editedItem.index] = { deleted: true };
      continue;
    }
    //added item
    if (editedItem.index >= clubs.length) {
      const idx = editedItem.newIndex > -1
        ? editedItem.newIndex
        : editedItem.index;
      empty[idx] = val;
      continue;
    }
    //moved item
    if (editedItem.newIndex >= 0) {
      empty[editedItem.newIndex] = val;
      continue;
    }
    //edited item
    if (editedItem.newValue !== '') {
      empty[editedItem.index] = editedItem.newValue;
      continue;
    }

    empty[i] = item;
  }
  empty = empty.filter(el => Object.keys(el).indexOf('deleted') == -1);
  clubs = Array.from(empty);
  const settings = JSON.parse(localStorage.getItem('settings'));
  for (const city of settings.cities) {
    if (city.name == localStorage.getItem('selectedCity')) {
      city.clubs = clubs;
      break;
    }
  }
  localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('cities', JSON.stringify(settings.cities));
};

const saveCities = (editor) => {
  let cities = JSON.parse(localStorage.getItem('cities'));
  let empty = new Array(editor.__items.length);
  for (let i = 0; i < empty.length; i++) {
    const editedItem = editor.__items[i];
    //edited value if any
    const val = editedItem.newValue === ''
      ? editedItem.value
      : editedItem.newValue;
    //added item
    if (editedItem.index >= cities.length) {
      const idx = editedItem.newIndex > -1
        ? editedItem.newIndex
        : editedItem.index;
      empty[idx] = { name: val, clubs: [] };
      continue;
    }
    const item = cities[editedItem.index];
    //moved item
    if (editedItem.newIndex >= 0) {
      empty[editedItem.newIndex] = clone(item);
      empty[editedItem.newIndex].name = val;
      continue;
    }
    //edited item
    if (editedItem.newValue !== '') {
      empty[editedItem.index] = clone[item];
      empty[editedItem.index].name = editedItem.newValue;
      continue;
    }
    //deleted item
    if (editedItem.deleted) {
      empty[editedItem.index] = { deleted: true };
      continue;
    }
    empty[i] = clone(item);
  }
  empty = empty.filter(el => Object.keys(el).indexOf('deleted') == -1);
  const settings = JSON.parse(localStorage.getItem('settings'));
  settings.cities = Array.from(empty);
  localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('cities', JSON.stringify(settings.cities));
};

export { assignEvents, edit, fillChannels, fillCities, restart };

