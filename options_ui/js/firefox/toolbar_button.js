import { Part } from "./part.js";

export class ToolbarButton extends Part {
  /**
   *
   * @param {string} id
   * @param {string} iconSvg
   */
  constructor(id, iconSvg) {
    super({ id, classList: ["toolbar_button"] });
    this.iconSvg = iconSvg;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.innerHTML = this.iconSvg;
    return this.element;
  }
}
