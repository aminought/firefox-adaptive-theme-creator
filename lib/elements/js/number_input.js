import { Div } from "./div.js";
import { Input } from "./mutators/input.js";

export class NumberInput extends Div {
  /**
   *
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(min, max, { id = null, classList = [] } = {}) {
    super({ id, classList: ["number_input", ...classList] });
    this.htmlInput = document.createElement("input");
    this.htmlInput.type = "number";
    this.htmlInput.min = min;
    this.htmlInput.max = max;
    this.html.appendChild(this.htmlInput);

    this.input = new Input(this);

    this.htmlInput.addEventListener("change", (event) => {
      this.setValue(event.target.value, true);
    });
  }

  /**
   *
   * @returns {number}
   */
  getValue() {
    return this.input.value;
  }

  /**
   *
   * @param {number} value
   * @param {boolean} trigger
   * @returns {NumberInput}
   */
  setValue(value, trigger = false) {
    if (value !== this.input.getValue()) {
      this.htmlInput.value = value;
      this.input.setValue(value, trigger);
    }
    return this;
  }

  /**
   *
   * @param {function(number):void} callback
   * @returns {NumberInput}
   */
  addOnChange(callback) {
    this.input.addOnChange(callback);
    return this;
  }
}
