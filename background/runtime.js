import { Cache } from "./cache.js";
import { ColorExtractor } from "../colors/color_extractor.js";
import { Options } from "../options/options.js";

export class Runtime {
  constructor(options, theme) {
    this.options = options;
    this.defaultTheme = theme;

    this.cache = new Cache();
    this.colorExtractor = new ColorExtractor(this.options);
    this.currentTheme = null;
  }

  async updateTheme(tab) {
    if (!this.defaultTheme.isCompatible()) {
      return;
    }

    if (!tab) {
      [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    }

    const saturationLimit = this.options.getGlobalSaturationLimit();
    const colors = Object.fromEntries(
      Options.PARTS.map((part) => [part, this.defaultTheme.getColor(part)])
    );

    try {
      const mostPopularColor = await this.getMostPopularColor(tab.favIconUrl);
      if (mostPopularColor !== null) {
        for (const part of Options.PARTS) {
          const color = mostPopularColor.limitSaturation(
            this.options.isCustomSaturationLimitEnabled(part)
              ? this.options.getCustomSaturationLimit(part)
              : saturationLimit
          );
          colors[part] = color;
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      /* Empty */
    } finally {
      this.currentTheme = this.defaultTheme.clone();
      for (const part of Options.PARTS) {
        if (this.options.isEnabled(part) && colors[part] !== null) {
          this.currentTheme.setColor(part, colors[part]);
        }
      }
      await this.currentTheme.fixImages();
      await this.currentTheme.update();
      browser.runtime.sendMessage({ event: "themeUpdated" });
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
