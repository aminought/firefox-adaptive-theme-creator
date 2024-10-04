import { Div } from "../ui_elements/div.js";

export class Part extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList });
  }

  /**
   *
   * @param {string} color
   * @returns {Part}
   */
  setColor(color) {
    this.element.style.color = color;
    return this;
  }

  /**
   *
   * @param {string} color
   * @returns {Part}
   */
  setBackgroundColor(color) {
    this.element.style.backgroundColor = color;
    return this;
  }
}
