import { Div } from "./ui_elements/div.js";
import { Label } from "./ui_elements/label.js";
import { OptionsRow } from "./options_row.js";

export class OptionsGroup extends Div {
  /**
   *
   * @param {string} title
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(title, { id = null, classList = [] } = {}) {
    super({ id, classList: ["options_group_wrapper", ...classList] });
    this.title = title;
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    const optionsGroup = new Div({ classList: ["options_group"] });
    for (const child of this.children) {
      optionsGroup.appendChild(child);
    }

    const label = new Label(this.title, {
      classList: ["options_group_title"],
    });
    element.appendChild(label.draw());
    element.appendChild(optionsGroup.draw());
  };
}
