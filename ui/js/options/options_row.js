import { Div } from "../../../lib/elements/elements.js";

export class OptionsRow extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["options_row", ...classList] });
  }
}
