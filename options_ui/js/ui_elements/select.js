import { Div } from "./div.js";
import { Label } from "./label.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { SelectArrow } from "./select_arrow.js";
import { SelectItem } from "./select_item.js";
import { SelectPopup } from "./select_popup.js";
import { UIElement } from "./ui_element.js";

export class Select extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.popupPosition
   */
  constructor({
    id = null,
    classList = [],
    popupPosition = POSITIONS.BELOW,
  } = {}) {
    super({ id, classList: ["select", ...classList] });
    this.popupPosition = popupPosition;
    this.values = {};
    this.value = null;

    this.popup = new SelectPopup();
    this.label = new Label(this.value, { classList: ["select_label"] });
    this.arrow = new SelectArrow();

    this.onChange = null;
  }

  /**
   *
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.appendChild(this.label.draw());
    element.appendChild(this.arrow.draw());

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, this.popupPosition);
      }
    };

    UIElement.setData(element, this.value);
  };

  /**
   *
   * @param {SelectItem} selectItem
   */
  appendChild = (selectItem) => {
    this.popup.appendChild(selectItem);
    this.values[selectItem.value] = selectItem.label;

    selectItem.onClick = (value) => {
      this.setValue(value);
      UIElement.setData(this.element, value);
      this.onChange?.(value);
    };

    return this;
  };

  /**
   *
   * @param {string | number} value
   * @returns {Select}
   */
  setValue = (value) => {
    this.value = value;
    this.label.setText(this.values[value]);
    return this;
  };
}
