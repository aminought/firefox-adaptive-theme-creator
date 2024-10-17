import { Div, Label } from "../../../lib/elements/elements.js";

import { Localizer } from "../utils/localizer.js";

export class OptionsGroup extends Div {
  /**
   *
   * @param {string} titleKey
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(titleKey, { id = null, classList = [] } = {}) {
    super({ id, classList: ["options_group_wrapper", ...classList] });

    const title = Localizer.localizeOptionGroup(titleKey);
    const label = new Label({
      classList: ["options_group_title"],
    }).setText(title);
    this.optionsGroup = new Div({ classList: ["options_group"] });

    this.appendChild(label);
    this.appendChild(this.optionsGroup);
  }

  /**
   *
   * @param {Element} element
   * @returns {OptionsGroup}
   */
  addToGroup(element) {
    this.optionsGroup.appendChild(element);
    return this;
  }
}
