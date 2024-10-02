import { UIElement } from "./ui_element.js";

export class NumberInput extends UIElement {
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
    super("input", { id, classList: ["number_input", ...classList] });
    this.value = value;
    this.min = min;
    this.max = max;
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.type = "number";
    element.min = this.min;
    element.max = this.max;
    element.value = this.value;
  };
}
