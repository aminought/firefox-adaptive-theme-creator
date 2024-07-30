// eslint-disable-next-line no-unused-vars
import { Color } from "../../shared/color.js";

const PART_BORDERS = {
  navigator: ["Bottom"],
  frame: ["Bottom"],
  tab_selected: ["Top", "Right", "Bottom", "Left"],
  toolbar: ["Bottom"],
  toolbar_field: ["Top", "Right", "Bottom", "Left"],
  popup: ["Top", "Right", "Bottom", "Left"],
  sidebar: ["Right"],
};

export class BrowserPreview {
  constructor() {
    this.mock = document.getElementById("browser_preview");
    this.appcontent = document.getElementById("appcontent");
    this.popup = document.getElementById("popup");
  }

  /**
   *
   * @param {string} part
   * @param {Color} color
   * @param {boolean} enabled
   */
  static colorPart(part, color, enabled) {
    const element = document.getElementById(part);
    element.style.backgroundColor = color?.css();

    const foregroundColor = color?.getForeground();

    if (part in PART_BORDERS) {
      const borders = PART_BORDERS[part];
      for (const border of borders) {
        element.style[
          `border${border}`
        ] = `1px solid ${foregroundColor?.css()}`;
      }
    }

    if (enabled) {
      element.style.backgroundImage = `
        repeating-linear-gradient(
          -45deg,
          color-mix(in srgb, ${foregroundColor?.css()} 0%, transparent) 0 5px,
          color-mix(in srgb, ${foregroundColor?.css()} 25%, transparent) 5px 10px
        )`;
    } else {
      element.style.backgroundImage = "unset";
    }

    if (part === "toolbar") {
      const buttons = document.getElementsByClassName("toolbar_button");
      for (const placeholder of Array.from(buttons)) {
        placeholder.style.backgroundColor = foregroundColor?.css();
      }
    }
  }

  showPopup() {
    this.popup.classList.toggle("hidden", false);
  }

  hidePopup() {
    this.popup.classList.toggle("hidden", true);
  }

  showRickroll() {
    this.hidePopup();
    const img = document.createElement("img");
    img.id = "rickroll";
    img.src = `https://raw.githubusercontent.com/aminought/storage/main/egg.gif`;
    this.appcontent.appendChild(img);
  }

  hideRickroll(img) {
    this.appcontent.removeChild(img);
    this.showPopup();
  }

  rickroll() {
    const img = document.getElementById("rickroll");
    if (img) {
      this.hideRickroll(img);
    } else {
      this.showRickroll();
    }
  }

  onClick(callback) {
    this.mock.addEventListener("click", callback);
  }

  onContextMenu(callback) {
    this.mock.addEventListener("contextmenu", callback);
  }
}
