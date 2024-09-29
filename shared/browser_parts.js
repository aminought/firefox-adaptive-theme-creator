import { BACKGROUND_SOURCE, INHERITANCE } from './constants.js';
import {
    PartDefaults,
    makeBackgroundDefaults,
    makeForegroundDefaults,
} from './browser_part_defaults.js';

export class Part {
    /**
     *
     * @param {string} name
     * @param {object} params
     * @param {string} params.parent_name
     * @param {boolean} params.is_foreground
     * @param {PartDefaults} params.defaults
     */
    constructor(
        name,
        { parent_name = null, is_foreground = false, defaults = makeBackgroundDefaults() } = {}
    ) {
        this.name = name;
        this.parent_name = parent_name;
        this.is_foreground = is_foreground;
        this.defaults = defaults;
    }

    /**
     *
     * @returns {string[]}
     */
    getInheritances() {
        const inheritances = [INHERITANCE.off, INHERITANCE.global];
        if (this.parent_name) {
            inheritances.push(this.parent_name);
        }
        return inheritances;
    }
}

export const PARTS = {
    bookmark_text: new Part('bookmark_text', {
        parent_name: 'toolbar',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    button_background_active: new Part('button_background_active'),
    button_background_hover: new Part('button_background_hover'),
    frame: new Part('frame', { defaults: makeBackgroundDefaults({ enabled: true }) }),
    frame_inactive: new Part('frame_inactive', {
        parent_name: 'frame',
        defaults: makeBackgroundDefaults({ enabled: true }),
    }),
    icons: new Part('icons', {
        parent_name: 'toolbar',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    icons_attention: new Part('icons_attention', {
        parent_name: 'toolbar',
        is_foreground: true,
        defaults: makeForegroundDefaults(),
    }),
    ntp_background: new Part('ntp_background'),
    ntp_card_background: new Part('ntp_card_background', { parent_name: 'ntp_background' }),
    ntp_text: new Part('ntp_text', {
        parent_name: 'ntp_card_background',
        is_foreground: true,
        defaults: makeForegroundDefaults(),
    }),
    popup: new Part('popup', { defaults: makeBackgroundDefaults({ enabled: true }) }),
    popup_border: new Part('popup_border', {
        parent_name: 'popup',
        defaults: makeBackgroundDefaults({
            enabled: true,
            inheritance: INHERITANCE.off,
            background_source: BACKGROUND_SOURCE.favicon,
            saturationLimit: '0.5',
        }),
    }),
    popup_highlight: new Part('popup_highlight'),
    popup_highlight_text: new Part('popup_highlight_text', {
        parent_name: 'popup_highlight',
        is_foreground: true,
        defaults: makeForegroundDefaults(),
    }),
    popup_text: new Part('popup_text', {
        parent_name: 'popup',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    sidebar: new Part('sidebar', { defaults: makeBackgroundDefaults({ enabled: true }) }),
    sidebar_border: new Part('sidebar_border', {
        parent_name: 'sidebar',
        defaults: makeBackgroundDefaults({ enabled: true }),
    }),
    sidebar_highlight: new Part('sidebar_highlight'),
    sidebar_highlight_text: new Part('sidebar_highlight_text', {
        parent_name: 'sidebar_highlight',
        is_foreground: true,
        defaults: makeForegroundDefaults(),
    }),
    sidebar_text: new Part('sidebar_text', {
        parent_name: 'sidebar',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    tab_background_separator: new Part('tab_background_separator'),
    tab_background_text: new Part('tab_background_text', {
        parent_name: 'frame',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    tab_line: new Part('tab_line'),
    tab_loading: new Part('tab_loading'),
    tab_selected: new Part('tab_selected', {
        defaults: makeBackgroundDefaults({
            enabled: true,
            inheritance: INHERITANCE.off,
            background_source: BACKGROUND_SOURCE.favicon,
            saturationLimit: '0.5',
        }),
    }),
    tab_text: new Part('tab_text', {
        parent_name: 'tab_selected',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    toolbar: new Part('toolbar', { defaults: makeBackgroundDefaults({ enabled: true }) }),
    toolbar_bottom_separator: new Part('toolbar_bottom_separator', { parent_name: 'toolbar' }),
    toolbar_field: new Part('toolbar_field', {
        parent_name: 'toolbar',
        defaults: makeBackgroundDefaults({ enabled: true }),
    }),
    toolbar_field_border: new Part('toolbar_field_border', { parent_name: 'toolbar_field' }),
    toolbar_field_border_focus: new Part('toolbar_field_border_focus', {
        parent_name: 'toolbar_field_border',
    }),
    toolbar_field_focus: new Part('toolbar_field_focus', { parent_name: 'toolbar_field' }),
    toolbar_field_highlight: new Part('toolbar_field_highlight'),
    toolbar_field_highlight_text: new Part('toolbar_field_highlight_text', {
        parent_name: 'toolbar_field_highlight',
        is_foreground: true,
        defaults: makeForegroundDefaults(),
    }),
    toolbar_field_separator: new Part('toolbar_field_separator'),
    toolbar_field_text: new Part('toolbar_field_text', {
        parent_name: 'toolbar_field',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    toolbar_field_text_focus: new Part('toolbar_field_text_focus', {
        parent_name: 'toolbar_field_focus',
        is_foreground: true,
        defaults: makeForegroundDefaults(),
    }),
    toolbar_text: new Part('toolbar_text', {
        parent_name: 'toolbar',
        is_foreground: true,
        defaults: makeForegroundDefaults({ enabled: true }),
    }),
    toolbar_top_separator: new Part('toolbar_top_separator'),
    toolbar_vertical_separator: new Part('toolbar_vertical_separator'),
};

export const GROUPS = {
    frame: [PARTS.frame, PARTS.frame_inactive],
    popup: [
        PARTS.popup,
        PARTS.popup_text,
        PARTS.popup_highlight,
        PARTS.popup_highlight_text,
        PARTS.popup_border,
    ],
    sidebar: [
        PARTS.sidebar,
        PARTS.sidebar_text,
        PARTS.sidebar_highlight,
        PARTS.sidebar_highlight_text,
        PARTS.sidebar_border,
    ],
    tabs: [
        PARTS.tab_selected,
        PARTS.tab_text,
        PARTS.tab_background_text,
        PARTS.tab_line,
        PARTS.tab_loading,
        PARTS.tab_background_separator,
    ],
    toolbar: [
        PARTS.toolbar,
        PARTS.toolbar_text,
        PARTS.toolbar_top_separator,
        PARTS.toolbar_bottom_separator,
        PARTS.toolbar_vertical_separator,
    ],
    buttons: [PARTS.button_background_active, PARTS.button_background_hover],
    icons: [PARTS.icons, PARTS.icons_attention],
    bookmarks: [PARTS.bookmark_text],
    toolbar_field: [
        PARTS.toolbar_field,
        PARTS.toolbar_field_text,
        PARTS.toolbar_field_focus,
        PARTS.toolbar_field_text_focus,
        PARTS.toolbar_field_highlight,
        PARTS.toolbar_field_highlight_text,
        PARTS.toolbar_field_border,
        PARTS.toolbar_field_border_focus,
        PARTS.toolbar_field_separator,
    ],
    ntp: [PARTS.ntp_background, PARTS.ntp_card_background, PARTS.ntp_text],
};
