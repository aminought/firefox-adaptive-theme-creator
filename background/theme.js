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
      ([tab] = await browser.tabs.query({ active: true, currentWindow: true }));
    }

    const saturationLimit = this.options.getSaturationLimit();
    let tabBgColor = null;
    let tabFgColor = null;

    try {
      const mostPopularColor = await this.getMostPopularColor(tab.favIconUrl);
      if (mostPopularColor !== null) {
        tabBgColor = limitSaturation(mostPopularColor, saturationLimit);
        tabFgColor = calculateFgColor(tabBgColor);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      tabBgColor = this.getDefaultTabBackgroundColor();
      tabFgColor = this.getDefaultTabForegroundColor();
    } finally {
      const themeInfo = this.clone();
      if (tabBgColor !== null) {
        themeInfo.colors.tab_selected = tabBgColor.css();
      }
      if (tabFgColor !== null) {
        themeInfo.colors.tab_text = tabFgColor.css();
      }
      if (themeInfo.images) {
        await fixImages(themeInfo.images);
      }
      this.lastThemeInfo = themeInfo;
      browser.theme.update(themeInfo);
    }
  }

  async getMostPopularColor(favIconUrl) {
    let mostPopularColor = null;
    if (this.options.getCacheEnabled()) {
      mostPopularColor = this.cache.get(favIconUrl);
    }
    if (mostPopularColor === null) {
      mostPopularColor = await getMostPopularColor(favIconUrl);
      if (this.options.getCacheEnabled() && mostPopularColor !== null) {
        this.cache.set(favIconUrl, mostPopularColor);
      }
    }
    return mostPopularColor;
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
