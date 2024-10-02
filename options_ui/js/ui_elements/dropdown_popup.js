import { Div } from "./div.js";

export class DropdownPopup extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["dropdown_popup", ...classList] });
  }
}
