import {
  POSITION,
  positionByCoords,
  positionRelative,
} from "./utils/positions.js";

import { UIElement } from "./ui_elements/ui_element.js";

const FIRST_Z_INDEX = 100;

export class PopupController {
  static body = document.querySelector("body");
  static stack = [];
  static selfDesctructive = null;

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
    PopupController.body.appendChild(element);
    if (position === POSITION.POINTER) {
      positionByCoords(
        element,
        PopupController.body,
        event.clientX,
        event.clientY
      );
    } else {
      positionRelative(position, element, PopupController.body, target);
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
   * @param {UIElement} popup
   */
  static showSelfDestructive(popup) {
    if (PopupController.selfDesctructive !== null) {
      PopupController.selfDesctructive.remove();
    }
    PopupController.selfDesctructive = popup;
    PopupController.body.appendChild(popup.draw());
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
