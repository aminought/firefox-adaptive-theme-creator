import { Label } from "../../../lib/elements/elements.js";

export class Title extends Label {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["title", ...classList] });
  }
}
