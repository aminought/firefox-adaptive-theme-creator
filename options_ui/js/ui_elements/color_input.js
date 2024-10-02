import { ColorPicker } from "./color_picker.js";
import { Div } from "./div.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";

export class ColorInput extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["color_input", ...classList] });
    this.popup = new ColorPicker();
    this.color = null;
  }

  /**
   *
   * @param {string} color
   * @returns {ColorInput}
   */
  setColor = (color) => {
    this.color = color;
    if (this.element) {
      this.element.style.backgroundColor = color;
    }
    return this;
  };

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.style.backgroundColor = this.color;
    this.popup.setColor(this.color);

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, POSITIONS.BELOW);
      }
    };
  };
}
