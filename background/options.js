const DEFAULT_SATURATION_LIMIT = 0.5;

// eslint-disable-next-line no-unused-vars
class Options {
  constructor() {
    this.options = null;
  }

  async load() {
    this.options = await browser.storage.sync.get();
  }

  getSaturationLimit() {
    return this.options.saturationLimit || DEFAULT_SATURATION_LIMIT;
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
}
