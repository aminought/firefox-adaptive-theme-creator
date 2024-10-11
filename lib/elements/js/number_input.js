import { Input } from "./input.js";

export class NumberInput extends Input {
  /**
   *
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(value, min, max, { id = null, classList = [] } = {}) {
    super(value, { id, classList: ["number_input", ...classList] });
    this.input = document.createElement("input");
    this.min = min;
    this.max = max;
    this.updateField();
  }

  /**
   *
   * @returns {NumberInput}
   */
  updateField() {
    this.input.value = this.value;
    return this;
  }

  /**
   *
   * @param {number} value
   * @returns {NumberInput}
   */
  setValue(value) {
    Input.prototype.setValueInternal.call(this, value);
    return this.updateField();
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.input.type = "number";
    this.input.min = this.min;
    this.input.max = this.max;

    this.input.onchange = (event) => {
      this.setValue(event.target.value);
      this.onChange?.(this.value);
    };

    this.element.appendChild(this.input);
    return this.element;
  }
}
