import { BrowserParts } from "../shared/browser_parts.js";
import { Color } from "../shared/color.js";
import { ColorExtractor } from "./color_extractor.js";
import { Options } from "../shared/options.js";

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
   * @returns {Color?}
   */
  static computeColor(
    faviconMostPopularColor,
    pageMostPopularColor,
    source,
    color,
    saturationLimit,
    darkness,
    brightness
  ) {
    let mostPopularColor = null;
    if (source === Options.SOURCES.FAVICON) {
      mostPopularColor = faviconMostPopularColor;
    } else if (source === Options.SOURCES.PAGE) {
      mostPopularColor = pageMostPopularColor;
    } else if (source === Options.SOURCES.OWN_COLOR) {
      mostPopularColor = new Color(color);
    }

    return mostPopularColor
      ?.limitSaturation(saturationLimit)
      ?.darken(darkness)
      ?.brighten(brightness);
  }

  /**
   *
   * @param {Tab} tab
   * @param {number?} pageY
   */
  async updateTheme(tab, pageY) {
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

    const globalOptions = this.options.getGlobalOptions();

    const faviconMostPopularColor = this.options.isFaviconColorNeeded()
      ? await this.getMostPopularColorFromFavicon(tab.favIconUrl)
      : null;
    const pageMostPopularColor = this.options.isPageColorNeeded()
      ? await this.getMostPopularColorFromPage(tab, pageY)
      : null;

    // Global colors
    const globalBackgroundColor = Runtime.computeColor(
      faviconMostPopularColor,
      pageMostPopularColor,
      globalOptions.source,
      globalOptions.color,
      globalOptions.saturationLimit,
      globalOptions.darkness,
      globalOptions.brightness
    );

    const globalForegroundColor = globalBackgroundColor?.getForeground();

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
          partOptions.color,
          partOptions.saturationLimit,
          partOptions.darkness,
          partOptions.brightness
        );
        partForegroundColor = partBackgroundColor?.getForeground();
      }
      if (partBackgroundColor) {
        colors[backgroundPart] = partBackgroundColor;
      }

      // Part foreground colors
      if (partForegroundColor) {
        const foregroundParts = BrowserParts.getForegroundParts(backgroundPart);
        for (const foregroundPart of foregroundParts) {
          colors[foregroundPart] = partForegroundColor;
        }
      }

      // Connected parts
      const connectedParts =
        BrowserParts.getConnectedBackgroundParts(backgroundPart);
      for (const connectedPart of connectedParts) {
        const connectedPartOptions = this.options.getPartOptions(connectedPart);

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
            connectedPartOptions.color,
            connectedPartOptions.saturationLimit,
            connectedPartOptions.darkness,
            connectedPartOptions.brightness
          );
          connectedForegroundColor = connectedBackgroundColor?.getForeground();
        }
        if (connectedBackgroundColor) {
          colors[connectedPart] = connectedBackgroundColor;
        }

        // Connected part foreground colors
        if (connectedForegroundColor) {
          const connectedForegroundParts =
            BrowserParts.getForegroundParts(connectedPart);
          for (const foregroundPart of connectedForegroundParts) {
            colors[foregroundPart] = connectedForegroundColor;
          }
        }
      }
    }

    this.applyColors(tab.windowId, colors);
  }

  /**
   *
   * @param {integer} windowId
   * @param {object} colors
   */
  async applyColors(windowId, colors) {
    const theme = this.defaultTheme.clone();
    for (const part in colors) {
      theme.setColor(part, colors[part]);
    }
    await theme.fixImages();
    await theme.update(windowId);
    browser.runtime.sendMessage({ event: "themeUpdated" });
  }

  /**
   *
   * @param {string} favIconUrl
   */
  async getMostPopularColorFromFavicon(favIconUrl) {
    try {
      return await this.colorExtractor.getMostPopularColorFromFavicon(
        favIconUrl
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Failed to calculate favicon color:", error);
      return null;
    }
  }

  /**
   *
   * @param {Tab} tab
   * @param {number?} pageY
   * @returns {Color?}
   */
  async getMostPopularColorFromPage(tab, pageY) {
    try {
      if (!pageY) {
        [pageY] = await browser.tabs.executeScript(tab.id, {
          code: "document.documentElement.scrollTop",
        });
      }
      return await this.colorExtractor.getMostPopularColorFromPage(
        tab,
        pageY || 0
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Failed to calculate page color:", error);
      return null;
    }
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
    const { triggers } = this.options.getGlobalOptions();
    if (!tab.active) {
      return;
    }

    if (
      (changeInfo.url && triggers.has(Options.TRIGGERS.URL_DETECTED)) ||
      (changeInfo.favIconUrl &&
        triggers.has(Options.TRIGGERS.FAVICON_DETECTED)) ||
      (changeInfo.status === "complete" &&
        triggers.has(Options.TRIGGERS.TAB_LOADED))
    ) {
      await this.updateTheme(tab);
    }
  }

  async onOptionsUpdated() {
    await this.options.reload();
    await this.updateTheme();
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

  async onContentMessage(message) {
    const { triggers } = this.options.getGlobalOptions();
    const trigger = Options.CONTENT_EVENTS[message.event];
    if (trigger && triggers.has(trigger)) {
      await this.updateTheme(null, message.y);
    }
  }
}
