import { Div } from "./div.js";
import { Popup } from "./mutators/popup.js";

export class SelectPopup extends Div {
  /**
   *
   * @param {Element} related
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.alignmentX
   * @param {string} params.alignmentY
   * @param {string} params.orientation
   */
  constructor(
    related,
    {
      id = null,
      classList = [],
      alignmentX = Popup.ALIGNMENT_X.CENTER,
      alignmentY = Popup.ALIGNMENT_Y.BELOW,
      orientation = Popup.ORIENTATION.HORIZONTAL,
    } = {}
  ) {
    super({ id, classList: ["select_popup", ...classList] });
    this.popup = new Popup(this, {
      alignmentX,
      alignmentY,
      orientation,
      related,
    });
  }
}
