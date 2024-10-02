import { Div } from "./div.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";

export class ColorPicker extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
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
   * @param {HTMLElement} element
   */
  customize = (element) => {
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
  };
}
