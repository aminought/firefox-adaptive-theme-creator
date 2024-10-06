import { INHERITANCE } from "./constants.js";

export class Part {
  /**
   *
   * @param {string} name
   * @param {object} params
   * @param {boolean} params.isForeground
   * @param {string?} params.parentPart
   * @param {string?} params.backgroundPart
   * @param {boolean} params.hasPreview
   */
  constructor(
    name,
    {
      isForeground = false,
      parentPart = null,
      backgroundPart = null,
      hasPreview = false,
    } = {}
  ) {
    this.name = name;
    this.isForeground = isForeground;
    this.parentPart = parentPart;
    this.backgroundPart = backgroundPart;
    this.hasPreview = hasPreview;
  }

  /**
   *
   * @returns {string[]}
   */
  getInheritances() {
    const inheritances = [INHERITANCE.OFF, INHERITANCE.GLOBAL];
    if (this.parentPart) {
      inheritances.push(this.parentPart);
    }
    return inheritances;
  }
}

export const PARTS = {
  button_background_active: new Part("button_background_active"),
  button_background_hover: new Part("button_background_hover"),
  frame: new Part("frame", { hasPreview: true }),
  frame_inactive: new Part("frame_inactive", { parentPart: "frame" }),
  icons: new Part("icons", {
    isForeground: true,
    backgroundPart: "toolbar",
    hasPreview: true,
  }),
  icons_attention: new Part("icons_attention", {
    isForeground: true,
    backgroundPart: "toolbar",
  }),
  ntp_background: new Part("ntp_background", { hasPreview: true }),
  ntp_card_background: new Part("ntp_card_background", {
    parentPart: "ntp_background",
    hasPreview: true,
  }),
  ntp_text: new Part("ntp_text", {
    isForeground: true,
    backgroundPart: "ntp_card_background",
    hasPreview: true,
  }),
  popup: new Part("popup", { hasPreview: true }),
  popup_border: new Part("popup_border", {
    parentPart: "popup",
    hasPreview: true,
  }),
  popup_highlight: new Part("popup_highlight"),
  popup_highlight_text: new Part("popup_highlight_text", {
    isForeground: true,
    backgroundPart: "popup_highlight",
  }),
  popup_text: new Part("popup_text", {
    isForeground: true,
    backgroundPart: "popup",
    hasPreview: true,
  }),
  sidebar: new Part("sidebar", { hasPreview: true }),
  sidebar_border: new Part("sidebar_border", {
    parentPart: "sidebar",
    hasPreview: true,
  }),
  sidebar_highlight: new Part("sidebar_highlight"),
  sidebar_highlight_text: new Part("sidebar_highlight_text", {
    isForeground: true,
    backgroundPart: "sidebar_highlight",
  }),
  sidebar_text: new Part("sidebar_text", {
    isForeground: true,
    backgroundPart: "sidebar",
    hasPreview: true,
  }),
  tab_background_separator: new Part("tab_background_separator"),
  tab_background_text: new Part("tab_background_text", {
    isForeground: true,
    backgroundPart: "frame",
  }),
  tab_line: new Part("tab_line", { hasPreview: true }),
  tab_loading: new Part("tab_loading"),
  tab_selected: new Part("tab_selected", { hasPreview: true }),
  tab_text: new Part("tab_text", {
    isForeground: true,
    backgroundPart: "tab_selected",
    hasPreview: true,
  }),
  toolbar: new Part("toolbar", { hasPreview: true }),
  toolbar_bottom_separator: new Part("toolbar_bottom_separator", {
    hasPreview: true,
  }),
  toolbar_field: new Part("toolbar_field", {
    parentPart: "toolbar",
    hasPreview: true,
  }),
  toolbar_field_border: new Part("toolbar_field_border", {
    parentPart: "toolbar_field",
    hasPreview: true,
  }),
  toolbar_field_border_focus: new Part("toolbar_field_border_focus", {
    parentPart: "toolbar_field_border",
  }),
  toolbar_field_focus: new Part("toolbar_field_focus", {
    parentPart: "toolbar_field",
  }),
  toolbar_field_highlight: new Part("toolbar_field_highlight"),
  toolbar_field_highlight_text: new Part("toolbar_field_highlight_text", {
    isForeground: true,
    backgroundPart: "toolbar_field_highlight",
  }),
  toolbar_field_separator: new Part("toolbar_field_separator"),
  toolbar_field_text: new Part("toolbar_field_text", {
    isForeground: true,
    backgroundPart: "toolbar_field",
    hasPreview: true,
  }),
  toolbar_field_text_focus: new Part("toolbar_field_text_focus", {
    isForeground: true,
    backgroundPart: "toolbar_field_focus",
  }),
  toolbar_text: new Part("toolbar_text", {
    isForeground: true,
    backgroundPart: "toolbar",
    hasPreview: true,
  }),
  toolbar_top_separator: new Part("toolbar_top_separator", {
    hasPreview: true,
  }),
  toolbar_vertical_separator: new Part("toolbar_vertical_separator"),
};

export const GROUP_NAMES = {
  TITLEBAR: "TITLEBAR",
  TABS: "TABS",
  TOOLBAR: "TOOLBAR",
  TOOLBAR_FIELD: "TOOLBAR_FIELD",
  BUTTONS_AND_ICONS: "BUTTONS_AND_ICONS",
  POPUP: "POPUP",
  BOOKMARKS: "BOOKMARKS",
  SIDEBAR: "SIDEBAR",
  NTP: "NTP",
  PAGE: "PAGE",
};

export const GROUPS = {
  [GROUP_NAMES.TITLEBAR]: [PARTS.frame, PARTS.frame_inactive],
  [GROUP_NAMES.TABS]: [
    PARTS.tab_selected,
    PARTS.tab_text,
    PARTS.tab_background_text,
    PARTS.tab_line,
    PARTS.tab_loading,
    PARTS.tab_background_separator,
  ],
  [GROUP_NAMES.TOOLBAR]: [
    PARTS.toolbar,
    PARTS.toolbar_text,
    PARTS.toolbar_top_separator,
    PARTS.toolbar_bottom_separator,
    PARTS.toolbar_vertical_separator,
  ],
  [GROUP_NAMES.TOOLBAR_FIELD]: [
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
  [GROUP_NAMES.BUTTONS_AND_ICONS]: [
    PARTS.icons,
    PARTS.icons_attention,
    PARTS.button_background_active,
    PARTS.button_background_hover,
  ],
  [GROUP_NAMES.POPUP]: [
    PARTS.popup,
    PARTS.popup_text,
    PARTS.popup_highlight,
    PARTS.popup_highlight_text,
    PARTS.popup_border,
  ],
  [GROUP_NAMES.SIDEBAR]: [
    PARTS.sidebar,
    PARTS.sidebar_text,
    PARTS.sidebar_highlight,
    PARTS.sidebar_highlight_text,
    PARTS.sidebar_border,
  ],
  [GROUP_NAMES.NTP]: [
    PARTS.ntp_background,
    PARTS.ntp_card_background,
    PARTS.ntp_text,
  ],
  [GROUP_NAMES.PAGE]: [],
};
