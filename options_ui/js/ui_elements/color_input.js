import { ColorPicker } from "./color_picker.js";
import { Input } from "./input.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";

export class ColorInput extends Input {
  /**
   *
   * @param {string} color
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(color, { id = null, classList = [] } = {}) {
    super(color, { id, classList: ["color_input", ...classList] });
    this.popup = new ColorPicker(color);
    this.updateBackgroundColor();
  }

  /**
   *
   * @returns {ColorInput}
   */
  updateBackgroundColor() {
    this.element.style.backgroundColor = this.value;
    return this;
  }

  /**
   *
   * @param {string} color
   * @returns {ColorInput}
   */
  setValue(color) {
    Input.prototype.setValueInternal.call(this, color);
    return this.updateBackgroundColor();
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.popup.setValue(this.value);
    this.popup.setOnChange(this.onChange);

    this.element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(this.element)) {
        PopupController.push(this.popup, this.element, POSITIONS.BELOW);
      }
    };

    return this.element;
  }
}
