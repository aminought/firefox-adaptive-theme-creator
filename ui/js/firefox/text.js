import { Div } from "../../../lib/elements/elements.js";

export class Text extends Div {
  /**
   *
   * @param {string} id
   */
  constructor(id = null) {
    super({ id, classList: ["text"] });
  }
}
