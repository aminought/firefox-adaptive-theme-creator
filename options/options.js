// eslint-disable-next-line no-unused-vars
class Options {
  constructor() {
    this.init();
  }

  init() {
    this.options = new Map([
      ["saturationLimit", 0.5],
      ["changeDefaultTabColors", false],
      ["defaultTabBgColor", "#d7d7db"],
      ["defaultTabFgColor", "#4a4a4f"],
      ["cacheEnabled", true],
    ]);
  }

  async load() {
    const storage = await browser.storage.sync.get();
    for (const key of this.keys()) {
      this.copy(storage, key);
    }
  }

  async save() {
    await browser.storage.sync
      .set(Object.fromEntries(this.options))
      .then(() => {
        browser.runtime.sendMessage({ event: "optionsUpdated" });
      });
  }

  copy(storage, key) {
    if (key in storage) {
      this.options[key] = storage[key];
    }
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
    return this.options.saturationLimit;
  }

  isChangeDefaultTabColorsEnabled() {
    return this.options.changeDefaultTabColors;
  }

  getDefaultTabBackgroundColor() {
    return this.isChangeDefaultTabColorsEnabled()
      ? chroma(this.options.defaultTabBgColor)
      : null;
  }

  getDefaultTabForegroundColor() {
    return this.isChangeDefaultTabColorsEnabled()
      ? chroma(this.options.defaultTabFgColor)
      : null;
  }

  getCacheEnabled() {
    return this.options.cacheEnabled;
  }
}
