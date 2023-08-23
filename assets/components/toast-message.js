const toast_template = document.createElement('template');
toast_template.innerHTML = `
<link rel="stylesheet" href="/components/css/toast-message.css">
<div class="toast ">
  <span id="msg"></span>
</div>
`;
class ToastMessage extends HTMLElement {
  static get observedAttributes() {
    return [
      'message',
      'status'
    ];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.append(toast_template.content.cloneNode(true));
  }

  get message() {
    return this.getAttribute('message');
  }

  set message(value) {
    this.setAttribute('message', value);
  }

  set status(value) {
    this.setAttribute('status', value);
  }
  connectedCallback() {
    if (this.isConnected) {
      setTimeout(() => {
        this.remove();
      }, 5000);
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'message':
        this.root.querySelector('#msg').innerHTML = newValue;
        break;
      case 'status':
        this.root.querySelector('div').classList.remove(oldValue);
        this.root.querySelector('div').classList.add(newValue);
        break;
      default:
        break;
    }
  }
}
customElements.define('toast-message', ToastMessage);