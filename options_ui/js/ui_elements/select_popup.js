import { Div } from "./div.js";

export const ORIENTATION = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
};

export class SelectPopup extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.orientation
   */
  constructor({
    id = null,
    classList = [],
    orientation = ORIENTATION.HORIZONTAL,
  } = {}) {
    super({
      id,
      classList: ["select_popup", orientation.toLowerCase(), ...classList],
    });
  }
}
