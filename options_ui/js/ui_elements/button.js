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
   * @returns {HTMLElement}
   */
  draw() {
    this.element.innerText = this.text;
    this.element.onclick = this.onClick;

    for (const child of this.children) {
      this.element.appendChild(child.draw());
    }
    return this.element;
  }
}
