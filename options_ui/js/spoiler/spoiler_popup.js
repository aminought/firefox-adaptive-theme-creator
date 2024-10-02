import { UIElement } from "../ui_element.js";

export class SpoilerPopup extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["spoiler_popup", ...classList] });
  }

  /**
   *
   * @param {HTMLElement} target
   * @returns {SpoilerPopup}
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
