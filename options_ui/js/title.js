import { Label } from "./ui_elements/label.js";

export class Title extends Label {
  /**
   *
   * @param {string} text
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.for_
   */
  constructor(text, { id = null, classList = [], for_ = "" } = {}) {
    super(text, { id, classList: ["title", ...classList], for: for_ });
  }
}
