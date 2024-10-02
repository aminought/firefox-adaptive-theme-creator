import { Div } from "./ui_elements/div.js";

export class OptionsCol extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["options_col", ...classList] });
  }
}
