import { FixedPopup, Label } from "../../../lib/elements/elements.js";

import { Localizer } from "../utils/localizer.js";

const ID = "status_bar";

export class StatusBar extends FixedPopup {
  /**
   *
   * @param {string} text
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {number?} params.timeout
   * @param {CallableFunction} params.localize
   */
  constructor(
    text,
    {
      classList = [],
      timeout = 3000,
      localize = Localizer.localizeStatusBar,
    } = {}
  ) {
    super(timeout, { id: ID, classList });
    this.text = localize(text);
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    const label = new Label(this.text);
    this.element.appendChild(label.draw());
    return this.element;
  }

  static unshow() {
    FixedPopup.unshow(ID);
  }
}
