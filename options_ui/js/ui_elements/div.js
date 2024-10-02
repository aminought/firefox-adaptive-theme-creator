import { UIElement } from "./ui_element.js";

export class Div extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super("div", { id, classList });
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    for (const child of this.children) {
      element.appendChild(child.draw());
    }
  };
}
