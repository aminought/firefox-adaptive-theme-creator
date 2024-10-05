import { Input } from "./input.js";
import { POSITION } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";

export class ColorPicker extends Input {
  /**
   *
   * @param {string} color
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(color, { id = null, classList = [] } = {}) {
    super(color, { id, classList: ["color_picker_wrapper", ...classList] });
    this.picker = new Picker({
      parent: this.element,
      popup: false,
      alpha: false,
      color,
    });
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.picker.setColor(this.value);
    this.picker.onChange = this.onChange;
    this.picker.onDone = () => PopupController.pop();

    this.element.onclick = (event) => {
      if (event.target !== this.element) {
        return;
      }
      event.stopPropagation();
      if (!PopupController.popFor(this.element)) {
        PopupController.push(event, this.popup, this.element, POSITION.BELOW_ALIGN_CENTER);
      }
    };

    return this.element;
  }
}
