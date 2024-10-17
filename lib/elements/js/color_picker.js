import { Div } from "./div.js";
import { Input } from "./mutators/input.js";
import { Popup } from "./mutators/popup.js";

export class ColorPicker extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["color_picker_wrapper", ...classList] });

    this.picker = null;
    this.popup = new Popup(
      this,
      Popup.ALIGNMENT_X.OFF,
      Popup.ALIGNMENT_Y.OFF,
      Popup.ORIENTATION.HORIZONTAL
    );
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
   * @returns {ColorPicker}
   */
  setValue(value, trigger = false) {
    if (value !== this.input.getValue()) {
      if (this.picker === null) {
        this.picker = new Picker({
          parent: this.html,
          popup: false,
          alpha: false,
          color: value,
        });
        this.picker.onChange = (value) => {
          this.setValue(value.rgbaString, true);
        };
      }
      this.input.setValue(value, trigger);
    }
    return this;
  }

  /**
   *
   * @param {function(string):void} callback
   * @returns {ColorPicker}
   */
  addOnChange(callback) {
    this.input.addOnChange(callback);
    return this;
  }
}
