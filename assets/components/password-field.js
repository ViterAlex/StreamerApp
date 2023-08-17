const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/components/css/password-field.css">
<input type="password" name="password" placeholder="Пароль">
<i class="fas fa-light fa-eye"></i>
`;
/* <div class="eye">
  </div> */
class PasswordField extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ['value'];

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.ariaRole = 'textbox';
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.isConnected) {
      this.root.querySelector('input').addEventListener('change', (ev) => {
        this.setAttribute('value', ev.target.value);
        this.dispatchEvent(new Event('change', { custom: true }));
      });
      this.root.querySelector('.fas').addEventListener('click', (ev) => {
        const input = this.root.querySelector('input');
        input.setAttribute('type', input.type == 'text' ? 'password' : 'text');
        ev.target.classList.toggle('fa-eye');
        ev.target.classList.toggle('fa-eye-slash');
      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.internals.setFormValue(newValue);
    this.root.querySelector('input').setAttribute('value', newValue);
  }
}
customElements.define('password-field', PasswordField);