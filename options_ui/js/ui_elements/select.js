import { ORIENTATION, SelectPopup } from "./select_popup.js";

import { Input } from "./input.js";
import { Label } from "./label.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { SelectArrow } from "./select_arrow.js";
import { SelectItem } from "./select_item.js";

export class Select extends Input {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.orientation
   * @param {string} params.popupPosition
   */
  constructor({
    id = null,
    classList = [],
    orientation = ORIENTATION.HORIZONTAL,
    popupPosition = POSITIONS.BELOW,
  } = {}) {
    super("", { id, classList: ["select", ...classList] });
    this.popupPosition = popupPosition;
    this.popup = new SelectPopup({ orientation });
    this.label = new Label(this.value, { classList: ["select_label"] });
    this.arrow = new SelectArrow();
    this.values = {};
  }

  /**
   *
   * @returns {Select}
   */
  updateLabel() {
    this.label.setText(this.values[this.value]);
    return this;
  }

  /**
   *
   * @param {string | number} value
   * @returns {Select}
   */
  setValue(value) {
    Input.prototype.setValueInternal.call(this, value);
    return this.updateLabel();
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.appendChild(this.label.draw());
    this.element.appendChild(this.arrow.draw());

    this.element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(this.element)) {
        PopupController.push(
          event,
          this.popup,
          this.element,
          this.popupPosition
        );
      }
    };

    return this.element;
  }

  /**
   *
   * @param {SelectItem} selectItem
   * @returns {Select}
   */
  appendChild(selectItem) {
    this.popup.appendChild(selectItem);
    this.values[selectItem.value] = selectItem.label;

    selectItem.onClick = (value) => {
      this.setValue(value);
      this.onChange?.(value);
    };

    return this;
  }
}
