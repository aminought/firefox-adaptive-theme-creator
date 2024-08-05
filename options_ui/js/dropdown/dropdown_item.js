// eslint-disable-next-line no-unused-vars
import { Dropdown } from "./dropdown.js";
import { PopupController } from "../popup_controller.js";

export class DropdownItem {
  constructor() {
    /**
     *
     * @param {string} value
     */
    // eslint-disable-next-line no-unused-vars, no-empty-function
    this.onClick = (value) => {};
    this.element = this.#createElement();
    /**
     * @type {Dropdown}
     */
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createElement() {
    const element = document.createElement("div");
    element.className = "dropdown_item";

    element.onclick = (event) => {
      event.stopPropagation();
      PopupController.pop();
      this.onClick(this.value);
    };

    return element;
  }

  get value() {
    return this.element.getAttribute("data-value");
  }

  set value(value) {
    this.element.setAttribute("data-value", value);
  }

  get label() {
    return this.element.getAttribute("data-label");
  }

  set label(label) {
    this.element.setAttribute("data-label", label);
    this.element.innerText = label;
  }
}
