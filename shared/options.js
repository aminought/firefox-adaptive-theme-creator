import { BACKGROUND_SOURCE, INHERITANCE } from './constants.js';
import { DEFAULT_OPTIONS } from './default_options.js';

export class Options {
    constructor(storage) {
        this.storage = storage;
        this.reset();
    }

    getGlobalOptions() {
        return this.options.global;
    }

    getPartOptions(partName) {
        return this.options.parts[partName];
    }

    async load() {
        const options = await this.storage.get();
        for (const key in options) {
            if (key in this.options) {
                this.options[key] = options[key];
            }
        }
    }

    async save() {
        await this.storage.set(this.options);
    }

    reset() {
        this.options = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
    }

    /**
     *
     * @param {string} source
     * @returns {boolean}
     */
    isSourceNeeded(source) {
        if (
            this.options.global.background.source === source ||
            this.options.global.foreground.source === source
        ) {
            return true;
        }

        for (const part of Object.values(this.options.parts)) {
            if (part.enabled && part.inheritance === INHERITANCE.OFF && part.source === source) {
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
        return this.isSourceNeeded(BACKGROUND_SOURCE.PAGE);
    }

    /**
     *
     * @returns {boolean}
     */
    isFaviconColorNeeded() {
        return this.isSourceNeeded(BACKGROUND_SOURCE.FAVICON);
    }
}
