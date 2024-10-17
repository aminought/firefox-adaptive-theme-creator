import { Div } from "./div.js";

export class Button extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["button", ...classList] });
  }

  /**
   *
   * @param {string} text
   * @returns {Button}
   */
  setText(text) {
    this.html.innerText = text;
    return this;
  }
}
