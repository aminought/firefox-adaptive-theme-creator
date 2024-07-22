import { Cache } from "./cache.js";
import { ColorExtractor } from "../colors/color_extractor.js";
import { Notifier } from "./notifier.js";

export class Runtime {
  constructor(options, theme) {
    this.options = options;
    this.defaultTheme = theme;

    this.cache = new Cache();
    this.colorExtractor = new ColorExtractor(this.options);
    this.currentTheme = null;

    if (!this.defaultTheme.isCompatible()) {
      Notifier.notifyNotCompatible();
    }
  }

  async updateTheme(tab) {
    if (!this.defaultTheme.isCompatible()) {
      return;
    }

    if (!tab) {
      [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    }

    const saturationLimit = this.options.getSaturationLimit();
    let tabBgColor = null;
    let tabFgColor = null;

    try {
      const mostPopularColor = await this.getMostPopularColor(tab.favIconUrl);
      if (mostPopularColor !== null) {
        tabBgColor = mostPopularColor.limitSaturation(saturationLimit);
        tabFgColor = tabBgColor.getForeground();
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      tabBgColor =
        this.options.getDefaultTabBackgroundColor() ||
        this.defaultTheme.getTabSelectedColor();
      tabFgColor =
        this.options.getDefaultTabForegroundColor() ||
        this.defaultTheme.getTabTextColor();
    } finally {
      this.currentTheme = this.defaultTheme.clone();
      if (tabBgColor !== null) {
        this.currentTheme.setTabSelectedColor(tabBgColor);
      }
      if (tabFgColor !== null) {
        this.currentTheme.setTabTextColor(tabFgColor);
      }
      await this.currentTheme.fixImages();
      this.currentTheme.update();
    }
  }

  async getMostPopularColor(favIconUrl) {
    let mostPopularColor = null;
    if (this.options.getCacheEnabled()) {
      mostPopularColor = this.cache.get(favIconUrl);
    }
    if (mostPopularColor === null) {
      mostPopularColor = await this.colorExtractor.getMostPopularColor(
        favIconUrl
      );
      if (this.options.getCacheEnabled() && mostPopularColor !== null) {
        this.cache.set(favIconUrl, mostPopularColor);
      }
    }
    return mostPopularColor;
  }

  async onTabActivated(tabId) {
    const tab = await browser.tabs.get(tabId);
    await this.updateTheme(tab);
  }

  async onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === "loading") {
      return;
    }
    if (tab.active) {
      await this.updateTheme(tab);
    }
  }

  async onOptionsUpdated() {
    await this.options.reload();
    this.cache.clear();
    await this.updateTheme();
  }

  async onMessage(message) {
    if (message.event === "optionsUpdated") {
      await this.onOptionsUpdated();
    }
  }

  async onThemeUpdated(theme) {
    if (this.currentTheme !== null && theme.isEqual(this.currentTheme)) {
      return;
    }
    await this.defaultTheme.reload();
    await this.updateTheme();
  }
}
