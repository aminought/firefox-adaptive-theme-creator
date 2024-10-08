import { Color } from "./color.js";
import { DEFAULT_DARK_THEME } from "./dark_theme.js";
import { DEFAULT_LIGHT_THEME } from "./light_theme.js";
import { Options } from "./options.js";
import { THEME } from "./constants.js";

const DEFAULT_THEMES = {
  [THEME.LIGHT]: DEFAULT_LIGHT_THEME,
  [THEME.DARK]: DEFAULT_DARK_THEME,
};

export class Theme {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   *
   * @param {object} themeInfo
   * @returns {boolean}
   */
  async load(themeInfo = null) {
    if (themeInfo === null) {
      themeInfo = await browser.theme.getCurrent();
    }
    return this.setThemeInfo(themeInfo);
  }

  async loadAsIs() {
    this.themeInfo = await browser.theme.getCurrent();
  }

  /**
   *
   * @param {object} themeInfo
   * @returns {boolean}
   */
  setThemeInfo(themeInfo) {
    if (themeInfo.colors === null || themeInfo.properties?.system === "true") {
      this.themeInfo = JSON.parse(
        JSON.stringify(DEFAULT_THEMES[this.options.get("global.theme")])
      );
      return true;
    }

    if (themeInfo.properties?.modified === "true") {
      return false;
    }

    this.themeInfo = themeInfo;
    return true;
  }

  /**
   *
   * @param {number} windowId
   */
  async update(windowId) {
    this.setProperty("modified", "true");
    await browser.theme.update(windowId, this.themeInfo);
  }

  /**
   *
   * @param {string} dataUrl
   * @returns {string}
   */
  static fixDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      if (!dataUrl.startsWith("data:image/svg")) {
        resolve(dataUrl);
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        const pngDataUrl = canvas.toDataURL("image/png");
        resolve(pngDataUrl);
      };

      image.onerror = reject;
      image.src = dataUrl;
    });
  }

  /**
   *
   * @param {string} url
   * @returns {string}
   */
  static getDataUrl(url) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "blob";
      request.onload = () => {
        const reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = (e) => {
          resolve(e.target.result);
        };
      };
      request.send();
    });
  }

  async fixImages() {
    const { images } = this.themeInfo;
    if (images === null) {
      return;
    }
    if (images.additional_backgrounds) {
      for (let i = 0; i < images.additional_backgrounds.length; ++i) {
        const url = images.additional_backgrounds[i];
        if (url === null) {
          continue;
        }
        let dataUrl = await Theme.getDataUrl(url);
        dataUrl = await Theme.fixDataUrl(dataUrl);
        images.additional_backgrounds[i] = dataUrl;
      }
    }
    if (images.theme_frame) {
      let dataUrl = await Theme.getDataUrl(images.theme_frame);
      dataUrl = await Theme.fixDataUrl(dataUrl);
      images.theme_frame = dataUrl;
    }
  }

  /**
   *
   * @param {string} part
   * @returns {Color?}
   */
  getColor(part) {
    const color = this.themeInfo.colors[part];
    return color ? new Color(color) : null;
  }

  /**
   *
   * @param {string} part
   * @param {Color?} color
   */
  setColor(part, color) {
    this.themeInfo.colors[part] = color?.css();
  }

  /**
   *
   * @param {string} name
   * @returns {string}
   */
  getProperty(name) {
    return this.themeInfo.properties?.[name];
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   */
  setProperty(name, value) {
    if (this.themeInfo.properties !== null) {
      this.themeInfo.properties[name] = value;
    }
  }

  /**
   *
   * @returns {Theme}
   */
  async clone() {
    const themeInfo = JSON.parse(JSON.stringify(this.themeInfo));
    const theme = new Theme(this.options);
    await theme.load(themeInfo);
    return theme;
  }
}
