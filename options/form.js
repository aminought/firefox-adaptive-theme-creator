import { addNumberOptions, addStringOptions } from "./html.js";
import { Options } from "./options.js";

export class Form {
  static source = document.getElementById("source");
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
    addStringOptions("#source", Object.values(Options.SOURCES));
    addNumberOptions("#saturation_limit", 0.1, 1.0, 0.1);
    addNumberOptions("#darkness", 0.0, 5.0, 0.5);
    addNumberOptions("#brightness", 0.0, 5.0, 0.5);
    this.loadFromOptions();
    this.setupListeners();
  }

  loadFromOptions() {
    const globalOptions = this.options.getGlobalOptions();
    Form.source.value = globalOptions.source;
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
   * @param {Event} event
   */
  async reset(event) {
    event.preventDefault();
    await this.options.reset();
    this.loadFromOptions();
  }
}
