import { Div } from "./div.js";
import { PopupController } from "../popup_controller.js";

export class FixedPopup extends Div {
  /**
   *
   * @param {number?} timeout
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(timeout, { id = null, classList = [] } = {}) {
    super({
      id,
      classList: ["fixed_popup", ...classList],
    });
    this.timeout = timeout;
  }

  show() {
    if (this.timeout !== null) {
      setTimeout(() => {
        this.remove();
      }, this.timeout);
    }

    PopupController.showFixed(this);
  }

  /**
   *
   * @param {string} id
   */
  static unshow(id) {
    PopupController.removeFixed(id);
  }
}
