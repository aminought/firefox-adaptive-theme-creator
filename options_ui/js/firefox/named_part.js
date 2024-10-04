import { Part } from "./part.js";

export class NamedPart extends Part {
  /**
   *
   * @param {string} id
   */
  constructor(id) {
    super({ id });
  }
}
