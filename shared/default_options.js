import {
  BACKGROUND_SOURCE,
  DEFAULT_BRIGHTNESS,
  DEFAULT_COLOR,
  DEFAULT_DARKNESS,
  DEFAULT_SATURATION_LIMIT,
  FOREGROUND_SOURCE,
  INHERITANCE,
  PAGE_COLOR_ALGO,
  TRIGGER,
} from "./constants.js";

/**
 *
 * @param {Object} params
 * @param {boolean} params.enabled
 * @param {string } params.inheritance
 * @param {string} params.source
 * @param {string} params.color
 * @param {string} params.saturationLimit
 * @param {string} params.darkness
 * @param {string} params.brightness
 */
const makePart = ({
  enabled = false,
  inheritance = INHERITANCE.GLOBAL,
  source = BACKGROUND_SOURCE.PAGE,
  color = DEFAULT_COLOR,
  saturationLimit = DEFAULT_SATURATION_LIMIT,
  darkness = DEFAULT_DARKNESS,
  brightness = DEFAULT_BRIGHTNESS,
} = {}) => ({
  enabled,
  inheritance,
  source,
  color,
  saturationLimit,
  darkness,
  brightness,
});

export const DEFAULT_OPTIONS = {
  global: {
    enabled: true,
    triggers: Object.values(TRIGGER),
    favicon: {
      avoidWhite: false,
      avoidBlack: false,
    },
    page: {
      avoidWhite: false,
      avoidBlack: false,
      captureHeight: 10,
      colorAlgo: PAGE_COLOR_ALGO.BASIC,
    },
    background: {
      source: BACKGROUND_SOURCE.PAGE,
      color: DEFAULT_COLOR,
      saturationLimit: DEFAULT_SATURATION_LIMIT,
      darkness: DEFAULT_DARKNESS,
      brightness: DEFAULT_BRIGHTNESS,
    },
    foreground: {
      source: FOREGROUND_SOURCE.AUTO,
      color: DEFAULT_COLOR,
      saturationLimit: DEFAULT_SATURATION_LIMIT,
      darkness: DEFAULT_DARKNESS,
      brightness: DEFAULT_BRIGHTNESS,
    },
  },
  parts: {
    bookmark_text: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    button_background_active: makePart(),
    button_background_hover: makePart(),
    frame: makePart({ enabled: true }),
    frame_inactive: makePart({ enabled: true, inheritance: "frame" }),
    icons: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    icons_attention: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    ntp_background: makePart(),
    ntp_card_background: makePart(),
    ntp_text: makePart({
      source: FOREGROUND_SOURCE.AUTO,
    }),
    popup: makePart({ enabled: true }),
    popup_border: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: BACKGROUND_SOURCE.FAVICON,
      saturationLimit: "0.5",
    }),
    popup_highlight: makePart(),
    popup_highlight_text: makePart({ source: FOREGROUND_SOURCE.AUTO }),
    popup_text: makePart({ source: FOREGROUND_SOURCE.AUTO }),
    sidebar: makePart({ enabled: true }),
    sidebar_border: makePart({ enabled: true, inheritance: "sidebar" }),
    sidebar_highlight: makePart(),
    sidebar_highlight_text: makePart({ source: FOREGROUND_SOURCE.AUTO }),
    sidebar_text: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    tab_background_separator: makePart(),
    tab_background_text: makePart({ source: FOREGROUND_SOURCE.AUTO }),
    tab_line: makePart(),
    tab_loading: makePart(),
    tab_selected: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: BACKGROUND_SOURCE.FAVICON,
      saturationLimit: "0.5",
    }),
    tab_text: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    toolbar: makePart({ enabled: true }),
    toolbar_bottom_separator: makePart(),
    toolbar_field: makePart({ enabled: true }),
    toolbar_field_border: makePart(),
    toolbar_field_border_focus: makePart(),
    toolbar_field_focus: makePart(),
    toolbar_field_highlight: makePart(),
    toolbar_field_highlight_text: makePart({ source: FOREGROUND_SOURCE.AUTO }),
    toolbar_field_separator: makePart(),
    toolbar_field_text: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    toolbar_field_text_focus: makePart({ source: FOREGROUND_SOURCE.AUTO }),
    toolbar_text: makePart({
      enabled: true,
      inheritance: INHERITANCE.OFF,
      source: FOREGROUND_SOURCE.AUTO,
    }),
    toolbar_top_separator: makePart(),
    toolbar_vertical_separator: makePart(),
  },
};
