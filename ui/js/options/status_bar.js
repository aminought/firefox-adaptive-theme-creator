import { Div, Label, Popup } from "../../../lib/elements/elements.js";

import { Localizer } from "../utils/localizer.js";

const ID = "status_bar";
const TIMEOUT = 3000;

export class StatusBar extends Div {
  /**
   *
   * @param {object} params
   * @param {Array<string>} params.classList
   */
  constructor(autoHide = false, { classList = [] } = {}) {
    super({ id: ID, classList });
    this.label = new Label();
    this.appendChild(this.label);

    this.popup = new Popup(this, { timeout: autoHide ? TIMEOUT : null });
  }

  /**
   *
   * @param {string} key
   * @param {function(string):string} localize
   * @returns
   */
  setText(key, localize = Localizer.localizeStatusBar) {
    this.label.setText(localize(key));
    return this;
  }

  /**
   *
   * @returns {StatusBar}
   */
  show() {
    this.popup.show();
    return this;
  }

  /**
   *
   * @returns {StatusBar}
   */
  hide() {
    this.popup.hide();
    return this;
  }
}
