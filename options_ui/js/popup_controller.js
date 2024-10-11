import { FixedPopup } from "./ui_elements/fixed_popup.js";
import { Popup } from "./ui_elements/popup.js";

const POPUP_MAX_HEIGHT = 600;
const FIRST_Z_INDEX = 100;
const PADDING = 4;

export class PopupController {
  static body = document.querySelector("body");
  /**@type {Array<Popup>} */
  static stack = [];
  /**@type {FixedPopup} */
  static fixed = {};

  /**
   *
   * @param {Popup} popup
   * @param {MouseEvent} event
   */
  static push(popup, event) {
    PopupController.body.appendChild(popup.draw());
    popup.setOnVisualChange(() => {
      PopupController.position(popup, event);
    });
    popup.onVisualChange();
    popup.setZIndex(FIRST_Z_INDEX + PopupController.stack.length);
    PopupController.stack.push(popup);
  }

  static pop() {
    if (PopupController.empty()) {
      return;
    }
    const popup = PopupController.stack.pop();
    popup.remove();
  }

  /**
   *
   * @param {MouseEvent} event
   */
  static popFor(event) {
    while (!PopupController.empty()) {
      const popup = PopupController.peek();
      const popupRect = popup.getBoundingClientRect();
      if (
        event.clientX >= popupRect.left &&
        event.clientX <= popupRect.right &&
        event.clientY >= popupRect.top &&
        event.clientY <= popupRect.bottom
      ) {
        return;
      }
      PopupController.pop();
    }
  }

  /**
   *
   * @param {FixedPopup} popup
   */
  static showFixed(popup) {
    if (popup.id in PopupController.fixed) {
      PopupController.fixed[popup.id].remove();
    }
    PopupController.fixed[popup.id] = popup;
    PopupController.body.appendChild(popup.draw());
  }

  /**
   *
   * @param {string} id
   */
  static removeFixed(id) {
    if (id in PopupController.fixed) {
      PopupController.fixed[id].remove();
    }
  }

  /**
   *
   * @returns {Popup}
   */
  static peek() {
    return PopupController.stack[PopupController.stack.length - 1];
  }

  static clear() {
    while (!PopupController.empty()) {
      PopupController.pop();
    }
  }

  static empty() {
    return !PopupController.stack.length;
  }

  /**
   *
   * @param {Popup} popup
   * @param {MouseEvent} event
   */
  static position(popup, event) {
    const popupRect = popup.getBoundingClientRect();
    const bodyRect = PopupController.body.getBoundingClientRect();
    const relatedRect = popup.related?.getBoundingClientRect();

    let x = 0;
    let y = 0;

    // Alignment by X axis

    if (popup.alignmentX === Popup.ALIGNMENT_X.OFF) {
      x += event.clientX;
    } else if (popup.alignmentX === Popup.ALIGNMENT_X.CENTER) {
      x += relatedRect.left + relatedRect.width / 2 - popupRect.width / 2;
    } else if (popup.alignmentX === Popup.ALIGNMENT_X.LEFT) {
      x += relatedRect.left;
    } else if (popup.alignmentX === Popup.ALIGNMENT_X.RIGHT) {
      x += relatedRect.right - popupRect.width;
    } else if (popup.alignmentX === Popup.ALIGNMENT_X.LEFT_SIDE) {
      x += relatedRect.left - popupRect.width - PADDING;
    } else if (popup.alignmentX === Popup.ALIGNMENT_X.RIGHT_SIDE) {
      x += relatedRect.right + PADDING;
    }

    if (x + popupRect.width > bodyRect.right) {
      x = bodyRect.right - popupRect.width - bodyRect.left;
    }
    if (x < bodyRect.left) {
      x = bodyRect.left - bodyRect.left;
    }

    // Alignment by Y axis

    if (popup.alignmentY === Popup.ALIGNMENT_Y.OFF) {
      y += event.clientY;
    } else if (popup.alignmentY === Popup.ALIGNMENT_Y.CENTER) {
      y += relatedRect.top + relatedRect.height / 2 - popupRect.height / 2;
    } else if (popup.alignmentY === Popup.ALIGNMENT_Y.TOP) {
      y += relatedRect.top;
    } else if (popup.alignmentY === Popup.ALIGNMENT_Y.BOTTOM) {
      y += relatedRect.bottom;
    } else if (popup.alignmentY === Popup.ALIGNMENT_Y.ABOVE) {
      y += relatedRect.top - popupRect.height - PADDING;
    } else if (popup.alignmentY === Popup.ALIGNMENT_Y.BELOW) {
      y += relatedRect.bottom + PADDING;
    }

    const bottom = Math.min(POPUP_MAX_HEIGHT, bodyRect.bottom);
    if (y + popupRect.height > bottom) {
      y = bottom - popupRect.height;
    }
    if (y < bodyRect.top) {
      y = bodyRect.top;
    }

    // Correct coords and show

    popup.element.style.left = `${x - bodyRect.left}px`;
    popup.element.style.top = `${y - bodyRect.top}px`;
  }
}
