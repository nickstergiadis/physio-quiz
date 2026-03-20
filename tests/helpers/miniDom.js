class MiniEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = Boolean(options.bubbles);
    this.defaultPrevented = false;
    this.target = null;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

class MiniNode {
  constructor() {
    this.parentNode = null;
    this.childNodes = [];
  }

  appendChild(child) {
    if (child === null || child === undefined) return child;
    const normalized = typeof child === 'string' ? new MiniText(child) : child;
    normalized.parentNode = this;
    this.childNodes.push(normalized);
    return normalized;
  }

  append(...items) {
    items.forEach((item) => this.appendChild(item));
  }

  get children() {
    return this.childNodes.filter((node) => node instanceof MiniElement);
  }

  get textContent() {
    return this.childNodes.map((node) => node.textContent).join('');
  }

  set textContent(value) {
    this.childNodes = [];
    if (value !== '') {
      this.appendChild(String(value));
    }
  }
}

class MiniText extends MiniNode {
  constructor(text) {
    super();
    this.nodeType = 3;
    this._text = String(text);
  }

  get textContent() {
    return this._text;
  }

  set textContent(value) {
    this._text = String(value);
  }
}

function findAncestor(node, predicate) {
  let current = node?.parentNode;
  while (current) {
    if (predicate(current)) return current;
    current = current.parentNode;
  }
  return null;
}

function matchesSelector(element, selector) {
  const options = selector.split(',').map((item) => item.trim());
  return options.some((option) => {
    if (option.startsWith('.')) {
      return element.className.split(/\s+/).filter(Boolean).includes(option.slice(1));
    }
    if (option.startsWith('#')) {
      return element.id === option.slice(1);
    }
    return element.tagName.toLowerCase() === option.toLowerCase();
  });
}

class MiniElement extends MiniNode {
  constructor(tagName) {
    super();
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.listeners = new Map();
    this.dataset = {};
    this.value = '';
    this.disabled = false;
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get id() {
    return this.getAttribute('id') ?? '';
  }

  set className(value) {
    this.setAttribute('class', value);
  }

  get className() {
    return this.getAttribute('class') ?? '';
  }

  set innerHTML(value) {
    if (value === '') {
      this.childNodes = [];
      return;
    }
    this.textContent = value;
  }

  get innerHTML() {
    return this.textContent;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name.startsWith('data-')) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      this.dataset[key] = String(value);
    }
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  addEventListener(type, listener) {
    const group = this.listeners.get(type) ?? [];
    group.push(listener);
    this.listeners.set(type, group);
  }

  dispatchEvent(event) {
    event.target = this;
    const group = this.listeners.get(event.type) ?? [];
    group.forEach((listener) => listener(event));
    if (event.bubbles && this.parentNode) {
      this.parentNode.dispatchEvent(event);
    }
    return !event.defaultPrevented;
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (node) => {
      if (node instanceof MiniElement && matchesSelector(node, selector)) {
        results.push(node);
      }
      node.childNodes.forEach(walk);
    };
    walk(this);
    return results;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  click() {
    this.dispatchEvent(new MiniEvent('click', { bubbles: true }));
    if (this.tagName === 'BUTTON' && (this.getAttribute('type') ?? 'submit') === 'submit') {
      const form = findAncestor(this, (node) => node.tagName === 'FORM');
      if (form) {
        form.dispatchEvent(new MiniEvent('submit', { bubbles: true }));
      }
    }
  }
}

class MiniDocument extends MiniElement {
  constructor() {
    super('#document');
    this.body = new MiniElement('body');
    super.appendChild(this.body);
  }

  createElement(tagName) {
    return new MiniElement(tagName);
  }
}

class MiniLocation {
  constructor() {
    this._hash = '';
  }

  get hash() {
    return this._hash;
  }

  set hash(value) {
    this._hash = String(value);
  }
}

class MiniWindow {
  constructor(document) {
    this.document = document;
    this.location = new MiniLocation();
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const group = this.listeners.get(type) ?? [];
    group.push(listener);
    this.listeners.set(type, group);
  }

  dispatchEvent(event) {
    const group = this.listeners.get(event.type) ?? [];
    group.forEach((listener) => listener(event));
    return !event.defaultPrevented;
  }
}

export function createMiniDom() {
  const document = new MiniDocument();
  const window = new MiniWindow(document);
  return { window, document, Event: MiniEvent };
}
