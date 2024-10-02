export class UIElement {
  /**
   *
   * @param {string} base
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(base, { id = null, classList = [] } = {}) {
    this.base = base;
    this.id = id;
    this.classList = classList;
    this.children = [];
    this.element = null;
  }

  /**
   *
   * @param {UIElement} child
   */
  appendChild = (child) => {
    this.children.push(child);
    return this;
  };

  /**
   *
   * @param {Array<UIElement>} children
   */
  appendChildren = (children) => {
    for (const child of children) {
      this.appendChild(child);
    }
    return this;
  };

  /**
   *
   * @param {HTMLElement} element
   */
  // eslint-disable-next-line no-empty-function, class-methods-use-this, no-unused-vars
  customize = (element) => {};

  /**
   *
   * @returns {HTMLElement}
   */
  draw = () => {
    const element = document.createElement(this.base);
    if (this.id !== null) {
      element.id = this.id;
    }
    if (this.classList.length > 0) {
      element.classList.add(...this.classList);
    }

    this.customize(element);

    this.element = element;
    return element;
  };

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  contains = (element) => this.element?.contains(element);

  remove = () => this.element?.remove();

  /**
   *
   * @param {HTMLElement} element
   * @param {string} data
   */
  static setData = (element, data) => element.setAttribute("data-value", data);
}
