export class Options {
  static PARTS = [
    "tab_selected",
    "sidebar",
    "toolbar",
    "toolbar_field",
    "frame",
    "popup",
  ];

  constructor(storage) {
    this.reset();
    for (const key in storage) {
      if (key in this.options) {
        this.set(key, storage[key]);
      }
    }
  }

  static makeDefault() {
    const options = {
      saturation_limit: '0.5',
      darken: '0.0',
      brighten: '0.0',
      color_value_offset: 15,
      cache_enabled: true,
    };
    Options.addPartOptions(options, "tab_selected", true);
    Options.addPartOptions(options, "sidebar");
    Options.addPartOptions(options, "toolbar");
    Options.addPartOptions(options, "toolbar_field");
    Options.addPartOptions(options, "frame");
    Options.addPartOptions(options, "popup");
    return options;
  }

  static addPartOptions(
    options,
    part,
    enabled = false,
  ) {
    options[`${part}.enabled`] = enabled;
    options[`${part}.custom_enabled`] = false;
    options[`${part}.saturation_limit`] = null;
    options[`${part}.darken`] = null;
    options[`${part}.brighten`] = null;
  }

  static async load() {
    const storage = await browser.storage.sync.get();
    return new Options(storage);
  }

  async reload() {
    const storage = await browser.storage.sync.get();
    for (const key in storage) {
      if (key in this.options) {
        this.set(key, storage[key]);
      }
    }
  }

  async save() {
    await browser.storage.sync.set(this.options).then(() => {
      browser.runtime.sendMessage({ event: "optionsUpdated" });
    });
  }

  reset() {
    this.options = Options.makeDefault();
  }

  set(key, value) {
    this.options[key] = value;
  }

  get(key) {
    return this.options[key];
  }

  keys() {
    return Object.keys(this.options);
  }

  getGlobalSaturationLimit() {
    return this.options.saturation_limit;
  }

  getGlobalDarken() {
    return this.options.darken;
  }

  getGlobalBrighten() {
    return this.options.brighten;
  }

  getColorValueOffset() {
    return this.options.color_value_offset;
  }

  getCacheEnabled() {
    return this.options.cache_enabled;
  }

  isEnabled(part) {
    return this.options[`${part}.enabled`];
  }

  setEnabled(part, value) {
    this.options[`${part}.enabled`] = value;
  }

  toggleEnabled(part) {
    this.setEnabled(part, !this.isEnabled(part));
  }

  isCustomEnabled(part) {
    return this.options[`${part}.custom_enabled`];
  }

  setCustomEnabled(part, value) {
    this.options[`${part}.custom_enabled`] = value;
  }

  getCustomSaturationLimit(part) {
    return this.options[`${part}.saturation_limit`];
  }

  setCustomSaturationLimit(part, value) {
    this.options[`${part}.saturation_limit`] = value;
  }

  getCustomDarken(part) {
    return this.options[`${part}.darken`];
  }

  setCustomDarken(part, value) {
    this.options[`${part}.darken`] = value;
  }

  getCustomBrighten(part) {
    return this.options[`${part}.brighten`];
  }

  setCustomBrighten(part, value) {
    this.options[`${part}.brighten`] = value;
  }
}
