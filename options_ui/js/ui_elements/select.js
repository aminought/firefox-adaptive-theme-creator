import { Label } from "./label.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { SelectArrow } from "./select_arrow.js";
import { SelectItem } from "./select_item.js";
import { SelectPopup } from "./select_popup.js";
import { UIElement } from "./ui_element.js";

export class Select extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.popupPosition
   */
  constructor({
    id = "",
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
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    element.appendChild(this.label.draw());
    element.appendChild(this.arrow.draw());

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, this.popupPosition);
      }
    };

    this.element = element;
    this.setData(this.value);

    return element;
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
      this.setData(value);
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
