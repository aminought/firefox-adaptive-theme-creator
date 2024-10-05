import { Div } from "../ui_elements/div.js";

export class Text extends Div {
  /**
   *
   * @param {string} id
   */
  constructor(id = null) {
    super({ id, classList: ["text"] });
  }
}
