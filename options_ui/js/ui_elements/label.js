import { UIElement } from "./ui_element.js";

export class Label extends UIElement {
  /**
   *
   * @param {string} text
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.for_
   */
  constructor(text, { id = null, classList = [], for_ = "" } = {}) {
    super("label", { id, classList });
    this.text = text;
    this.for = for_;
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.innerText = this.text;
    element.setAttribute("for", this.for);
  };

  /**
   *
   * @param {string} text
   * @returns {Label}
   */
  setText = (text) => {
    this.text = text;
    if (this.element) {
      this.element.innerText = text;
    }
    return this;
  };
}
