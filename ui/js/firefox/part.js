import { Div } from "../../../lib/elements/elements.js";

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
    this.style.color = color;
    return this;
  }

  /**
   *
   * @param {string} color
   * @returns {Part}
   */
  setBackgroundColor(color) {
    this.style.backgroundColor = color;
    return this;
  }
}
