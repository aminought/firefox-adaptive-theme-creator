// eslint-disable-next-line no-unused-vars
import { DropdownItem } from "./dropdown_item.js";
import { DropdownPopup } from "./dropdown_popup.js";
import { PopupController } from "../popup_controller.js";

const ARROW = `
<svg viewBox="0 0 140 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path fill="currentColor" d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
  </g>
</svg>
`;

export class Dropdown {
  /**
   *
   * @param {string=} position
   */
  constructor(position) {
    this.values = {};
    this.popup = new DropdownPopup(position);
    this.#createElements();

    /**
     *
     * @param {string} value
     */
    // eslint-disable-next-line no-unused-vars, no-empty-function
    this.onChange = (value) => {};
  }

  #createElements() {
    this.element = document.createElement("div");
    this.element.className = "dropdown";

    this.labelElement = document.createElement("div");
    this.labelElement.className = "dropdown_label";
    this.element.appendChild(this.labelElement);

    this.arrowElement = document.createElement("div");
    this.arrowElement.className = "dropdown_arrow";
    this.arrowElement.insertAdjacentHTML("beforeend", ARROW);
    this.element.appendChild(this.arrowElement);

    this.element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(this.element)) {
        PopupController.push(this.popup, this.element);
      }
    };
  }

  /**
   *
   * @param {DropdownItem} dropdownItem
   */
  appendChild(dropdownItem) {
    this.popup.appendChild(dropdownItem);
    dropdownItem.dropdown = this;
    this.values[dropdownItem.value] = dropdownItem.label;

    dropdownItem.onClick = (value) => {
      this.value = value;
      this.onChange(value);
    };
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.element.id;
  }

  /**
   * @param {string} id
   */
  set id(id) {
    this.element.id = id;
  }

  get value() {
    return this.element.setAttribute("data-value");
  }

  set value(value) {
    this.element.setAttribute("data-value", value);
    this.labelElement.innerText = this.values[value];
  }
}
