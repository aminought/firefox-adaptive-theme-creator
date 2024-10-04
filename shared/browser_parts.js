import { INHERITANCE } from "./constants.js";

export class Part {
  /**
   *
   * @param {string} name
   * @param {object} params
   * @param {boolean} params.isForeground
   * @param {string?} params.parentPart
   * @param {string?} params.backgroundPart
   */
  constructor(
    name,
    { isForeground = false, parentPart = null, backgroundPart = null } = {}
  ) {
    this.name = name;
    this.isForeground = isForeground;
    this.parentPart = parentPart;
    this.backgroundPart = backgroundPart;
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
  bookmark_text: new Part("bookmark_text", {
    isForeground: true,
    backgroundPart: "toolbar",
  }),
  button_background_active: new Part("button_background_active"),
  button_background_hover: new Part("button_background_hover"),
  frame: new Part("frame"),
  frame_inactive: new Part("frame_inactive", { parentPart: "frame" }),
  icons: new Part("icons", { isForeground: true, backgroundPart: "toolbar" }),
  icons_attention: new Part("icons_attention", {
    isForeground: true,
    backgroundPart: "toolbar",
  }),
  ntp_background: new Part("ntp_background"),
  ntp_card_background: new Part("ntp_card_background", {
    parentPart: "ntp_background",
  }),
  ntp_text: new Part("ntp_text", {
    isForeground: true,
    backgroundPart: "ntp_card_background",
  }),
  popup: new Part("popup"),
  popup_border: new Part("popup_border", { parentPart: "popup" }),
  popup_highlight: new Part("popup_highlight"),
  popup_highlight_text: new Part("popup_highlight_text", {
    isForeground: true,
    backgroundPart: "popup_highlight",
  }),
  popup_text: new Part("popup_text", {
    isForeground: true,
    backgroundPart: "popup",
  }),
  sidebar: new Part("sidebar"),
  sidebar_border: new Part("sidebar_border", { parentPart: "sidebar" }),
  sidebar_highlight: new Part("sidebar_highlight"),
  sidebar_highlight_text: new Part("sidebar_highlight_text", {
    isForeground: true,
    backgroundPart: "sidebar_highlight",
  }),
  sidebar_text: new Part("sidebar_text", {
    isForeground: true,
    backgroundPart: "sidebar",
  }),
  tab_background_separator: new Part("tab_background_separator"),
  tab_background_text: new Part("tab_background_text", {
    isForeground: true,
    backgroundPart: "frame",
  }),
  tab_line: new Part("tab_line"),
  tab_loading: new Part("tab_loading"),
  tab_selected: new Part("tab_selected"),
  tab_text: new Part("tab_text", {
    isForeground: true,
    backgroundPart: "tab_selected",
  }),
  toolbar: new Part("toolbar"),
  toolbar_bottom_separator: new Part("toolbar_bottom_separator"),
  toolbar_field: new Part("toolbar_field", { parentPart: "toolbar" }),
  toolbar_field_border: new Part("toolbar_field_border", {
    parentPart: "toolbar_field",
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
  }),
  toolbar_field_text_focus: new Part("toolbar_field_text_focus", {
    isForeground: true,
    backgroundPart: "toolbar_field_focus",
  }),
  toolbar_text: new Part("toolbar_text", {
    isForeground: true,
    backgroundPart: "toolbar",
  }),
  toolbar_top_separator: new Part("toolbar_top_separator"),
  toolbar_vertical_separator: new Part("toolbar_vertical_separator"),
};

export const GROUPS = {
  titlebar: [PARTS.frame, PARTS.frame_inactive],
  tab: [
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
  toolbarField: [
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
  buttonsAndIcons: [
    PARTS.button_background_active,
    PARTS.button_background_hover,
    PARTS.icons,
    PARTS.icons_attention,
  ],
  popup: [
    PARTS.popup,
    PARTS.popup_text,
    PARTS.popup_highlight,
    PARTS.popup_highlight_text,
    PARTS.popup_border,
  ],
  bookmarks: [PARTS.bookmark_text],
  sidebar: [
    PARTS.sidebar,
    PARTS.sidebar_text,
    PARTS.sidebar_highlight,
    PARTS.sidebar_highlight_text,
    PARTS.sidebar_border,
  ],
  ntp: [PARTS.ntp_background, PARTS.ntp_card_background, PARTS.ntp_text],
};
