import { ColorPicker } from "./color_picker.js";
import { Input } from "./input.js";
import { POSITION } from "../utils/positions.js";
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
    this.popup.setValue(this.value);
    return this.updateBackgroundColor();
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.popup.setOnChange(this.onChange);

    this.element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(this.element)) {
        PopupController.push(event, this.popup, this.element, POSITION.BELOW_ALIGN_CENTER);
      }
    };

    return this.element;
  }
}
