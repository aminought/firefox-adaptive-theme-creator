const BACKGROUND_PARTS = {
  frame: "frame",
  popup: "popup",
  sidebar: "sidebar",
  tab_selected: "tab_selected",
  toolbar_field: "toolbar_field",
  toolbar: "toolbar",
};

const CONNECTED_PARTS = {
  frame_inactive: "frame_inactive",
  popup_border: "popup_border",
  sidebar_border: "sidebar_border",
  toolbar_bottom_separator: "toolbar_bottom_separator",
  toolbar_field_border: "toolbar_field_border",
  toolbar_field_focus: "toolbar_field_focus",
};

const FOREGROUND_PARTS = {
  bookmark_text: "bookmark_text",
  icons: "icons",
  popup_text: "popup_text",
  sidebar_text: "sidebar_text",
  tab_background_text: "tab_background_text",
  tab_text: "tab_text",
  toolbar_field_text_focus: "toolbar_field_text_focus",
  toolbar_field_text: "toolbar_field_text",
  toolbar_text: "toolbar_text",
};

const BACKGROUND_CONNECTIONS = {
  [BACKGROUND_PARTS.sidebar]: [CONNECTED_PARTS.sidebar_border],
  [BACKGROUND_PARTS.toolbar]: [CONNECTED_PARTS.toolbar_bottom_separator],
  [BACKGROUND_PARTS.toolbar_field]: [
    CONNECTED_PARTS.toolbar_field_border,
    CONNECTED_PARTS.toolbar_field_focus,
  ],
  [BACKGROUND_PARTS.frame]: [CONNECTED_PARTS.frame_inactive],
  [BACKGROUND_PARTS.popup]: [CONNECTED_PARTS.popup_border],
};

const BACKGROUND_CONNECTIONS_INVERSED = {
  [CONNECTED_PARTS.sidebar_border]: BACKGROUND_PARTS.sidebar,
  [CONNECTED_PARTS.toolbar_bottom_separator]: BACKGROUND_PARTS.toolbar,
  [CONNECTED_PARTS.toolbar_field_border]: BACKGROUND_PARTS.toolbar_field,
  [CONNECTED_PARTS.toolbar_field_focus]: BACKGROUND_PARTS.toolbar_field,
  [CONNECTED_PARTS.frame_inactive]: BACKGROUND_PARTS.frame,
  [CONNECTED_PARTS.popup_border]: BACKGROUND_PARTS.popup,
};

const FOREGROUND_CONNECTIONS = {
  [BACKGROUND_PARTS.frame]: [FOREGROUND_PARTS.tab_background_text],
  [BACKGROUND_PARTS.popup]: [FOREGROUND_PARTS.popup_text],
  [BACKGROUND_PARTS.sidebar]: [FOREGROUND_PARTS.sidebar_text],
  [BACKGROUND_PARTS.tab_selected]: [FOREGROUND_PARTS.tab_text],
  [BACKGROUND_PARTS.toolbar_field]: [FOREGROUND_PARTS.toolbar_field_text],
  [BACKGROUND_PARTS.toolbar]: [
    FOREGROUND_PARTS.toolbar_text,
    FOREGROUND_PARTS.bookmark_text,
    FOREGROUND_PARTS.icons,
  ],
  [CONNECTED_PARTS.toolbar_field_focus]: [
    FOREGROUND_PARTS.toolbar_field_text_focus,
  ],
};

export class BrowserParts {
  static INHERITANCES = {
    off: "inheritance_off",
    global: "inherit_global",
  };

  /**
   *
   * @returns {string[]}
   */
  static getBackgroundParts() {
    return Object.values(BACKGROUND_PARTS);
  }

  /**
   *
   * @param {string} backgroundPart
   * @returns {string[]}
   */
  static getForegroundParts(backgroundPart) {
    if (backgroundPart in FOREGROUND_CONNECTIONS) {
      return FOREGROUND_CONNECTIONS[backgroundPart];
    }
    return [];
  }

  /**
   *
   * @param {string} backgroundPart
   * @returns {string[]}
   */
  static getConnectedBackgroundParts(backgroundPart) {
    if (backgroundPart in BACKGROUND_CONNECTIONS) {
      return BACKGROUND_CONNECTIONS[backgroundPart];
    }
    return [];
  }

  /**
   *
   * @returns {string[]}
   */
  static getAllParts() {
    return Object.values(BACKGROUND_PARTS)
      .concat(Object.values(CONNECTED_PARTS))
      .concat(Object.values(FOREGROUND_PARTS));
  }

  /**
   *
   * @param {string} connectedPart
   * @returns {string[]}
   */
  static getInheritances(connectedPart) {
    const inheritances = [this.INHERITANCES.off, this.INHERITANCES.global];
    if (connectedPart in BACKGROUND_CONNECTIONS_INVERSED) {
      inheritances.push(BACKGROUND_CONNECTIONS_INVERSED[connectedPart]);
    }
    return inheritances;
  }
}
