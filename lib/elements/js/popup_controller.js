import { Popup } from "./mutators/popup.js";

const POPUP_MAX_HEIGHT = 600;
const FIRST_Z_INDEX = 100;
const PADDING = 4;

class PopupInfo {
  /**
   *
   * @param {Popup} popup
   * @param {MouseEvent} event
   */
  constructor(popup, event) {
    this.popup = popup;
    this.event = event;
  }
}

export class PopupController {
  static body = document.querySelector("body");
  /**@type {Array<PopupInfo>} */
  static stack = [];
  /**@type {Map<string, Popup>} */
  static fixed = {};

  /**
   *
   * @param {Popup} popup
   * @param {MouseEvent} event
   */
  static push(popup, event) {
    popup.element.style.zIndex = FIRST_Z_INDEX + PopupController.stack.length;
    const popupInfo = new PopupInfo(popup, event);
    PopupController.body.appendChild(popup.element.draw());
    PopupController.stack.push(popupInfo);
    PopupController.position(popupInfo);
  }

  static pop() {
    if (PopupController.empty()) {
      return;
    }
    const popup = PopupController.stack.pop().popup;
    popup.element.remove();
  }

  /**
   *
   * @param {MouseEvent} event
   */
  static popFor(event) {
    while (!PopupController.empty()) {
      const popup = PopupController.peek().popup;
      const popupRect = popup.element.getBoundingClientRect();
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
   * @returns {PopupInfo?}
   */
  static peek() {
    if (PopupController.empty()) {
      return null;
    }
    return PopupController.stack[PopupController.stack.length - 1];
  }

  /**
   *
   * @param {Popup} popup
   * @returns {PopupInfo?}
   */
  static find(popup) {
    return (
      PopupController.stack.find((popupInfo) => popupInfo.popup === popup) ??
      null
    );
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
   * @param {PopupInfo} popupInfo
   */
  static position(popupInfo) {
    const { popup, event } = popupInfo;

    const popupRect = popup.element.getBoundingClientRect();
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

  /**
   *
   * @param {Popup} popup
   */
  static show(popup) {
    const element = popup.element;
    if (element.id in PopupController.fixed) {
      PopupController.fixed[element.id].element.remove();
    }
    PopupController.fixed[element.id] = popup;
    PopupController.body.appendChild(element.draw());
  }

  /**
   *
   * @param {Popup} popup
   */
  static hide(popup) {
    const id = popup.element.id;
    if (id in PopupController.fixed) {
      PopupController.fixed[id].element.remove();
    }
  }
}
