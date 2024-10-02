import { Div } from "./div.js";

export class Button extends Div {
  /**
   *
   * @param {string} text
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(text, { id = "", classList = [] } = {}) {
    super({ id, classList: ["button", ...classList] });
    this.text = text;
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    element.innerText = this.text;

    for (const child of this.children) {
      element.appendChild(child.draw());
    }

    this.element = element;
    return element;
  };
}
