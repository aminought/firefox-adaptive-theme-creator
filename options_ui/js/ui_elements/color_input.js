import { ColorPicker } from "./color_picker.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { UIElement } from "./ui_element.js";

export class ColorInput extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["color_input", ...classList] });
    this.popup = new ColorPicker();
    this.color = null;
  }

  /**
   *
   * @param {string} color
   * @returns {ColorInput}
   */
  setColor = (color) => {
    this.color = color;
    if (this.element) {
      this.element.style.backgroundColor = color;
    }
    return this;
  };

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    element.style.backgroundColor = this.color;
    this.popup.setColor(this.color);

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, POSITIONS.BELOW);
      }
    };

    this.element = element;
    return element;
  };
}
