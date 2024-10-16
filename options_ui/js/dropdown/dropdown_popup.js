import { POSITIONS, positionRelative } from "../utils/positions.js";
// eslint-disable-next-line no-unused-vars
import { DropdownItem } from "./dropdown_item.js";

export class DropdownPopup {
  /**
   *
   * @param {string=} position
   */
  constructor(position = POSITIONS.BELOW) {
    this.position = position;
    this.element = DropdownPopup.#createElement();
  }

  /**
   * @returns {HTMLDivElement}
   */
  static #createElement() {
    const element = document.createElement("div");
    element.className = "dropdown_popup";
    return element;
  }

  /**
   *
   * @param {DropdownItem} dropdownItem
   */
  appendChild(dropdownItem) {
    this.element.appendChild(dropdownItem.element);
  }

  /**
   *
   * @param {HTMLElement} target
   */
  draw(target) {
    const body = document.querySelector("body");
    body.appendChild(this.element);
    positionRelative(this.position, this.element, body, target);
  }

  /**
   *
   * @returns {boolean}
   */
  exists() {
    return Boolean(this.element.parentElement);
  }

  remove() {
    if (this.exists()) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  contains(element) {
    return this.element.contains(element);
  }
}
