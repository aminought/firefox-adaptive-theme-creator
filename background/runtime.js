import { BACKGROUND_SOURCE } from '../shared/constants.js';
import { PARTS } from '../shared/browser_parts.js';
import { Color } from '../shared/color.js';
import { ColorExtractor } from './color_extractor.js';
import { Options } from '../shared/options.js';
import { INHERITANCE } from '../shared/constants.js';

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
        if (source === BACKGROUND_SOURCE.favicon) {
            mostPopularColor = faviconMostPopularColor;
        } else if (source === BACKGROUND_SOURCE.page) {
            mostPopularColor = pageMostPopularColor;
        } else if (source === BACKGROUND_SOURCE.own_color) {
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

        const faviconMostPopularColor = this.options.isFaviconColorNeeded()
            ? await this.getMostPopularColorFromFavicon(tab.favIconUrl)
            : null;
        const pageMostPopularColor = this.options.isPageColorNeeded()
            ? await this.getMostPopularColorFromPage(tab, pageY)
            : null;

        // const colors = this.makeColors(
        //     Object.keys(PARTS),
        //     faviconMostPopularColor,
        //     pageMostPopularColor
        // );
        const colors = {};

        this.applyColors(tab.windowId, colors);
    }

    makeColors(parts, faviconMostPopularColor, pageMostPopularColor) {
        const globalOptions = this.options.getGlobalOptions();

        const globalBackgroundColor = Runtime.computeColor(
            faviconMostPopularColor,
            pageMostPopularColor,
            globalOptions.backgroundSource,
            globalOptions.color,
            globalOptions.saturationLimit,
            globalOptions.darkness,
            globalOptions.brightness
        );

        const globalForegroundColor = globalBackgroundColor?.getForeground();

        const colors = {};
        const part_names = Object.keys(parts);
        const queue = [part_names.shift()];

        while (queue.length > 0) {
            const part_name = queue.pop();

            if (colors[part_name]) {
                queue.push(part_names.shift());
                continue;
            }

            const part = parts[part_name];
            const partOptions = this.options.getPartOptions(part_name);

            if (!partOptions.enabled) {
                colors[part_name] = this.defaultTheme.getColor(part_name);
                queue.push(part_names.shift());
                continue;
            }

            let partBackgroundColor = null;
            let partForegroundColor = null;

            if (partOptions.inheritance === INHERITANCE.global) {
                partBackgroundColor = globalBackgroundColor;
                partForegroundColor = globalForegroundColor;
            } else if (partOptions.inheritance === part.parent_name) {
                if (!colors[part.parent_name]) {
                    queue.push(part_name);
                    queue.push(part.parent_name);
                    continue;
                }
                partBackgroundColor = colors[part.parent_name];
                partForegroundColor = partBackgroundColor?.getForeground();
            } else if (partOptions.inheritance === INHERITANCE.off) {
                partBackgroundColor = Runtime.computeColor(
                    faviconMostPopularColor,
                    pageMostPopularColor,
                    partOptions.background_source,
                    partOptions.color,
                    partOptions.saturationLimit,
                    partOptions.darkness,
                    partOptions.brightness
                );
                partForegroundColor = partBackgroundColor?.getForeground();
            }

            colors[part_name] = part.is_foreground ? partForegroundColor : partBackgroundColor;

            if (part_names.length > 0) {
                queue.push(part_names.shift());
            }
        }

        return colors;
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
        browser.runtime.sendMessage({ event: 'themeUpdated' });
    }

    /**
     *
     * @param {string} favIconUrl
     */
    async getMostPopularColorFromFavicon(favIconUrl) {
        try {
            return await this.colorExtractor.getMostPopularColorFromFavicon(favIconUrl);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Failed to calculate favicon color:', error);
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
                    code: 'document.documentElement.scrollTop',
                });
            }
            return await this.colorExtractor.getMostPopularColorFromPage(tab, pageY || 0);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Failed to calculate page color:', error);
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
            (changeInfo.url && triggers.has(Options.TRIGGERS.url_detected)) ||
            (changeInfo.favIconUrl && triggers.has(Options.TRIGGERS.favicon_detected)) ||
            (changeInfo.status === 'complete' && triggers.has(Options.TRIGGERS.tab_loaded))
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
