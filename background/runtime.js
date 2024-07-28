import { BrowserParts } from "../options/browser_parts.js";
import { Cache } from "./cache.js";
// eslint-disable-next-line no-unused-vars
import { Color } from "../colors/color.js";
import { ColorExtractor } from "../colors/color_extractor.js";
import { Options } from "../options/options.js";

export class Runtime {
  /**
   *
   * @param {Options} options
   * @param {Theme} theme
   */
  constructor(options, theme) {
    this.options = options;
    this.defaultTheme = theme;

    this.cache = new Cache();
    this.colorExtractor = new ColorExtractor(this.options);
  }

  // eslint-disable-next-line
  async updateTheme(tab) {
    if (!this.defaultTheme.isCompatible()) {
      return;
    }

    if (!tab) {
      [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    }

    const colors = Object.fromEntries(
      BrowserParts.getAllParts().map((part) => [
        part,
        this.defaultTheme.getColor(part),
      ])
    );

    try {
      const faviconMostPopularColor = await this.getMostPopularColorFromFavicon(
        tab.favIconUrl
      );
      const pageMostPopularColor = await this.getMostPopularColorFromPage();

      for (const backgroundPart of BrowserParts.getBackgroundParts()) {
        let { source, saturationLimit, darkness, brightness } =
          this.options.getGlobalOptions();
        const partOptions = this.options.getPartOptions(backgroundPart);

        if (!partOptions.enabled) {
          continue;
        }

        if (partOptions.customEnabled) {
          ({ source, saturationLimit, darkness, brightness } = partOptions);
        }

        let mostPopularColor = null;
        if (source === Options.SOURCES.FAVICON) {
          mostPopularColor = faviconMostPopularColor;
        } else if (source === Options.SOURCES.PAGE) {
          mostPopularColor = pageMostPopularColor;
        }

        if (mostPopularColor === null) {
          continue;
        }

        const backgroundColor = mostPopularColor
          .limitSaturation(saturationLimit)
          .darken(darkness)
          .brighten(brightness);
        colors[backgroundPart] = backgroundColor;

        const connectedParts = BrowserParts.getConnectedParts(backgroundPart);
        for (const connectedPart of connectedParts) {
          colors[connectedPart] = backgroundColor;
        }

        const foregroundColor = backgroundColor.getForeground();
        const foregroundParts = BrowserParts.getForegroundParts(backgroundPart);
        for (const foregroundPart of foregroundParts) {
          colors[foregroundPart] = foregroundColor;
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      /* Empty */
    } finally {
      const theme = this.defaultTheme.clone();
      for (const part in colors) {
        theme.setColor(part, colors[part]);
      }
      await theme.fixImages();
      await theme.update();
      browser.runtime.sendMessage({ event: "themeUpdated" });
    }
  }

  /**
   *
   * @param {string} favIconUrl
   */
  async getMostPopularColorFromFavicon(favIconUrl) {
    return await this.colorExtractor.getMostPopularColorFromFavicon(favIconUrl);
  }

  /**
   *
   * @returns {Color?}
   */
  async getMostPopularColorFromPage() {
    return await this.colorExtractor.getMostPopularColorFromPage();
  }

  /**
   *
   * @param {number} tabId
   */
  async onTabActivated(tabId) {
    const tab = await browser.tabs.get(tabId);
    await this.updateTheme(tab);
  }

  /**
   *
   * @param {number} tabId
   * @param {object} changeInfo
   * @param {Tab} tab
   */
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

  /**
   *
   * @param {object} message
   */
  async onMessage(message) {
    if (message.event === "optionsUpdated") {
      await this.onOptionsUpdated();
    }
  }

  /**
   *
   * @param {Theme} theme
   * @returns
   */
  async onThemeUpdated(theme) {
    if (!theme.isCompatible() || theme.isModified()) {
      return;
    }
    await this.defaultTheme.reload();
    await this.updateTheme();
  }
}
