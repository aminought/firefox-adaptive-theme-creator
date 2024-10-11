import { Div } from "../../../lib/elements/elements.js";

export class OptionsCol extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["options_col", ...classList] });
  }
}
