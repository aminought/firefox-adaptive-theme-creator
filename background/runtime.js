import { BrowserParts } from "../options/browser_parts.js";
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

    this.colorExtractor = new ColorExtractor(this.options);
  }

  /**
   *
   * @param {Color} faviconMostPopularColor
   * @param {Color} pageMostPopularColor
   * @param {string} source
   * @param {number} saturationLimit
   * @param {number} darkness
   * @param {number} brightness
   * @returns {Color}
   */
  static computeColor(
    faviconMostPopularColor,
    pageMostPopularColor,
    source,
    saturationLimit,
    darkness,
    brightness
  ) {
    let mostPopularColor = null;
    if (source === Options.SOURCES.FAVICON) {
      mostPopularColor = faviconMostPopularColor;
    } else if (source === Options.SOURCES.PAGE) {
      mostPopularColor = pageMostPopularColor;
    }

    return mostPopularColor
      .limitSaturation(saturationLimit)
      .darken(darkness)
      .brighten(brightness);
  }

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
      const globalOptions = this.options.getGlobalOptions();

      const faviconMostPopularColor = await this.getMostPopularColorFromFavicon(
        tab.favIconUrl
      );
      const pageMostPopularColor = await this.getMostPopularColorFromPage(tab);

      if (faviconMostPopularColor === null || pageMostPopularColor === null) {
        return;
      }

      // Global colors
      const globalBackgroundColor = Runtime.computeColor(
        faviconMostPopularColor,
        pageMostPopularColor,
        globalOptions.source,
        globalOptions.saturationLimit,
        globalOptions.darkness,
        globalOptions.brightness
      );
      const globalForegroundColor = globalBackgroundColor.getForeground();

      // Background parts
      for (const backgroundPart of BrowserParts.getBackgroundParts()) {
        const partOptions = this.options.getPartOptions(backgroundPart);

        if (!partOptions.enabled) {
          continue;
        }

        // Part background color
        let partBackgroundColor = globalBackgroundColor;
        let partForegroundColor = globalForegroundColor;
        if (partOptions.inheritance === BrowserParts.INHERITANCES.off) {
          partBackgroundColor = Runtime.computeColor(
            faviconMostPopularColor,
            pageMostPopularColor,
            partOptions.source,
            partOptions.saturationLimit,
            partOptions.darkness,
            partOptions.brightness
          );
          partForegroundColor = partBackgroundColor.getForeground();
        }
        colors[backgroundPart] = partBackgroundColor;

        // Part foreground colors
        const foregroundParts = BrowserParts.getForegroundParts(backgroundPart);
        for (const foregroundPart of foregroundParts) {
          colors[foregroundPart] = partForegroundColor;
        }

        // Connected parts
        const connectedParts =
          BrowserParts.getConnectedBackgroundParts(backgroundPart);
        for (const connectedPart of connectedParts) {
          const connectedPartOptions =
            this.options.getPartOptions(connectedPart);

          // Connected part background color
          let connectedBackgroundColor = globalBackgroundColor;
          let connectedForegroundColor = globalForegroundColor;
          if (connectedPartOptions.inheritance === backgroundPart) {
            connectedBackgroundColor = partBackgroundColor;
            connectedForegroundColor = partForegroundColor;
          } else if (
            connectedPartOptions.inheritance === BrowserParts.INHERITANCES.off
          ) {
            connectedBackgroundColor = Runtime.computeColor(
              faviconMostPopularColor,
              pageMostPopularColor,
              connectedPartOptions.source,
              connectedPartOptions.saturationLimit,
              connectedPartOptions.darkness,
              connectedPartOptions.brightness
            );
            connectedForegroundColor = connectedBackgroundColor.getForeground();
          }
          colors[connectedPart] = connectedBackgroundColor;

          // Connected part foreground colors
          const connectedForegroundParts =
            BrowserParts.getForegroundParts(connectedPart);
          for (const foregroundPart of connectedForegroundParts) {
            colors[foregroundPart] = connectedForegroundColor;
          }
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      console.log(e);
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
   * @param {Tab} tab
   * @returns {Color?}
   */
  async getMostPopularColorFromPage(tab) {
    return await this.colorExtractor.getMostPopularColorFromPage(tab);
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
