import { Div } from "./div.js";

export class Label extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["label", ...classList] });
    this.label = document.createElement("label");
    this.html.appendChild(this.label);
  }

  /**
   *
   * @param {string} text
   * @returns {Label}
   */
  setText(text) {
    this.label.innerText = text;
    return this;
  }
}
