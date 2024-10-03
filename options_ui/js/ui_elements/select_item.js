import { Div } from "./div.js";
import { PopupController } from "../popup_controller.js";

export class SelectItem extends Div {
  /**
   *
   * @param {string} label
   * @param {string} value
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(label, value, { id = null, classList = [] } = {}) {
    super({ id, classList: ["select_item", ...classList] });
    this.label = label;
    this.value = value;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.innerText = this.label;

    this.element.onclick = (event) => {
      event.stopPropagation();
      PopupController.pop();
      this.onClick?.(this.value);
    };

    return this.element;
  }
}
