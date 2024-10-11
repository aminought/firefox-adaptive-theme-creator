import { Div, Input, Label, Separator } from "../../../lib/elements/elements.js";

import { Localizer } from "../utils/localizer.js";
import { Options } from "../../../shared/options.js";
import { StatusBar } from "./status_bar.js";

export class Option extends Div {
  /**
   *
   * @param {string} id
   * @param {Options} options
   * @param {object} params
   * @param {Array<string>} params.classList
   */
  constructor(
    id,
    options,
    { classList = [], localize = Localizer.localizeOption } = {}
  ) {
    super({ id, classList: ["option", ...classList] });
    this.options = options;
    this.label = new Label(localize(id), {
      classList: ["option_title"],
    });
    this.separator = new Separator();
    this.setOnChange((value) => {
      this.options.set(id, value);
    });
    this.setOnReset((child) => {
      const value = this.options.get(this.id);
      child.setValue(value);
    });
  }

  /**
   *
   * @param {Input} child
   * @returns {Option}
   */
  appendChild(child) {
    child.onChange = this.onChange;
    this.options.registerResetCallback(() => this.onReset(child));
    return Input.prototype.appendChild.call(this, child);
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {Option}
   */
  setOnChange(callback) {
    this.onChange = async (value) => {
      callback(value);
      await this.options.save();
      new StatusBar("options_saved").show();
    };
    for (const child of this.children) {
      child.onChange = this.onChange;
    }
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {Option}
   */
  setOnReset(callback) {
    this.onReset = callback;
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.appendChild(this.label.draw());
    this.element.appendChild(this.separator.draw());

    for (const child of this.children) {
      this.element.appendChild(child.draw());
    }
    return this.element;
  }
}
