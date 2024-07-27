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

  // eslint-disable-next-line max-lines-per-function
  async updateTheme(tab) {
    if (!this.defaultTheme.isCompatible()) {
      return;
    }

    if (!tab) {
      [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    }

    const saturationLimit = this.options.getGlobalSaturationLimit();
    const darken = this.options.getGlobalDarken();
    const brighten = this.options.getGlobalBrighten();

    const colors = Object.fromEntries(
      Options.getAllParts().map((part) => [
        part,
        this.defaultTheme.getColor(part),
      ])
    );

    try {
      const mostPopularColor = await this.getMostPopularColor(tab.favIconUrl);
      if (mostPopularColor !== null) {
        for (const backgroundPart of Options.getBackgroundParts()) {
          let customSaturationLimit = saturationLimit;
          let customDarken = darken;
          let customBrighten = brighten;
          if (this.options.isCustomEnabled(backgroundPart)) {
            customSaturationLimit =
              this.options.getCustomSaturationLimit(backgroundPart);
            customDarken = this.options.getCustomDarken(backgroundPart);
            customBrighten = this.options.getCustomBrighten(backgroundPart);
          }
          const backgroundColor = mostPopularColor
            .limitSaturation(customSaturationLimit)
            .darken(customDarken)
            .brighten(customBrighten);
          colors[backgroundPart] = backgroundColor;

          const foregroundParts = Options.getForegroundParts(backgroundPart);
          for (const foregroundPart of foregroundParts) {
            colors[foregroundPart] = backgroundColor.getForeground();
          }

          const connectedParts = Options.getConnectedParts(backgroundPart);
          for (const connectedPart of connectedParts) {
            colors[connectedPart] = backgroundColor;
          }
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      /* Empty */
    } finally {
      this.currentTheme = this.defaultTheme.clone();
      for (const backgroundPart of Options.getBackgroundParts()) {
        if (
          this.options.isEnabled(backgroundPart) &&
          colors[backgroundPart] !== null
        ) {
          this.currentTheme.setColor(backgroundPart, colors[backgroundPart]);
          const foregroundParts = Options.getForegroundParts(backgroundPart);
          for (const foregroundPart of foregroundParts) {
            this.currentTheme.setColor(foregroundPart, colors[foregroundPart]);
          }
          const connectedParts = Options.getConnectedParts(backgroundPart);
          for (const connectedPart of connectedParts) {
            this.currentTheme.setColor(connectedPart, colors[connectedPart]);
          }
        }
      }
      await this.currentTheme.fixImages();
      this.currentTheme.markModified();
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
      // mostPopularColor = await this.colorExtractor.getMostPopularColorFromFavicon(
      //   favIconUrl
      // );
      mostPopularColor = await this.colorExtractor.getMostPopularColorFromTab();
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
    if (!("favIconUrl" in changeInfo)) {
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
    if (!theme.isCompatible() || theme.isModified()) {
      return;
    }
    await this.defaultTheme.reload();
    await this.updateTheme();
  }
}
