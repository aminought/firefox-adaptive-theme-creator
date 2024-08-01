import {
  positionAbove,
  positionBelow,
  positionInPlace,
  positionRight,
} from "../utils/html.js";
// eslint-disable-next-line no-unused-vars
import { DropdownItem } from "./dropdown_item.js";

export class DropdownPopup {
  static POSITION = {
    above: "above",
    below: "below",
    right: "right",
    inplace: "inplace",
  };

  /**
   *
   * @param {string=} position
   */
  constructor(position = DropdownPopup.POSITION.below) {
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
    if (this.position === DropdownPopup.POSITION.below) {
      positionBelow(this.element, body, target, 4);
    } else if (this.position === DropdownPopup.POSITION.above) {
      positionAbove(this.element, body, target, 4);
    } else if (this.position === DropdownPopup.POSITION.right) {
      positionRight(this.element, body, target, 4);
    } else if (this.position === DropdownPopup.POSITION.inplace) {
      positionInPlace(this.element, body, target);
    }
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
