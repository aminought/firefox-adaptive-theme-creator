export class Options {
  static SOURCES = {
    FAVICON: "favicon",
    PAGE: "page",
  };

  constructor() {
    this.options = Options.makeDefault();
  }

  static makeDefault() {
    const options = {
      source: this.SOURCES.PAGE,
      saturation_limit: "1.0",
      darkness: "0.0",
      brightness: "0.0",
      cache_enabled: true,
      "favicon.avoid_white": true,
      "favicon.avoid_black": true,
      "page.capture_height": "1",
      "page.avoid_white": false,
      "page.avoid_black": false,
    };
    Options.makePartOptions(
      options,
      "tab_selected",
      true,
      true,
      Options.SOURCES.FAVICON,
      "0.5"
    );
    Options.makePartOptions(options, "sidebar");
    Options.makePartOptions(options, "toolbar");
    Options.makePartOptions(options, "toolbar_field");
    Options.makePartOptions(options, "frame");
    Options.makePartOptions(options, "popup");
    return options;
  }

  /**
   *
   * @param {object} options
   * @param {string} part
   * @param {boolean=} enabled
   * @param {boolean=} customEnabled
   * @param {string=} source
   * @param {string=} saturationLimit
   */
  static makePartOptions(
    options,
    part,
    enabled = true,
    customEnabled = false,
    source = Options.SOURCES.PAGE,
    saturationLimit = "1.0"
  ) {
    options[`${part}.enabled`] = enabled;
    options[`${part}.custom_enabled`] = customEnabled;
    options[`${part}.source`] = source;
    options[`${part}.saturation_limit`] = saturationLimit;
    options[`${part}.darkness`] = "0.0";
    options[`${part}.brightness`] = "0.0";
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
   * @param {object=} options
   */
  async save(options) {
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
      favicon: {
        avoidWhite: this.options["favicon.avoid_white"],
        avoidBlack: this.options["favicon.avoid_black"],
      },
      page: {
        captureHeight: this.options["page.capture_height"],
        avoidWhite: this.options["page.avoid_white"],
        avoidBlack: this.options["page.avoid_black"],
      },
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
