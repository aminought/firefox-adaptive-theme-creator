import { Element } from "./element.js";

export class Img extends Element {
  /**
   *
   * @param {string} src
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(src, { id = null, classList = [] } = {}) {
    super("img", { id, classList });
    this.html.src = src;
  }
}
