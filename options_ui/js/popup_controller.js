import {
  POSITIONS,
  positionByCoords,
  positionRelative,
} from "./utils/positions.js";

import { UIElement } from "./ui_elements/ui_element.js";

const FIRST_Z_INDEX = 100;

export class PopupController {
  static stack = [];

  /**
   *
   * @param {MouseEvent} event
   * @param {UIElement} popup
   * @param {HTMLElement} target
   * @param {string} position
   * @param  {...any} args
   */
  static push(event, popup, target, position, ...args) {
    const element = popup.draw(...args);
    const body = document.querySelector("body");
    body.appendChild(element);
    if (position === POSITIONS.POINTER) {
      positionByCoords(element, body, event.clientX, event.clientY);
    } else {
      positionRelative(position, element, body, target);
    }
    popup.setZIndex(FIRST_Z_INDEX + this.stack.length);
    this.stack.push(popup);
  }

  static pop() {
    if (!this.stack.length) {
      return;
    }
    const popup = this.stack.pop();
    popup.remove();
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  static popFor(element) {
    let popped = false;
    while (!this.empty()) {
      const popup = this.peek();
      if (popup.contains(element)) {
        return popped;
      }
      this.pop();
      popped = true;
    }
    return popped;
  }

  /**
   *
   * @returns {object}
   */
  static peek() {
    return this.stack[this.stack.length - 1];
  }

  static clear() {
    while (!this.empty()) {
      this.pop();
    }
  }

  static empty() {
    return !this.stack.length;
  }
}
