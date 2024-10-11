import { Div } from "./div.js";

export class Input extends Div {
  /**
   *
   * @param {string | number} value
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(value, { id = null, classList = [] } = {}) {
    super({ id, classList });
    this.setValueInternal(value);
    this.onChange = null;
  }

  /**
   *
   * @param {string | number} value
   * @returns {Input}
   */
  setValueInternal(value) {
    this.value = value;
    this.element.setAttribute("data-value", value);
    return this;
  }

  /**
   *
   * @param {string | number} value
   * @returns {Input}
   */
  setValue(value) {
    return this.setValueInternal(value);
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {Input}
   */
  setOnChange(callback) {
    this.onChange = callback;
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    for (const child of this.children) {
      this.element.appendChild(child.draw());
    }
    return this.element;
  }
}
