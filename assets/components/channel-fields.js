class ChannelFields extends HTMLElement {
  __template() {

    const template = document.createElement('template');
    template.innerHTML = `
<link rel="stylesheet" href="/components/css/channel-fields.css">
<input type="text" class="input name" prop="name" placeholder="Ім'я">
<input type="text" class="input ip" prop="ip" placeholder="IP">
<input type="text" class="input port" prop="port" placeholder="Порт">
<input type="text" class="input url" prop="url" placeholder="Посилання">
<input type="text" class="input key" prop="key" placeholder="Ключ YouTube">
<label class="fancy-checkbox">
  <input class="input audio" prop="audio" type="checkbox" >
  <i class="fas fa-volume-high " title="Звук ввімкнено"></i>
  <i class="fas fa-volume-mute " title="Звук вимкнено"></i>
</label>
<button class='delete' title="Видалити канал">
  <i class="fas fa-trash-can"></i>
</button>
<div class="spoiler">
  <a href="#" id="spoilerHeader">Логін та пароль, якщо відрізняються від загальних</a>
  <div class="animateWrapper">
    <div>
      <input class="input login" prop="login" type="text" placeholder="Логін">
      <password-field class="input password" prop="password"></password-field>
    </div>
  </div>
</div>
<script src="/components/password-field.js"></script>
`;
    return template;
  }

  static formAssociated = true;
  static observedAttributes = ['value'];

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.ariaRole = 'textbox';
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.append(this.__template().content.cloneNode(true));
    this.channel = {
      name: '',
      ip: '',
      port: '',
      url: '',
      key: '',
      audio: '',
      login: '',
      password: ''
    };
  }

  connectedCallback() {
    if (!this.isConnected) {
      return;
    }
    let count = 1
    this.root.querySelectorAll('.input').forEach(el => {
      console.log(count++);
      el.addEventListener('change', (ev) => {
        this.__inputChanged(ev);
      });
    });

    this.root.querySelector('.delete').addEventListener('click', (ev) => {
      this.dispatchEvent(new Event('deleteChannel'));
    });
    this.root.querySelector('#spoilerHeader').addEventListener('click', (ev) => {
      ev.target.parentElement.querySelector('.animateWrapper').classList.toggle('open');
    });
  }

  __inputChanged(ev) {
    const prop = ev.target.getAttribute('prop');
    let val = ev.target.getAttribute('value');
    if (ev.target.type == 'checkbox') {
      val = ev.target.checked;
    }
    this.channel[prop] = val;
    this.internals.setFormValue(JSON.stringify(this.channel));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const ch = JSON.parse(newValue);
    for (const key of Object.keys(this.channel)) {
      this.channel[key] = ch[key];
      const elem = this.root.querySelector(`.${key}`);
      if (elem.type == 'checkbox') {
        if (ch[key]) {
          elem.setAttribute('checked', '');
        }
      }
      else {
        elem.setAttribute('value', ch[key]);
      }
    }
    this.internals.setFormValue(JSON.stringify(this.channel));
  }
}

customElements.define('channel-fields', ChannelFields);
