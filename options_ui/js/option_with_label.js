import { Label } from "./ui_elements/label.js";
import { Separator } from "./ui_elements/separator.js";
import { UIElement } from "./ui_elements/ui_element.js";

export class OptionWithLabel extends UIElement {
  /**
   *
   * @param {string} label
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(label, { id = "", classList = [] } = {}) {
    super({ id, classList: ["option", ...classList] });

    this.label = new Label(label, { classList: ["option_title"] });
    this.separator = new Separator();
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    element.appendChild(this.label.draw());
    element.appendChild(this.separator.draw());

    for (const child of this.children) {
      element.appendChild(child.draw());
    }

    this.element = element;
    return element;
  };
}
