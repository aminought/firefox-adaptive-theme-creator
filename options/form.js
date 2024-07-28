import { addNumberOptions, addStringOptions } from "./html.js";
import { Options } from "./options.js";

export class Form {
  static source = document.getElementById("source");
  static saturationLimit = document.getElementById("saturation_limit");
  static darkness = document.getElementById("darkness");
  static brightness = document.getElementById("brightness");
  static cacheEnabled = document.getElementById("cache_enabled");
  static colorValueOffset = document.getElementById("color_value_offset");
  static pageCaptureHeight = document.getElementById("page_capture_height");
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
    Form.cacheEnabled.checked = globalOptions.cacheEnabled;
    Form.colorValueOffset.value = globalOptions.colorValueOffset;
    Form.pageCaptureHeight.value = globalOptions.pageCaptureHeight;
  }

  setupListeners() {
    Form.source.onchange = (e) => this.saveValue(e, "source");
    Form.saturationLimit.onchange = (e) =>
      this.saveValue(e, "saturation_limit");
    Form.darkness.onchange = (e) => this.saveValue(e, "darkness");
    Form.brightness.onchange = (e) => this.saveValue(e, "brightness");
    Form.cacheEnabled.onclick = (e) => this.saveChecked(e, "cache_enabled");
    Form.colorValueOffset.onchange = (e) =>
      this.saveValue(e, "color_value_offset");
    Form.pageCaptureHeight.onchange = (e) =>
      this.saveValue(e, "page_capture_height");

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
