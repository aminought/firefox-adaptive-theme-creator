import { Element } from "../element.js";

export class Input {
  /**
   *
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    /**@type {Array<function(any):void>} */
    this.onChange = [];
  }

  /**
   *
   * @returns {any}
   */
  getValue() {
    return this.value;
  }

  /**
   *
   * @param {any} value
   * @param {boolean} trigger
   * @returns {Input}
   */
  setValue(value, trigger = false) {
    if (value !== this.value) {
      this.value = value;
      this.element.setAttribute("data-value", value);
      if (trigger) {
        this.triggerOnChange(value);
      }
    }
    return this;
  }

  /**
   *
   * @param {function(any):void} callback
   * @returns {Input}
   */
  addOnChange(callback) {
    this.onChange.push(callback);
    return this;
  }

  /**
   *
   * @param {any} value
   * @returns {Input}
   */
  triggerOnChange(value) {
    for (const callback of this.onChange) {
      callback(value);
    }
    return this;
  }
}
