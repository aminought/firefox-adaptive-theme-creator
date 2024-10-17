import { Element } from "./element.js";

export class Div extends Element {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super("div", { id, classList });
  }
}
