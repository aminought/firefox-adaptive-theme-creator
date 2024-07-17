// eslint-disable-next-line no-unused-vars
class Theme {
  constructor(options, cache) {
    this.options = options;
    this.cache = cache;
    this.defaultThemeInfo = null;
    this.lastThemeInfo = null;
  }

  async loadTheme(themeInfo) {
    if (typeof themeInfo === "undefined") {
      themeInfo = await browser.theme.getCurrent();
    }
    if (themeInfo.colors === null) {
      notifyNotCompatible();
      return;
    }
    this.defaultThemeInfo = themeInfo;
  }

  async update(tab) {
    if (this.defaultThemeInfo === null) {
      return;
    }

    if (!tab) {
      tab = await browser.tabs.query({ active: true, currentWindow: true })[0];
    }

    const saturationLimit = this.options.getSaturationLimit();
    let tabBgColor = this.getDefaultTabBackgroundColor();
    let tabFgColor = this.getDefaultTabForegroundColor();

    try {
      let mostPopularColor = this.cache.get(tab.favIconUrl);
      if (typeof mostPopularColor === "undefined") {
        mostPopularColor = await getMostPopularColor(tab.favIconUrl);
        this.cache.set(tab.favIconUrl, mostPopularColor);
      }
      if (mostPopularColor) {
        tabBgColor = limitSaturation(mostPopularColor, saturationLimit);
        tabFgColor = calculateFgColor(tabBgColor);
      }
    } finally {
      const themeInfo = this.clone();
      themeInfo.colors.tab_selected = tabBgColor ? tabBgColor.css() : null;
      themeInfo.colors.tab_text = tabFgColor ? tabFgColor.css() : null;
      if (themeInfo.images) {
        await fixImages(themeInfo.images);
      }
      this.lastThemeInfo = themeInfo;
      browser.theme.update(themeInfo);
    }
  }

  clone() {
    return JSON.parse(JSON.stringify(this.defaultThemeInfo));
  }

  isEqual(themeInfo) {
    return JSON.stringify(themeInfo) === JSON.stringify(this.lastThemeInfo);
  }

  isLastThemeInfoEmpty() {
    return this.lastThemeInfo === null;
  }

  getDefaultTabBackgroundColor() {
    return (
      this.options.getDefaultTabBackgroundColor() ||
      (this.defaultThemeInfo.colors.tab_selected
        ? chroma(this.defaultThemeInfo.colors.tab_selected)
        : null)
    );
  }

  getDefaultTabForegroundColor() {
    return (
      this.options.getDefaultTabForegroundColor() ||
      (this.defaultThemeInfo.colors.tab_text
        ? chroma(this.defaultThemeInfo.colors.tab_text)
        : null)
    );
  }
}
