const template = document.createElement('template');
template.innerHTML = `
<div class="row gap" id="channelTemplate">
  <input type="text" name="ch_name" id="ch_name" placeholder="Ім'я">
  <input type="text" name="ch_ip" id="ch_ip" placeholder="IP">
  <input type="text" name="ch_port" id="ch_port" placeholder="Порт">
  <input type="text" name="ch_url" id="ch_url" placeholder="Посилання">
  <input type="text" name="ch_key" id="ch_key" placeholder="Ключ YouTube">
  <label class="fancy-checkbox">
    <input type="checkbox" name="ch_audio" id="ch_audio">
    <i class="fas fa-volume-high checked" title="Звук ввімкнено"></i>
    <i class="fas fa-volume-mute unchecked" title="Звук вимкнено"></i>
  </label>
  <button id='ch_delete' title="Видалити канал"><i
      class="fas fa-minus"></i></button>
  <div class="break"></div>
  <div id="chLoginPassSpoiler">
    <a href="#" id="loginPassSpoiler">Логін та пароль, якщо
      відрізняються
      від загальних</a>
    <div class="animateWrapper">
      <div class="row gap left">
        <input type="text" name="ch_login" id="ch_login"
          placeholder="Логін">
        <div class="overlay">
          <input type="password" name="ch_password" id="ch_password"
            placeholder="Пароль">
          <i class="fas fa-light fa-eye"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="break height"></div>
</div>`;
class Channel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
customElements.define('channel', Channel);