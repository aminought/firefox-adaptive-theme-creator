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
   */
  constructor(text, { id = null, classList = [], timeout = 3000 } = {}) {
    super({ id, classList: ["status_bar", ...classList] });
    this.text = Localizer.localizeStatusBar(text);
    this.timeout = timeout;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    const label = new Label(this.text);
    this.element.appendChild(label.draw());

    setTimeout(() => {
      this.remove();
    }, this.timeout);

    return this.element;
  }
}
