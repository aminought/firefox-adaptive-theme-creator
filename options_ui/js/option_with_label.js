import { Div } from "./ui_elements/div.js";
import { Input } from "./ui_elements/input.js";
import { Label } from "./ui_elements/label.js";
import { Localizer } from "./utils/localizer.js";
import { Options } from "../../shared/options.js";
import { PopupController } from "./popup_controller.js";
import { Separator } from "./ui_elements/separator.js";
import { StatusBar } from "./status_bar.js";

export class OptionWithLabel extends Div {
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
   * @returns {OptionWithLabel}
   */
  appendChild(child) {
    child.onChange = this.onChange;
    this.options.registerResetCallback(() => this.onReset(child));
    return Input.prototype.appendChild.call(this, child);
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {OptionWithLabel}
   */
  setOnChange(callback) {
    this.onChange = async (value) => {
      callback(value);
      await this.options.save();
      PopupController.showFixed(new StatusBar("options_saved"));
    };
    for (const child of this.children) {
      child.onChange = this.onChange;
    }
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   * @returns {OptionWithLabel}
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
