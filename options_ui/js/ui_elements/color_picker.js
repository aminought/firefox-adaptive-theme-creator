import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { UIElement } from "./ui_element.js";

export class ColorPicker extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["color_picker_wrapper", ...classList] });
    this.color = null;
    this.onChange = null;
  }

  /**
   *
   * @param {string} color
   * @returns {ColorPicker}
   */
  setColor = (color) => {
    this.color = color;
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

    element.style.position = "absolute";

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, POSITIONS.BELOW);
      }
    };

    const picker = new Picker({
      parent: element,
      popup: false,
      alpha: false,
      color: this.color,
    });
    picker.onChange = this.onChange;
    picker.onDone = () => PopupController.pop();

    this.element = element;
    return element;
  };
}
