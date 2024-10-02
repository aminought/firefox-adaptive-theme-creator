import { Div } from "./div.js";

export class Button extends Div {
  /**
   *
   * @param {string} text
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(text, { id = null, classList = [] } = {}) {
    super({ id, classList: ["button", ...classList] });
    this.text = text;
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.innerText = this.text;
    for (const child of this.children) {
      element.appendChild(child.draw());
    }
  };
}
