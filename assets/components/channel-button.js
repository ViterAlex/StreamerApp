const toast_template = document.createElement('template');
toast_template.innerHTML = `
    <link rel="stylesheet" href="/components/css/channel-button.css">
    <link rel="stylesheet" href="/components/css/spinner.css">
    <div>
      <div class="loader hide" id="wait">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/>
        </svg>
      </div>
      <button class="show play" id="play">
        <i class="fas fa-play "></i>
      </button>
      <button class="hide stop" id="stop">
        <i class="fas fa-stop"></i>
      </button>
    </div>
    `;
class ChannelButton extends HTMLElement {
  static get observedAttributes() {
    return [
      'name',
      'key',
      'state'
    ];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.append(toast_template.content.cloneNode(true));
  }

  get state() {
    return this.getAttribute('state');
  }
  set state(value) {
    this.setAttribute('state', value);
  }

  get key() {
    return this.getAttribute('key');
  }

  set key(value) {
    this.setAttribute('key', value);
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(value) {
    this.setAttribute('name', value);
  }

  connectedCallback() {
    if (this.isConnected) {
      this.state = 'play';
      this.addEventListener('click', (ev) => {
        this.__changeState();
      });
    }
  }

  disconnectedCallback() {
    if (!this.isConnected) {
      this.removeEventListener('click', (ev) => {
        this.__changeState();
      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) {
      return;
    }
    switch (name) {
      case 'name':
        this.__setChannelName(newValue);
        break;
      case 'key':
        break;
      case 'state':
        this.__stateChanged();
        break;
      case 'onplay':
      case 'onstop':
        this.addEventListener(name, (ev) => {
          const f = new Function('ev', newValue);
          f.call(ev);
        });
        break;
      default:
        break;
    }
  }

  __setChannelName(name) {
    let btn = this.root.querySelector('#stop');
    btn.innerHTML += ` ${name}`;
    btn = this.root.querySelector('#play');
    btn.innerHTML += ` ${name}`;
  }

  __stateChanged() {
    const play = this.root.querySelector('#play');
    const stop = this.root.querySelector('#stop');
    const wait = this.root.querySelector('#wait');
    switch (this.state) {
      case 'play':
        this.__hideOrshow(stop, true);
        this.__hideOrshow(wait, true);
        this.__hideOrshow(play);
        break;
      case 'stop':
        this.__hideOrshow(play, true);
        this.__hideOrshow(wait, true);
        this.__hideOrshow(stop);
        break;
      case 'wait':
        this.__hideOrshow(play, true);
        this.__hideOrshow(stop, true);
        this.__hideOrshow(wait);
        break;
      default:
        break;
    }
  }

  __hideOrshow(el, hide = false) {
    if (hide) {
      el.classList.add('hide');
      el.classList.remove('show');
    }
    else {
      el.classList.add('show');
      el.classList.remove('hide');

    }
  }

  __changeState() {
    if (this.state == 'play') {
      this.state = 'stop';
    }
    else if (this.state == 'stop') {
      this.state = 'play';
    }
  }
};

customElements.define('channel-button', ChannelButton);
