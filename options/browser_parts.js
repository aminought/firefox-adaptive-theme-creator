export class BrowserParts {
  static PARTS = {
    tab_selected: {
      connected_parts: [],
      foreground_parts: ["tab_text"],
    },
    sidebar: {
      connected_parts: [],
      foreground_parts: ["sidebar_text"],
    },
    toolbar: {
      connected_parts: ["toolbar_bottom_separator"],
      foreground_parts: ["toolbar_text", "bookmark_text", "icons"],
    },
    toolbar_field: {
      connected_parts: ["toolbar_field_focus"],
      foreground_parts: ["toolbar_field_text"],
    },
    frame: {
      connected_parts: [],
      foreground_parts: ["tab_background_text"],
    },
    popup: {
      connected_parts: [],
      foreground_parts: ["popup_text"],
    },
  };

  /**
   *
   * @returns {string[]}
   */
  static getBackgroundParts() {
    return Object.keys(BrowserParts.PARTS);
  }

  /**
   *
   * @returns {string[]}
   */
  static getForegroundParts(part) {
    return BrowserParts.PARTS[part].foreground_parts;
  }

  /**
   *
   * @returns {string[]}
   */
  static getConnectedParts(part) {
    return BrowserParts.PARTS[part].connected_parts;
  }

  /**
   *
   * @returns {string[]}
   */
  static getAllParts() {
    let parts = BrowserParts.getBackgroundParts();
    for (const backgroundPart of BrowserParts.getBackgroundParts()) {
      parts = parts.concat(BrowserParts.getForegroundParts(backgroundPart));
      parts = parts.concat(BrowserParts.getConnectedParts(backgroundPart));
    }
    return parts;
  }
}
