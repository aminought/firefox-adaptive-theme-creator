import { ColorPicker } from "./color_picker.js";
import { Div } from "./div.js";
import { Input } from "./mutators/input.js";

export class ColorInput extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["color_input", ...classList] });
    this.colorPicker = new ColorPicker().addOnChange((value) => {
      this.setValue(value, true);
    });

    this.addOnClick((event) => {
      event.stopPropagation();
      this.colorPicker.popup.push(event);
    });

    this.input = new Input(this);
  }

  /**
   *
   * @returns {string}
   */
  getValue() {
    return this.input.value;
  }

  /**
   *
   * @param {string} value
   * @param {boolean} trigger
   * @returns {ColorInput}
   */
  setValue(value, trigger = false) {
    if (value !== this.input.getValue()) {
      this.style.backgroundColor = value;
      this.colorPicker.setValue(value, trigger);
      this.input.setValue(value, trigger);
    }
    return this;
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {ColorInput}
   */
  addOnChange(callback) {
    this.input.addOnChange(callback);
    return this;
  }
}
