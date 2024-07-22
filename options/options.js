import { Color } from "../colors/color.js";

export class Options {
  DEFAULT_OPTIONS = new Map([
    ["saturationLimit", 0.5],
    ["changeDefaultTabColors", false],
    ["defaultTabBgColor", "#d7d7db"],
    ["defaultTabFgColor", "#4a4a4f"],
    ["colorValueOffset", 15],
    ["cacheEnabled", true],
  ]);

  constructor(storage) {
    this.reset();
    for (const key in storage) {
      if (this.options.has(key)) {
        this.set(key, storage[key]);
      }
    }
  }

  static async load() {
    const storage = await browser.storage.sync.get();
    return new Options(storage);
  }

  async reload() {
    const storage = await browser.storage.sync.get();
    for (const key in storage) {
      if (this.options.has(key)) {
        this.set(key, storage[key]);
      }
    }
  }

  async save() {
    await browser.storage.sync
      .set(Object.fromEntries(this.options))
      .then(() => {
        browser.runtime.sendMessage({ event: "optionsUpdated" });
      });
  }

  reset() {
    this.options = new Map(this.DEFAULT_OPTIONS);
  }

  set(key, value) {
    this.options.set(key, value);
  }

  get(key) {
    return this.options.get(key);
  }

  keys() {
    return this.options.keys();
  }

  getSaturationLimit() {
    return this.options.get("saturationLimit");
  }

  isChangeDefaultTabColorsEnabled() {
    return this.options.get("changeDefaultTabColors");
  }

  getDefaultTabBackgroundColor() {
    return this.isChangeDefaultTabColorsEnabled()
      ? new Color(this.options.get("defaultTabBgColor"))
      : null;
  }

  getDefaultTabForegroundColor() {
    return this.isChangeDefaultTabColorsEnabled()
      ? new Color(this.options.get("defaultTabFgColor"))
      : null;
  }

  getColorValueOffset() {
    return this.options.get("colorValueOffset");
  }

  getCacheEnabled() {
    return this.options.get("cacheEnabled");
  }
}
