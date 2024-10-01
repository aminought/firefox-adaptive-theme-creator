export const INHERITANCE = {
    OFF: 'OFF',
    GLOBAL: 'GLOBAL',
};

export const BACKGROUND_SOURCE = {
    FAVICON: 'FAVICON',
    PAGE: 'PAGE',
    COLOR: 'COLOR',
};

export const FOREGROUND_SOURCE = {
    FAVICON: 'FAVICON',
    PAGE: 'PAGE',
    COLOR: 'COLOR',
    AUTO: 'AUTO',
};

export const PAGE_COLOR_ALGO = { BASIC: 'BASIC', KMEANS: 'KMEANS' };

export const TRIGGER = {
    URL_DETECTED: 'URL_DETECTED',
    FAVICON_DETECTED: 'FAVICON_DETECTED',
    TAB_LOADED: 'TAB_LOADED',
    PAGE_SCROLL_END: 'PAGE_SCROLL_END',
    PAGE_CLICK: 'PAGE_CLICK',
};

export const DEFAULT_COLOR = '#ff80ed';
export const DEFAULT_SATURATION_LIMIT = '1.0';
export const DEFAULT_DARKNESS = '0.0';
export const DEFAULT_BRIGHTNESS = '0.0';

export const CONTENT_EVENTS = {
    scrollend: TRIGGER.PAGE_SCROLL_END,
    click: TRIGGER.PAGE_CLICK,
};
