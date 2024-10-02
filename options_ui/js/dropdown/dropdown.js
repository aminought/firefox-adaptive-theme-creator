import { DropdownArrow } from "./dropdown_arrow.js";
// eslint-disable-next-line no-unused-vars
import { DropdownItem } from "./dropdown_item.js";
import { DropdownPopup } from "./dropdown_popup.js";
import { Label } from "../label.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { UIElement } from "../ui_element.js";

export class Dropdown extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["dropdown", ...classList] });
    this.values = {};
    this.value = null;

    this.popup = new DropdownPopup();
    this.label = new Label(this.value, { classList: ["dropdown_label"] });
    this.arrow = new DropdownArrow();

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
        PopupController.push(this.popup, element, POSITIONS.BELOW);
      }
    };

    this.element = element;
    this.setData(this.value);

    return element;
  };

  /**
   *
   * @param {DropdownItem} dropdownItem
   */
  appendChild = (dropdownItem) => {
    this.popup.appendChild(dropdownItem);
    this.values[dropdownItem.value] = dropdownItem.label;

    dropdownItem.onClick = (value) => {
      this.setValue(value);
      this.setData(value);
      this.onChange?.(value);
    };

    return this;
  };

  /**
   *
   * @param {string | number} value
   * @returns {Dropdown}
   */
  setValue = (value) => {
    this.value = value;
    this.label.setText(this.values[value]);
    return this;
  };
}
