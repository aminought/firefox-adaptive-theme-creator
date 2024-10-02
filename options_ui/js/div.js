import { UIElement } from "./ui_element.js";

export class Div extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList });
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    for (const child of this.children) {
      element.appendChild(child.draw());
    }

    this.element = element;
    return element;
  };
}
