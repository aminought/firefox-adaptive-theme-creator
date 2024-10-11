export class UIElement {
  /**
   *
   * @param {string} tag
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(tag, { id = null, classList = [] } = {}) {
    this.element = document.createElement(tag);
    if (id !== null) {
      this.element.id = id;
    }
    if (classList.length > 0) {
      this.element.classList.add(...classList);
    }

    this.children = [];
    this.onClick = null;
  }

  get id() {
    return this.element.id;
  }

  /**
   *
   * @param {UIElement} child
   */
  appendChild(child) {
    this.children.push(child);
    return this;
  }

  /**
   *
   * @param {Array<UIElement>} children
   * @returns {UIElement}
   */
  appendChildren(children) {
    for (const child of children) {
      this.appendChild(child);
    }
    return this;
  }

  /**
   *
   * @returns {UIElement}
   */
  removeChildren() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.lastChild);
    }
    this.children = [];
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    return this.element;
  }

  /**
   *
   * @param {number} zIndex
   * @returns {UIElement}
   */
  setZIndex(zIndex) {
    this.element.style.zIndex = zIndex;
    return this;
  }

  /**
   *
   * @param {string} height
   * @returns {UIElement}
   */
  setHeight(height) {
    this.element.style.height = height;
    return this;
  }

  /**
   *
   * @param {string} height
   * @returns {UIElement}
   */
  setMaxHeight(height) {
    this.element.style.maxHeight = height;
    return this;
  }

  /**
   *
   * @param {UIElement} target
   * @returns {boolean}
   */
  contains(target) {
    return this.element?.contains(target.element);
  }

  remove() {
    this.element?.remove();
  }

  /**
   *
   * @returns {DOMRect}
   */
  getBoundingClientRect() {
    return this.element.getBoundingClientRect();
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  setOnClick(callback) {
    this.onClick = callback;
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  setOnContextMenu(callback) {
    this.element.oncontextmenu = callback;
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  setOnMouseEnter(callback) {
    this.element.onmouseenter = callback;
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  setOnMouseLeave(callback) {
    this.element.onmouseleave = callback;
    return this;
  }
}
