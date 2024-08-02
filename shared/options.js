import { BrowserParts } from "./browser_parts.js";

export class Options {
  static SOURCES = {
    FAVICON: "favicon",
    PAGE: "page",
    OWN_COLOR: "own_color",
  };

  static TRIGGERS = {
    TAB_COMPLETE: "trigger_tab_complete",
    FAVICON_DETECTED: "trigger_favicon_detected",
    TAB_OTHER_UPDATES: "trigger_tab_other_updates",
  };

  constructor() {
    this.options = Options.makeDefault();
  }

  static makeDefault() {
    const options = {
      source: this.SOURCES.PAGE,
      triggers: [
        this.TRIGGERS.TAB_COMPLETE,
        this.TRIGGERS.FAVICON_DETECTED,
        this.TRIGGERS.TAB_OTHER_UPDATES,
      ],
      color: "#ff80ed",
      saturation_limit: "1.0",
      darkness: "0.0",
      brightness: "0.0",
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
      BrowserParts.INHERITANCES.off,
      Options.SOURCES.FAVICON,
      "0.5"
    );
    Options.makePartOptions(options, "sidebar");
    Options.makePartOptions(
      options,
      "sidebar_border",
      true,
      BrowserParts.INHERITANCES.global
    );
    Options.makePartOptions(options, "toolbar");
    Options.makePartOptions(
      options,
      "toolbar_bottom_separator",
      true,
      "toolbar"
    );
    Options.makePartOptions(
      options,
      "toolbar_field",
      true,
      BrowserParts.INHERITANCES.off,
      Options.SOURCES.PAGE,
      "1.0",
      "0.0",
      "0.5"
    );
    Options.makePartOptions(
      options,
      "toolbar_field_border",
      true,
      "toolbar_field"
    );
    Options.makePartOptions(
      options,
      "toolbar_field_focus",
      true,
      "toolbar_field"
    );
    Options.makePartOptions(options, "frame");
    Options.makePartOptions(options, "frame_inactive", true, "frame");
    Options.makePartOptions(options, "popup");
    Options.makePartOptions(
      options,
      "popup_border",
      true,
      BrowserParts.INHERITANCES.off,
      Options.SOURCES.FAVICON,
      "0.5"
    );
    return options;
  }

  /**
   *
   * @param {object} options
   * @param {string} part
   * @param {boolean=} enabled
   * @param {string=} inheritance
   * @param {string=} source
   * @param {string=} saturationLimit
   */
  static makePartOptions(
    options,
    part,
    enabled = true,
    inheritance = BrowserParts.INHERITANCES.global,
    source = Options.SOURCES.PAGE,
    saturationLimit = "1.0",
    darkness = "0.0",
    brightness = "0.0"
  ) {
    options[`${part}.enabled`] = enabled;
    options[`${part}.inheritance`] = inheritance;
    options[`${part}.source`] = source;
    options[`${part}.color`] = "#f0f";
    options[`${part}.saturation_limit`] = saturationLimit;
    options[`${part}.darkness`] = darkness;
    options[`${part}.brightness`] = brightness;
  }

  static async load() {
    const storage = await browser.storage.local.get();
    const options = new Options(storage);
    await options.reload();
    await options.save();
    return options;
  }

  async reload() {
    const storage = await browser.storage.local.get();
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
    await browser.storage.local.set(options || this.options);
  }

  async reset() {
    this.options = Options.makeDefault();
    await this.save();
  }

  getGlobalOptions() {
    return {
      source: this.options.source,
      color: this.options.color,
      triggers: new Set(this.options.triggers),
      saturationLimit: this.options.saturation_limit,
      darkness: this.options.darkness,
      brightness: this.options.brightness,
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
   * @param {string} key
   * @returns {any}
   */
  getGlobalOption(key) {
    return this.options[key];
  }

  /**
   *
   * @param {string} key
   * @returns {Set}
   */
  getGlobalOptionAsSet(key) {
    return new Set(this.options[key]);
  }

  /**
   *
   * @param {string} part
   */
  getPartOptions(part) {
    return {
      enabled: this.getPartOption(part, "enabled"),
      inheritance: this.getPartOption(part, "inheritance"),
      source: this.getPartOption(part, "source"),
      color: this.getPartOption(part, "color"),
      saturationLimit: this.getPartOption(part, "saturation_limit"),
      darkness: this.getPartOption(part, "darkness"),
      brightness: this.getPartOption(part, "brightness"),
    };
  }

  /**
   *
   * @param {string} part
   * @param {string} partKey
   * @returns {any}
   */
  getPartOption(part, partKey) {
    return this.options[`${part}.${partKey}`];
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
   * @param {string} partKey
   * @param {any} value
   */
  async setPartOption(part, partKey, value) {
    const part_key = `${part}.${partKey}`;
    this.options[part_key] = value;
    await this.save({ [part_key]: value });
  }

  /**
   *
   * @param {string} source
   * @returns {boolean}
   */
  isSourceNeeded(source) {
    const enabledKey = "enabled";
    const inheritanceKey = "inheritance";
    const sourceKey = "source";
    if (this.options[sourceKey] === source) {
      return true;
    }
    const parts = BrowserParts.getBackgroundParts().concat(
      BrowserParts.getConnectedParts()
    );
    for (const part of parts) {
      const partEnabled = this.getPartOption(part, enabledKey);
      const partInheritance = this.getPartOption(part, inheritanceKey);
      const partSource = this.getPartOption(part, sourceKey);
      if (
        partEnabled &&
        partInheritance === BrowserParts.INHERITANCES.off &&
        partSource === source
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @returns {boolean}
   */
  isPageColorNeeded() {
    return this.isSourceNeeded(Options.SOURCES.PAGE);
  }

  /**
   *
   * @returns {boolean}
   */
  isFaviconColorNeeded() {
    return this.isSourceNeeded(Options.SOURCES.FAVICON);
  }
}
