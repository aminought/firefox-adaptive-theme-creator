/* eslint-disable max-lines */

import {
  BACKGROUND_SOURCE,
  CONTENT_EVENTS,
  FOREGROUND_SOURCE,
  INHERITANCE,
  TRIGGER,
} from "../shared/constants.js";

import { Color } from "../shared/color.js";
import { ColorExtractor } from "./color_extractor.js";
import { Options } from "../shared/options.js";
import { PARTS } from "../shared/browser_parts.js";

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
   * @param {Color?} faviconMostPopularColor
   * @param {Color?} pageMostPopularColor
   * @param {Object} options
   * @param {string} options.source
   * @param {Color} options.color
   * @param {number} options.saturationLimit
   * @param {number} options.darkness
   * @param {number} options.brightness
   * @returns {Color?}
   */
  static computeBackgroundColor(
    faviconMostPopularColor,
    pageMostPopularColor,
    options
  ) {
    let computedColor = null;
    if (options.source === BACKGROUND_SOURCE.FAVICON) {
      computedColor = faviconMostPopularColor;
    } else if (options.source === BACKGROUND_SOURCE.PAGE) {
      computedColor = pageMostPopularColor;
    } else if (options.source === BACKGROUND_SOURCE.COLOR) {
      computedColor = new Color(options.color);
    }

    return computedColor
      ?.limitSaturation(options.saturationLimit)
      ?.darken(options.darkness)
      ?.brighten(options.brightness);
  }

  /**
   *
   * @param {Color?} faviconMostPopularColor
   * @param {Color?} pageMostPopularColor
   * @param {Color?} backgroundColor
   * @param {Object} options
   * @param {string} options.source
   * @param {Color} options.color
   * @param {number} options.saturationLimit
   * @param {number} options.darkness
   * @param {number} options.brightness
   */
  static computeForegroundColor(
    faviconMostPopularColor,
    pageMostPopularColor,
    backgroundColor,
    options
  ) {
    let computedColor = null;
    if (options.source === FOREGROUND_SOURCE.FAVICON) {
      computedColor = faviconMostPopularColor;
    } else if (options.source === FOREGROUND_SOURCE.PAGE) {
      computedColor = pageMostPopularColor;
    } else if (options.source === FOREGROUND_SOURCE.COLOR) {
      computedColor = new Color(options.color);
    } else if (options.source === FOREGROUND_SOURCE.AUTO) {
      computedColor = backgroundColor?.getForeground();
    }

    return computedColor
      ?.limitSaturation(options.saturationLimit)
      ?.darken(options.darkness)
      ?.brighten(options.brightness);
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

    const faviconMostPopularColor = this.options.isFaviconColorNeeded()
      ? await this.getMostPopularColorFromFavicon(tab.favIconUrl)
      : null;
    const pageMostPopularColor = this.options.isPageColorNeeded()
      ? await this.getMostPopularColorFromPage(tab, pageY)
      : null;

    const colors = this.makeColors(
      PARTS,
      faviconMostPopularColor,
      pageMostPopularColor
    );

    this.applyColors(tab.windowId, colors, pageMostPopularColor);
  }

  makeColors(parts, faviconMostPopularColor, pageMostPopularColor) {
    const globalOptions = this.options.getGlobalOptions();

    const globalBackgroundColor = Runtime.computeBackgroundColor(
      faviconMostPopularColor,
      pageMostPopularColor,
      globalOptions.background
    );

    const colors = {};
    let partNames = Object.keys(parts);

    while (partNames.length > 0) {
      const partName = partNames.shift();
      const part = parts[partName];
      const partOptions = this.options.getPartOptions(partName);

      if (!partOptions.enabled) {
        colors[partName] = this.defaultTheme.getColor(partName);
        continue;
      }

      let partColor = null;
      let backgroundPartColor = null;

      if (part.isForeground) {
        const backgroundPartName = part.backgroundPart;
        if (!(backgroundPartName in colors)) {
          partNames = partNames.filter((e) => e !== backgroundPartName);
          partNames.unshift(partName);
          partNames.unshift(backgroundPartName);
          continue;
        }
        backgroundPartColor = colors[backgroundPartName];
      }

      if (partOptions.inheritance === INHERITANCE.OFF) {
        partColor = part.isForeground
          ? Runtime.computeForegroundColor(
              faviconMostPopularColor,
              pageMostPopularColor,
              backgroundPartColor,
              partOptions
            )
          : Runtime.computeBackgroundColor(
              faviconMostPopularColor,
              pageMostPopularColor,
              partOptions
            );
      } else if (partOptions.inheritance === INHERITANCE.GLOBAL) {
        partColor = part.isForeground
          ? Runtime.computeForegroundColor(
              faviconMostPopularColor,
              pageMostPopularColor,
              backgroundPartColor,
              globalOptions.foreground
            )
          : globalBackgroundColor;
      } else {
        const parentPartName = partOptions.inheritance;
        if (!(parentPartName in colors)) {
          partNames = partNames.filter((e) => e !== parentPartName);
          partNames.unshift(partName);
          partNames.unshift(parentPartName);
          continue;
        }
        partColor = colors[parentPartName];
      }

      partColor ??= this.defaultTheme.getColor(partName);

      colors[partName] = partColor;
    }

    return colors;
  }

  /**
   *
   * @param {integer} windowId
   * @param {object} colors
   * @param {Color?} pageMostPopularColor
   */
  async applyColors(windowId, colors, pageMostPopularColor) {
    const theme = this.defaultTheme.clone();
    for (const part in colors) {
      theme.setColor(part, colors[part]);
    }
    await theme.fixImages();
    theme.setProperty("page", pageMostPopularColor?.css() ?? "null");
    theme.setProperty(
      "page_text",
      pageMostPopularColor?.getForeground()?.css() ?? "null"
    );
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
      (changeInfo.url && triggers.has(TRIGGER.URL_DETECTED)) ||
      (changeInfo.favIconUrl && triggers.has(TRIGGER.FAVICON_DETECTED)) ||
      (changeInfo.status === "complete" && triggers.has(TRIGGER.TAB_LOADED))
    ) {
      await this.updateTheme(tab);
    }
  }

  async onOptionsUpdated() {
    await this.options.load();
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
    const triggers = this.options.get("global.triggers");
    const trigger = CONTENT_EVENTS[message.event];
    if (trigger && triggers.includes(trigger)) {
      await this.updateTheme(null, message.y);
    }
  }
}
