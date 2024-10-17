import {
  Div,
  Element,
  Label,
  Separator,
} from "../../../lib/elements/elements.js";

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

    this.label = new Label({
      classList: ["option_title"],
    }).setText(localize(id));
    this.separator = new Separator();
    this.appendChild(this.label);
    this.appendChild(this.separator);
  }

  /**
   *
   * @param {Element} inputElement
   * @returns {Option}
   */
  setInputElement(
    inputElement,
    {
      onChange = (value) => {
        this.options.set(this.id, value);
      },
      onReset = (element) => {
        element.setValue(this.options.get(this.id));
      },
    } = {}
  ) {
    inputElement.addOnChange(async (value) => {
      onChange(value);
      await this.options.save();
      new StatusBar(true).setText("options_saved").show();
    });
    this.options.registerResetCallback(() => onReset(inputElement));
    this.appendChild(inputElement);
    this.inputElement = inputElement;
    return this;
  }

  /**
   *
   * @param {function(any):void} callback
   * @returns {Option}
   */
  addOnChange(callback) {
    this.inputElement.addOnChange(callback);
    return this;
  }
}
