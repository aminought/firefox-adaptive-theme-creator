import { Div } from "./ui_elements/div.js";
import { Label } from "./ui_elements/label.js";
import { Localizer } from "./utils/localizer.js";

export class StatusBar extends Div {
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
    super({ id: "status_bar", classList });
    this.text = localize(text);
    this.timeout = timeout;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    const label = new Label(this.text);
    this.element.appendChild(label.draw());

    if (this.timeout !== null) {
      setTimeout(() => {
        this.remove();
      }, this.timeout);
    }

    return this.element;
  }
}
