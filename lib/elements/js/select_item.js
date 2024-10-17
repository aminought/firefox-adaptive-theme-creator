import { Div } from "./div.js";

export class SelectItem extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["select_item", ...classList] });
  }

  /**
   *
   * @param {string} label
   * @returns {SelectItem}
   */
  setLabel(label) {
    this.html.innerText = label;
    return this;
  }

  /**
   *
   * @returns {string}
   */
  getLabel() {
    return this.html.innerText;
  }

  /**
   *
   * @param {any} value
   * @returns {SelectItem}
   */
  setValue(value) {
    this.value = value;
    return this;
  }

  /**
   *
   * @returns {any}
   */
  getValue() {
    return this.value;
  }
}
