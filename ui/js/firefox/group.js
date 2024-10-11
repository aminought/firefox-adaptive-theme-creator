import { Part } from "./part.js";

export class Group extends Part {
  /**
   *
   * @param {string} id
   */
  constructor(id) {
    super({ id, classList: ["group"] });
  }
}
