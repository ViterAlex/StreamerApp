const list_editor_template = document.createElement('template');
list_editor_template.innerHTML = `
<link rel="stylesheet" href="/components/css/list-editor.css">
    <div class="list-editor">
      <div class="toolbar">
        <div></div>
        <div class="toolbar-items">
          <a class="fas fa-plus" id="plus-icon" title="Додати"></a>
          <a class="fas fa-save" id="save-icon" title="Зберегти"></a>
          <a class="fas fa-xmark" id="discard-icon" title="Скасувати"></a>
        </div>
      </div>
      <div class="list-items"></div>
    </div>
`;
const list_item_template = document.createElement('template');
list_item_template.innerHTML = `
<div class='list-item'>
      <input type="hidden" id="itemIndex">
      <div class='item-content'>
        <span id='item-content'></span>
        <div class="action-items">
          <a class="fas fa-pen" id="edit-icon" title="Редагувати"></a>
          <a class="fas fa-caret-up" id="move-up-icon"
            title="Перемістити вгору"></a>
          <a class="fas fa-caret-down" id="move-down-icon"
            title="Перемістити вниз"></a>
          <a class="fas fa-trash-can" id="delete-icon" title="Видалити"></a>
        </div>
      </div>
      <div class='item-editor hide'>
        <input type='text' id='item-editor-input'>
        <div class="action-items">
          <a class="fas fa-check" id="apply-icon" title="Застосувати"></a>
          <a class="fas fa-xmark" id="close-icon" title="Скасувати"></a>
        </div>
      </div>
    </div>
`;
class ListEditor extends HTMLElement {
  constructor() {
    super();
    this.clone = list_editor_template.content.cloneNode(true);
    this.root = this.attachShadow({ mode: 'closed' });
    this.root.appendChild(this.clone);
    /*{
          'index': 0,
          'value': '',
          'newIndex': -1,
          'newValue': ''
        }
     */
    this.__items = [];
  }

  static get observedAttributes() {
    return [
      'items',
      'ondiscard',
      'onsave',
      'save-button-title'
    ];
  }

  set items(value) {
    let arr = [];
    if (typeof value == 'string') {
      arr = JSON.parse(value);
    }
    else if (Array.isArray(value)) {
      arr = value;
    }
    else {
      throw new Error('value must be array or JSON-string of array');
    }
    this.__items = [];
    for (let i = 0; i < arr.length; i++) {
      this.__items.push({
        'index': i,
        'value': arr[i],
        'newIndex': -1,
        'newValue': '',
        'moved': false,
        'deleted': false
      });
    }
    this.__updateView();
  }

  get items() {
    return this.__items.map(i => i.newValue !== '' ? i.newValue : i.value);
  }

  get editedItems() {
    return this.__items;
  }

  connectedCallback() {
    if (this.isConnected) {
      this.root.querySelector('#save-icon').addEventListener('click', (ev) => {
        this.__saveChanges();
      });
      this.root.querySelector('#plus-icon').addEventListener('click', (ev) => {
        this.__addItem();
      });

      this.root.querySelector('#discard-icon').addEventListener('click', (ev) => {
        this.__discardChanges();
      });
    }
  }

  disconnectedCallback() {
    this.root.querySelector('#save-icon').removeEventListener('click', (ev) => {
      this.__saveChanges();
    });

    this.root.querySelector('#discard-icon').removeEventListener('click', (ev) => {
      this.__discardChanges();
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'items' && oldValue != newValue) {
      // Parse the attribute value (expected to be a JSON array) and store it in a variable
      this.items = newValue;
      this.__updateView();
    }
    else if (name === 'save-button-title') {
      this.root
        .querySelector('#save-icon')
        .setAttribute('title', newValue);
    }
    else {
      this.addEventListener(name, (ev) => {
        new Function('ev', newValue).call(ev);
      });
    }
  }

  __addItem() {
    this.__items.push({
      'index': this.__items.length,
      'value': 'Новий',
      'newIndex': -1,
      'newValue': '',
      'deleted': false
    });
    this.__updateView();
  }

  __updateView() {
    let n = 0;
    this.root.querySelector('.list-items').innerHTML = '';
    for (const i of this.__items) {
      if (i.deleted) {
        n++;
        continue;
      }
      const cloneItem = list_item_template.content.cloneNode(true);
      cloneItem.querySelector('input#itemIndex').setAttribute('value', n);

      cloneItem.querySelector('#edit-icon').addEventListener('click', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        this.__editItem(li);
      });
      cloneItem.querySelector('#delete-icon').addEventListener('click', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        this.__deleteItem(li);
      });
      cloneItem.querySelector('#apply-icon').addEventListener('click', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        this.__applyChanges(li);
      });
      cloneItem.querySelector('#close-icon').addEventListener('click', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        this.__closeItemEditor(li);
      });
      cloneItem.querySelector('#item-editor-input').addEventListener('keydown', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        console.log(ev.key);
        switch (ev.key) {
          case 'Enter':
            this.__applyChanges(li);
            break;
          case 'Escape':
            this.__closeItemEditor(li);
            break;
        }
      });
      cloneItem.querySelector('#move-up-icon').addEventListener('click', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        this.__moveUp(li);
      });
      cloneItem.querySelector('#move-down-icon').addEventListener('click', (ev) => {
        const li = queryParent(ev.target, 'list-item');
        this.__moveDown(li);
      });
      cloneItem.querySelector('#item-content').innerHTML = i.newValue === '' ? i.value : i.newValue;
      this.root.querySelector('.list-editor .list-items').appendChild(cloneItem);
      n++;
    }
  }

  __editItem(listItem) {
    const itemText = listItem.querySelector('.item-content');
    const itemEditor = listItem.querySelector('.item-editor');
    const value = itemText.querySelector('#item-content').innerHTML;
    const editorInput = itemEditor.querySelector('input');
    editorInput.setAttribute('value', value);
    itemText.classList.toggle('hide');
    itemEditor.classList.toggle('hide');
    editorInput.focus();
    editorInput.select();
  };

  __deleteItem(listItem) {
    const index = getIndex(listItem);
    this.__items[index].deleted = true;
    this.__updateView();
  };

  __applyChanges(listItem) {
    const index = getIndex(listItem);
    const itemText = listItem.querySelector('.item-content');
    const itemEditor = listItem.querySelector('.item-editor');
    const value = itemEditor.querySelector('input').value;
    this.__items[index].newValue = value;
    itemText.querySelector('#item-content').innerHTML = value;
    this.__closeItemEditor(listItem);
  };

  __closeItemEditor(listItem) {
    const itemText = listItem.querySelector('.item-content');
    const itemEditor = listItem.querySelector('.item-editor');
    itemText.classList.toggle('hide');
    itemEditor.classList.toggle('hide');
  };

  __moveUp(listItem) {
    const index = getIndex(listItem);
    this.__items[index].newIndex = index - 1;
    this.__items[index].moved = true;
    this.__items[index - 1].newIndex = index;
    swap(this.__items, index, index - 1);
    this.__updateView();
  }

  __moveDown(listItem) {
    const index = getIndex(listItem);
    this.__items[index].newIndex = index + 1;
    this.__items[index].moved = true;
    this.__items[index + 1].newIndex = index;
    swap(this.__items, index + 1, index);
    this.__updateView();
  }

  __saveChanges() {
    this.dispatchEvent(new Event('onsave', {
      items: this.__items,
      bubbles: true
    }));
    this.__items.forEach(i => {
      i.index = i.newIndex == -1 ? i.index : i.newIndex;
      i.newIndex = -1;
      i.value = i.newValue == '' ? i.value : i.newValue;
      i.newValue = '';
      i.moved = false;
    });
    this.__items = this.__items.filter(i => !i.deleted);
    this.__updateView();
  }

  __discardChanges() {
    this.dispatchEvent(new Event('ondiscard', {
      items: this.__items,
      bubbles: true
    }));
  }
}

const getIndex = (listItem) => {
  return parseInt(listItem.querySelector('input#itemIndex').value);
};

const swap = (arr, idx1, idx2) => {
  arr[idx1] = arr.splice(idx2, 1, arr[idx1])[0];
};

const queryParent = (elem, className) => {
  let parent = elem.parentNode;
  while (parent) {
    if (parent.classList.contains(className)) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return null;
};
customElements.define('list-editor', ListEditor);