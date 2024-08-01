import { Color } from "./color.js";

export class Theme {
  constructor(themeInfo) {
    this.themeInfo = themeInfo;
  }

  static async load() {
    return new Theme(await browser.theme.getCurrent());
  }

  async reload() {
    this.themeInfo = await browser.theme.getCurrent();
  }

  /**
   *
   * @param {integer} windowId
   */
  async update(windowId) {
    await browser.theme.update(windowId, this.themeInfo);
  }

  isCompatible() {
    return this.themeInfo.colors !== null;
  }

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

  getColor(part) {
    const color = this.themeInfo.colors[part];
    return color ? new Color(color) : null;
  }

  setColor(part, color) {
    this.themeInfo.colors[part] = color?.css();
    this.themeInfo.properties.source = "favicon-color";
  }

  isModified() {
    return this.themeInfo.properties.source === "favicon-color";
  }

  clone() {
    const themeInfo = JSON.parse(JSON.stringify(this.themeInfo));
    return new Theme(themeInfo);
  }
}
