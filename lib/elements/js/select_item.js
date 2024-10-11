import { Div } from "./div.js";
import { Popup } from "./popup.js";

export class SelectItem extends Div {
  /**
   *
   * @param {string} label
   * @param {string} value
   * @param {Popup} selectPopup
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(label, value, selectPopup, { id = null, classList = [] } = {}) {
    super({ id, classList: ["select_item", ...classList] });
    this.label = label;
    this.value = value;
    this.selectPopup = selectPopup;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.innerText = this.label;

    this.element.onclick = (event) => {
      event.stopPropagation();
      this.selectPopup.pop();
      this.onClick?.(this.value);
    };

    return this.element;
  }
}
