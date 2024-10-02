import { Div } from "./ui_elements/div.js";
import { Label } from "./ui_elements/label.js";
import { Separator } from "./ui_elements/separator.js";

export class OptionWithLabel extends Div {
  /**
   *
   * @param {string} label
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(label, { id = null, classList = [] } = {}) {
    super({ id, classList: ["option", ...classList] });

    this.label = new Label(label, { classList: ["option_title"] });
    this.separator = new Separator();
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.appendChild(this.label.draw());
    element.appendChild(this.separator.draw());

    for (const child of this.children) {
      element.appendChild(child.draw());
    }
  };
}
