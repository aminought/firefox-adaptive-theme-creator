import {
    INHERITANCE,
    BACKGROUND_SOURCE,
    FOREGROUND_SOURCE,
    DEFAULT_COLOR,
    DEFAULT_SATURATION_LIMIT,
    DEFAULT_DARKNESS,
    DEFAULT_BRIGHTNESS,
} from './constants.js';

export class PartDefaults {
    /**
     *
     * @param {Object} params
     * @param {boolean} params.enabled
     * @param {INHERITANCE | string | null } params.inheritance
     * @param {BACKGROUND_SOURCE?} params.background_source
     * @param {FOREGROUND_SOURCE?} params.foreground_source
     * @param {string} params.color
     * @param {string} params.saturationLimit
     * @param {string} params.darkness
     * @param {string} params.brightness
     */
    constructor(params) {
        this.enabled = params.enabled;
        this.inheritance = params.inheritance;
        this.background_source = params.background_source;
        this.foreground_source = params.foreground_source;
        this.color = params.color;
        this.saturationLimit = params.saturationLimit;
        this.darkness = params.darkness;
        this.brightness = params.brightness;
    }
}

/**
 *
 * @param {Object} params
 * @param {boolean} params.enabled
 * @param {INHERITANCE | string | null } params.inheritance
 * @param {BACKGROUND_SOURCE?} params.background_source
 * @param {FOREGROUND_SOURCE?} params.foreground_source
 * @param {string} params.color
 * @param {string} params.saturationLimit
 * @param {string} params.darkness
 * @param {string} params.brightness
 */
export const makeBackgroundDefaults = ({
    enabled = false,
    inheritance = INHERITANCE.global,
    background_source = BACKGROUND_SOURCE.page,
    foreground_source = null,
    color = DEFAULT_COLOR,
    saturationLimit = DEFAULT_SATURATION_LIMIT,
    darkness = DEFAULT_DARKNESS,
    brightness = DEFAULT_BRIGHTNESS,
} = {}) => {
    return new PartDefaults({
        enabled,
        inheritance,
        background_source,
        foreground_source,
        color,
        saturationLimit,
        darkness,
        brightness,
    });
};

/**
 *
 * @param {Object} params
 * @param {boolean} params.enabled
 * @param {INHERITANCE | string | null } params.inheritance
 * @param {BACKGROUND_SOURCE?} params.background_source
 * @param {FOREGROUND_SOURCE?} params.foreground_source
 * @param {string} params.color
 * @param {string} params.saturationLimit
 * @param {string} params.darkness
 * @param {string} params.brightness
 */
export const makeForegroundDefaults = ({
    enabled = false,
    inheritance = null,
    background_source = null,
    foreground_source = FOREGROUND_SOURCE.auto,
    color = DEFAULT_COLOR,
    saturationLimit = DEFAULT_SATURATION_LIMIT,
    darkness = DEFAULT_DARKNESS,
    brightness = DEFAULT_BRIGHTNESS,
} = {}) => {
    return new PartDefaults({
        enabled,
        inheritance,
        background_source,
        foreground_source,
        color,
        saturationLimit,
        darkness,
        brightness,
    });
};
