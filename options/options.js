export class Options {
  static SOURCES = {
    FAVICON: "favicon",
    PAGE: "page",
  };

  static DEFAULT_SOURCE = this.SOURCES.FAVICON;
  static DEFAULT_SATURATION_LIMIT = "0.5";
  static DEFAULT_DARKNESS = "0.0";
  static DEFAULT_BRIGHTNESS = "0.0";
  static DEFAULT_COLOR_VALUE_OFFSET = 15;
  static DEFAULT_CACHE_ENABLED = true;
  static DEFAULT_PART_ENABLED = false;
  static DEFAULT_PART_CUSTOM_ENABLED = false;

  constructor() {
    this.options = Options.makeDefault();
  }

  static makeDefault() {
    const options = {
      source: this.DEFAULT_SOURCE,
      saturation_limit: this.DEFAULT_SATURATION_LIMIT,
      darkness: this.DEFAULT_DARKNESS,
      brightness: this.DEFAULT_BRIGHTNESS,
      color_value_offset: this.DEFAULT_COLOR_VALUE_OFFSET,
      cache_enabled: this.DEFAULT_CACHE_ENABLED,
    };
    Options.addPartOptions(options, "tab_selected", true);
    Options.addPartOptions(options, "sidebar");
    Options.addPartOptions(options, "toolbar");
    Options.addPartOptions(options, "toolbar_field");
    Options.addPartOptions(options, "frame");
    Options.addPartOptions(options, "popup");
    return options;
  }

  /**
   *
   * @param {object} options
   * @param {string} part
   * @param {boolean} enabled
   */
  static addPartOptions(options, part, enabled = this.DEFAULT_PART_ENABLED) {
    options[`${part}.enabled`] = enabled;
    options[`${part}.custom_enabled`] = this.DEFAULT_PART_CUSTOM_ENABLED;
    options[`${part}.source`] = this.DEFAULT_SOURCE;
    options[`${part}.saturation_limit`] = this.DEFAULT_SATURATION_LIMIT;
    options[`${part}.darkness`] = this.DEFAULT_DARKNESS;
    options[`${part}.brightness`] = this.DEFAULT_BRIGHTNESS;
  }

  static async load() {
    const storage = await browser.storage.sync.get();
    const options = new Options(storage);
    await options.reload();
    await options.save();
    return options;
  }

  async reload() {
    const storage = await browser.storage.sync.get();
    for (const key in storage) {
      if (key in this.options && storage[key] !== null) {
        this.options[key] = storage[key];
      }
    }
  }

  /**
   *
   * @param {object?} options
   */
  async save(options = null) {
    await browser.storage.sync.set(options || this.options).then(() => {
      browser.runtime.sendMessage({ event: "optionsUpdated" });
    });
  }

  async reset() {
    this.options = Options.makeDefault();
    await this.save();
  }

  getGlobalOptions() {
    return {
      source: this.options.source,
      saturationLimit: this.options.saturation_limit,
      darkness: this.options.darkness,
      brightness: this.options.brightness,
      cacheEnabled: this.options.cache_enabled,
      colorValueOffset: this.options.color_value_offset,
    };
  }

  /**
   *
   * @param {string} part
   */
  getPartOptions(part) {
    return {
      enabled: this.getPartOption(part, "enabled"),
      customEnabled: this.getPartOption(part, "custom_enabled"),
      source: this.getPartOption(part, "source"),
      saturationLimit: this.getPartOption(part, "saturation_limit"),
      darkness: this.getPartOption(part, "darkness"),
      brightness: this.getPartOption(part, "brightness"),
    };
  }

  /**
   *
   * @param {string} part
   * @param {string} part_key
   * @returns {any}
   */
  getPartOption(part, part_key) {
    return this.options[`${part}.${part_key}`];
  }

  /**
   *
   * @param {string} key
   * @param {any} value
   */
  async setGlobalOption(key, value) {
    this.options[key] = value;
    await this.save({ [key]: value });
  }

  /**
   *
   * @param {string} part
   * @param {string} key
   * @param {any} value
   */
  async setPartOption(part, key, value) {
    const part_key = `${part}.${key}`;
    this.options[part_key] = value;
    await this.save({ [part_key]: value });
  }
}
