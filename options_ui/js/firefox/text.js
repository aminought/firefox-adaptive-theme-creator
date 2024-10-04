import { Div } from "../ui_elements/div.js";
import { Label } from "../ui_elements/label.js";

const FILLER = "@".repeat(100);

export class Text extends Div {
  /**
   *
   * @param {string} id
   */
  constructor(id = null) {
    super({ id, classList: ["text"] });
    this.label = new Label(FILLER);
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.appendChild(this.label.draw());
    return this.element;
  }
}
