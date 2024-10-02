import { Div } from "./ui_elements/div.js";

export class Footer extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["footer", ...classList] });
  }
}
