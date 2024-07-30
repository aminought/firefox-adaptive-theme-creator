import { addNumberOptions, addStringOptions } from "./utils/html.js";
import { ColorPicker } from "./color_picker.js";
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
    Form.source.value = globalOptions.source;
    Form.colorPreview.style.backgroundColor = globalOptions.color;
    Form.saturationLimit.value = globalOptions.saturationLimit;
    Form.darkness.value = globalOptions.darkness;
    Form.brightness.value = globalOptions.brightness;
    Form.faviconAvoidWhite.checked = globalOptions.favicon.avoidWhite;
    Form.faviconAvoidBlack.checked = globalOptions.favicon.avoidBlack;
    Form.pageCaptureHeight.value = globalOptions.page.captureHeight;
    Form.pageAvoidWhite.checked = globalOptions.page.avoidWhite;
    Form.pageAvoidBlack.checked = globalOptions.page.avoidBlack;
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
      Form.colorPreview.style.backgroundColor,
      (color) => {
        Form.colorPreview.style.backgroundColor = color.rgbaString;
        this.saveBackgroundColor(color, key);
      }
    );

    const body = document.querySelector("body");
    PopupController.push(colorPicker, body, event.clientX, event.clientY);
  }

  /**
   *
   * @param {Event} event
   * @param {string} key
   */
  async saveChecked(event, key) {
    await this.options.setGlobalOption(key, event.target.checked);
  }

  /**
   *
   * @param {Event} event
   * @param {string} key
   */
  async saveValue(event, key) {
    await this.options.setGlobalOption(key, event.target.value);
  }

  /**
   *
   * @param {object} color
   * @param {string} key
   */
  async saveBackgroundColor(color, key) {
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
}
