import { addNumberOptions, addStringOptions } from "./utils/html.js";
import { ColorPicker } from "./color_picker.js";
import { HelpPopup } from "./help_popup.js";
import { Options } from "../../shared/options.js";
import { PopupController } from "./popup_controller.js";

export class Form {
  static body = document.querySelector("body");
  static source = document.getElementById("source");
  static color = document.getElementById("color");
  static colorPreview = document.getElementById("color_preview");
  static saturationLimit = document.getElementById("saturation_limit");
  static darkness = document.getElementById("darkness");
  static brightness = document.getElementById("brightness");
  static faviconAvoidWhite = document.getElementById("favicon_avoid_white");
  static faviconAvoidBlack = document.getElementById("favicon_avoid_black");
  static pageCaptureHeight = document.getElementById("page_capture_height");
  static pageAvoidWhite = document.getElementById("page_avoid_white");
  static pageAvoidBlack = document.getElementById("page_avoid_black");
  static helpButton = document.getElementById("help_button");
  static resetButton = document.getElementById("reset_button");

  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
    addStringOptions(Form.source, Object.values(Options.SOURCES));
    addNumberOptions(Form.saturationLimit, 0.1, 1.0, 0.1);
    addNumberOptions(Form.darkness, 0.0, 5.0, 0.5);
    addNumberOptions(Form.brightness, 0.0, 5.0, 0.5);
    this.loadFromOptions();
    this.setupListeners();
  }

  loadFromOptions() {
    const globalOptions = this.options.getGlobalOptions();
    Form.loadValueOption(Form.source, globalOptions.source);
    Form.loadBackgroundColorOption(Form.colorPreview, globalOptions.color);
    Form.loadValueOption(Form.saturationLimit, globalOptions.saturationLimit);
    Form.loadValueOption(Form.darkness, globalOptions.darkness);
    Form.loadValueOption(Form.brightness, globalOptions.brightness);
    Form.loadCheckedOption(
      Form.faviconAvoidWhite,
      globalOptions.favicon.avoidWhite
    );
    Form.loadCheckedOption(
      Form.faviconAvoidBlack,
      globalOptions.favicon.avoidBlack
    );
    Form.loadValueOption(
      Form.pageCaptureHeight,
      globalOptions.page.captureHeight
    );
    Form.loadCheckedOption(Form.pageAvoidWhite, globalOptions.page.avoidWhite);
    Form.loadCheckedOption(Form.pageAvoidBlack, globalOptions.page.avoidBlack);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {any} value
   */
  static loadValueOption(element, value) {
    element.value = value;
    element.setAttribute("data-value", value);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {any} value
   */
  static loadCheckedOption(element, value) {
    element.checked = value;
    element.setAttribute("data-value", value);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {any} value
   */
  static loadBackgroundColorOption(element, value) {
    element.style.backgroundColor = value;
    element.setAttribute("data-value", value);
  }

  setupListeners() {
    Form.source.onchange = (e) => this.saveValue(e, "source");
    Form.colorPreview.onclick = (e) => this.showColorPicker(e, "color");
    Form.saturationLimit.onchange = (e) =>
      this.saveValue(e, "saturation_limit");
    Form.darkness.onchange = (e) => this.saveValue(e, "darkness");
    Form.brightness.onchange = (e) => this.saveValue(e, "brightness");
    Form.faviconAvoidWhite.onchange = (e) =>
      this.saveChecked(e, "favicon.avoid_white");
    Form.faviconAvoidBlack.onchange = (e) =>
      this.saveChecked(e, "favicon.avoid_black");
    Form.pageCaptureHeight.onchange = (e) =>
      this.saveValue(e, "page.capture_height");
    Form.pageAvoidWhite.onchange = (e) =>
      this.saveChecked(e, "page.avoid_white");
    Form.pageAvoidBlack.onchange = (e) =>
      this.saveChecked(e, "page.avoid_black");

    Form.resetButton.onclick = (e) => this.reset(e);
    Form.helpButton.onclick = (e) => Form.showHelp(e);
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {string} key
   */
  showColorPicker(event, key) {
    event.stopPropagation();
    PopupController.popFor(event.target);
    const colorPicker = new ColorPicker(
      Form.body,
      Form.colorPreview.style.backgroundColor,
      (color) => this.saveBackgroundColor(Form.colorPreview, color, key)
    );

    PopupController.push(colorPicker, event.clientX, event.clientY);
  }

  /**
   *
   * @param {Event} event
   * @param {string} key
   */
  async saveChecked(event, key) {
    event.target.setAttribute("data-value", event.target.value);
    await this.options.setGlobalOption(key, event.target.checked);
  }

  /**
   *
   * @param {Event} event
   * @param {string} key
   */
  async saveValue(event, key) {
    event.target.setAttribute("data-value", event.target.value);
    await this.options.setGlobalOption(key, event.target.value);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {Event} color
   * @param {string} key
   */
  async saveBackgroundColor(element, color, key) {
    element.style.backgroundColor = color.rgbaString;
    element.setAttribute("data-value", color.rgbaString);
    await this.options.setGlobalOption(key, color.rgbaString);
  }

  /**
   *
   * @param {Event} event
   */
  async reset(event) {
    event.preventDefault();
    await this.options.reset();
    this.loadFromOptions();
  }

  /**
   *
   * @param {MouseEvent} event
   */
  static showHelp(event) {
    event.stopPropagation();
    PopupController.clear();
    const helpPopup = new HelpPopup(this.body);
    PopupController.push(helpPopup, event.target);
  }
}
