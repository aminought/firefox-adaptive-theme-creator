export class Element {
  /**
   *
   * @param {string} tag
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(tag, { id = null, classList = [] } = {}) {
    this.html = document.createElement(tag);
    if (id !== null) {
      this.html.id = id;
    }
    if (classList.length > 0) {
      this.html.classList.add(...classList);
    }
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.html.id;
  }

  /**
   *
   * @param {string} className
   * @returns {Element}
   */
  addClass(className) {
    this.html.classList.add(className);
    return this;
  }

  /**
   * @returns {CSSStyleDeclaration}
   */
  get style() {
    return this.html.style;
  }

  /**
   *
   * @param {Element} child
   */
  appendChild(child) {
    this.html.appendChild(child.draw());
    return this;
  }

  /**
   *
   * @param {Array<Element>} children
   * @returns {Element}
   */
  appendChildren(children) {
    for (const child of children) {
      this.appendChild(child);
    }
    return this;
  }

  /**
   *
   * @returns {Element}
   */
  removeChildren() {
    while (this.hasChildren()) {
      this.html.removeChild(this.html.lastChild);
    }
    return this;
  }

  /**
   *
   * @returns {boolean}
   */
  hasChildren() {
    return this.html.firstChild !== null;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    return this.html;
  }

  /**
   *
   * @param {Element} target
   * @returns {boolean}
   */
  contains(target) {
    return this.html?.contains(target.html);
  }

  remove() {
    this.html?.remove();
  }

  /**
   *
   * @returns {DOMRect}
   */
  getBoundingClientRect() {
    return this.html.getBoundingClientRect();
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @returns {Element}
   */
  setAttribute(key, value) {
    this.html.setAttribute(key, value);
    return this;
  }

  /**
   *
   * @param {function(MouseEvent):void} callback
   */
  addOnClick(callback) {
    this.html.addEventListener("click", callback);
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  addOnContextMenu(callback) {
    this.html.addEventListener("contextmenu", callback);
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  addOnMouseEnter(callback) {
    this.html.addEventListener("mouseenter", callback);
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  addOnMouseLeave(callback) {
    this.html.addEventListener("mouseleave", callback);
    return this;
  }
}
