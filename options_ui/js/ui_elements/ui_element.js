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
   */
  appendChildren(children) {
    for (const child of children) {
      this.appendChild(child);
    }
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
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  contains(element) {
    return this.element?.contains(element);
  }

  remove() {
    this.element?.remove();
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  setOnClick(callback) {
    this.onClick = callback;
    return this;
  }
}
