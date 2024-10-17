import { Div } from "./div.js";
import { Element } from "./element.js";
import { Popup } from "./mutators/popup.js";

export class DropdownPopup extends Div {
  /**
   *
   * @param {Element} related
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(related, { id = null, classList = [] } = {}) {
    super({ id, classList: ["dropdown_popup", ...classList] });
    this.popup = new Popup(this, {
      alignmentX: Popup.ALIGNMENT_X.CENTER,
      alignmentY: Popup.ALIGNMENT_Y.BELOW,
      orientation: Popup.ORIENTATION.VERTICAL,
      related,
    });
  }
}
