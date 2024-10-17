import { Element } from "../element.js";
import { PopupController } from "../popup_controller.js";

export class Popup {
  static ALIGNMENT_X = {
    OFF: "OFF",
    CENTER: "CENTER",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    LEFT_SIDE: "LEFT_SIDE",
    RIGHT_SIDE: "RIGHT_SIDE",
  };
  static ALIGNMENT_Y = {
    OFF: "OFF",
    CENTER: "CENTER",
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    ABOVE: "ABOVE",
    BELOW: "BELOW",
  };
  static ORIENTATION = {
    HORIZONTAL: "HORIZONTAL",
    VERTICAL: "VERTICAL",
  };

  /**
   * @param {Element} element
   * @param {object} params
   * @param {string} params.alignmentX
   * @param {string} params.alignmentY
   * @param {string} params.orientation
   * @param {Element?} params.related
   * @param {number?} params.timeout
   */
  constructor(
    element,
    {
      alignmentX = Popup.ALIGNMENT_X.OFF,
      alignmentY = Popup.ALIGNMENT_Y.OFF,
      orientation = Popup.ORIENTATION.HORIZONTAL,
      related = null,
      timeout = null,
    } = {}
  ) {
    this.element = element;
    this.alignmentX = alignmentX;
    this.alignmentY = alignmentY;
    this.orientation = orientation;
    this.related = related;
    this.timeout = timeout;

    this.element.addClass("popup").addClass(orientation.toLowerCase());
  }

  /**
   *
   * @param {MouseEvent} event
   */
  push(event) {
    if (!this.pop()) {
      PopupController.popFor(event);
      PopupController.push(this, event);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  reposition() {
    const popupInfo = PopupController.find(this);
    if (popupInfo !== null) {
      PopupController.position(popupInfo);
      return true;
    }
    return false;
  }

  /**
   *
   * @returns {boolean}
   */
  pop() {
    if (PopupController.peek()?.popup === this) {
      PopupController.pop();
      return true;
    }
    return false;
  }

  show() {
    if (this.timeout !== null) {
      setTimeout(() => {
        this.element.remove();
      }, this.timeout);
    }

    PopupController.show(this);
  }

  hide() {
    PopupController.hide(this);
  }
}
