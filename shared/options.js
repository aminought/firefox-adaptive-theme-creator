import {
    BACKGROUND_SOURCE,
    DEFAULT_BRIGHTNESS,
    DEFAULT_COLOR,
    DEFAULT_DARKNESS,
    DEFAULT_SATURATION_LIMIT,
    FOREGROUND_SOURCE,
    INHERITANCE,
} from './constants.js';
import { PARTS } from './browser_parts.js';

export class Options {
    static ALGORITHMS = {
        basic: 'basic',
        kmeans: 'kmeans',
    };

    static TRIGGERS = {
        url_detected: 'url_detected',
        favicon_detected: 'favicon_detected',
        tab_loaded: 'tab_loaded',
        page_scroll_end: 'page_scroll_end',
        page_click: 'page_click',
    };

    static CONTENT_EVENTS = {
        scrollend: Options.TRIGGERS.page_scroll_end,
        click: Options.TRIGGERS.page_click,
    };

    constructor() {
        this.options = Options.makeDefault();
    }

    static makeDefault() {
        const options = {
            background_source: BACKGROUND_SOURCE.page,
            foreground_source: FOREGROUND_SOURCE.auto,
            triggers: Object.values(Options.TRIGGERS),
            algo: this.ALGORITHMS.kmeans,
            color: DEFAULT_COLOR,
            saturation_limit: DEFAULT_SATURATION_LIMIT,
            darkness: DEFAULT_DARKNESS,
            brightness: DEFAULT_BRIGHTNESS,
            'favicon.avoid_white': true,
            'favicon.avoid_black': true,
            'page.capture_height': '1',
            'page.avoid_white': false,
            'page.avoid_black': false,
        };

        for (const part of Object.values(PARTS)) {
            const {name, defaults} = part;
            options[`${name}.enabled`] = defaults.enabled;
            options[`${name}.inheritance`] = defaults.inheritance;
            options[`${name}.background_source`] = defaults.background_source;
            options[`${name}.foreground_source`] = defaults.foreground_source;
            options[`${name}.color`] = defaults.color;
            options[`${name}.saturation_limit`] = defaults.saturationLimit;
            options[`${name}.darkness`] = defaults.darkness;
            options[`${name}.brightness`] = defaults.brightness;
        }
        return options;
    }

    static async load() {
        const storage = await browser.storage.local.get();
        const options = new Options(storage);
        await options.reload();
        return options;
    }

    async reload() {
        const storage = await browser.storage.local.get();
        for (const key in storage) {
            if (key in this.options && storage[key] !== null) {
                this.options[key] = storage[key];
            }
        }
    }

    /**
     *
     * @param {object=} options
     */
    async save(options) {
        await browser.storage.local.set(options || this.options);
    }

    async reset() {
        this.options = Options.makeDefault();
        await this.save();
    }

    getGlobalOptions() {
        return {
            backgroundSource: this.options.background_source,
            foregroundSource: this.options.foreground_source,
            algo: this.options.algo,
            color: this.options.color,
            triggers: new Set(this.options.triggers),
            saturationLimit: this.options.saturation_limit,
            darkness: this.options.darkness,
            brightness: this.options.brightness,
            favicon: {
                avoidWhite: this.options['favicon.avoid_white'],
                avoidBlack: this.options['favicon.avoid_black'],
            },
            page: {
                captureHeight: this.options['page.capture_height'],
                avoidWhite: this.options['page.avoid_white'],
                avoidBlack: this.options['page.avoid_black'],
            },
        };
    }

    /**
     *
     * @param {string} key
     * @returns {any}
     */
    getGlobalOption(key) {
        return this.options[key];
    }

    /**
     *
     * @param {string} key
     * @returns {Set}
     */
    getGlobalOptionAsSet(key) {
        return new Set(this.options[key]);
    }

    /**
     *
     * @param {string} part
     */
    getPartOptions(part) {
        return {
            enabled: this.getPartOption(part, 'enabled'),
            inheritance: this.getPartOption(part, 'inheritance'),
            background_source: this.getPartOption(part, 'background_source'),
            foreground_source: this.getPartOption(part, 'foreground_source'),
            color: this.getPartOption(part, 'color'),
            saturationLimit: this.getPartOption(part, 'saturation_limit'),
            darkness: this.getPartOption(part, 'darkness'),
            brightness: this.getPartOption(part, 'brightness'),
        };
    }

    /**
     *
     * @param {string} part
     * @param {string} partKey
     * @returns {any}
     */
    getPartOption(part, partKey) {
        return this.options[`${part}.${partKey}`];
    }

    /**
     *
     * @param {string} key
     * @param {any} value
     */
    async setGlobalOption(key, value) {
        this.options[key] = value;
        await this.save({ [key]: value });
    }

    /**
     *
     * @param {string} part
     * @param {string} partKey
     * @param {any} value
     */
    async setPartOption(part, partKey, value) {
        const part_key = `${part}.${partKey}`;
        this.options[part_key] = value;
        await this.save({ [part_key]: value });
    }

    /**
     *
     * @param {string} background_source
     * @returns {boolean}
     */
    isSourceNeeded(background_source) {
        if (this.options.background_source === background_source) {
            return true;
        }

        for (const part of Object.values(PARTS)) {
            const partEnabled = this.getPartOption(part.name, 'enabled');
            const partInheritance = this.getPartOption(part.name, 'inheritance');
            const partSource = this.getPartOption(part.name, 'background_source');
            if (
                partEnabled &&
                partInheritance === INHERITANCE.off &&
                partSource === background_source
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @returns {boolean}
     */
    isPageColorNeeded() {
        return this.isSourceNeeded(BACKGROUND_SOURCE.page);
    }

    /**
     *
     * @returns {boolean}
     */
    isFaviconColorNeeded() {
        return this.isSourceNeeded(BACKGROUND_SOURCE.favicon);
    }
}
