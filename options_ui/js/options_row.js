import { Div } from "./div.js";

export class OptionsRow extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["options_row", ...classList] });
  }
}
