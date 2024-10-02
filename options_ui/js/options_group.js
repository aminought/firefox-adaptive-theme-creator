import { Div } from "./div.js";
import { Label } from "./label.js";
import { OptionsRow } from "./options_row.js";

export class OptionsGroup extends Div {
  /**
   *
   * @param {string} title
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(title, { id = "", classList = [] } = {}) {
    super({ id, classList: ["options_group_wrapper", ...classList] });
    this.title = title;
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    const optionsGroup = new Div({ classList: ["options_group"] });
    for (const child of this.children) {
      optionsGroup.appendChild(child);
    }

    const label = new Label(this.title, {
      classList: ["options_group_title"],
    });
    element.appendChild(label.draw());
    element.appendChild(optionsGroup.draw());

    this.element = element;
    return element;
  };
}
