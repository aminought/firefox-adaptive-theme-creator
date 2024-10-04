import { Part } from "./part.js";

export class Placeholder extends Part {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["placeholder", ...classList] });
  }
}
