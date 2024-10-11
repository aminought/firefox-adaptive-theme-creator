import { Div } from "./div.js";
import { PopupController } from "../popup_controller.js";
import { UIElement } from "./ui_element.js";

export class Popup extends Div {
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
   *
   * @param {UIElement?} related
   * @param {string} alignmentX
   * @param {string} alignmentY
   * @param {string} orientation
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(
    related,
    alignmentX,
    alignmentY,
    orientation,
    { id = null, classList = [] } = {}
  ) {
    super({
      id,
      classList: ["popup", orientation.toLowerCase(), ...classList],
    });
    this.related = related;
    this.alignmentX = alignmentX;
    this.alignmentY = alignmentY;
    this.orientation = orientation;
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {Popup}
   */
  setOnVisualChange(callback) {
    this.onVisualChange = callback;
    return this;
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
  pop() {
    if (PopupController.peek() === this) {
      PopupController.pop();
      return true;
    }
    return false;
  }
}
