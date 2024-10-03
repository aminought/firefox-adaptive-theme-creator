import { Div } from "./div.js";

export class Label extends Div {
  /**
   *
   * @param {string} text
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.for_
   */
  constructor(text, { id = null, classList = [], for_ = "" } = {}) {
    super({ id, classList: ["label", ...classList] });
    this.label = document.createElement("label");
    this.setText(text);
    this.for = for_;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.label.setAttribute("for", this.for);

    this.element.appendChild(this.label);
    return this.element;
  }

  /**
   *
   * @param {string} text
   * @returns {Label}
   */
  setText(text) {
    this.text = text;
    this.label.innerText = text;
    return this;
  }
}
