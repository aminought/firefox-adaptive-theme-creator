import { Popup } from "./popup.js";
import { UIElement } from "./ui_element.js";

export class ColorPicker extends Popup {
  /**
   *
   * @param {UIElement} related
   * @param {string} color
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(related, color, { id = null, classList = [] } = {}) {
    super(
      related,
      Popup.ALIGNMENT_X.OFF,
      Popup.ALIGNMENT_Y.OFF,
      Popup.ORIENTATION.HORIZONTAL,
      { id, classList: ["color_picker_wrapper", ...classList] }
    );
    this.picker = new Picker({
      parent: this.element,
      popup: false,
      alpha: false,
      color,
    });
  }

  /**
   *
   * @param {string | number} value
   * @returns {ColorPicker}
   */
  setValue(value) {
    this.value = value;
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {ColorPicker}
   */
  setOnChange(callback) {
    this.onChange = callback;
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.picker.setColor(this.value);
    this.picker.onChange = this.onChange;
    return this.element;
  }
}
