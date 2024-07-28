import { addNumberOptions, addStringOptions } from "./html.js";
import { Localizer } from "./localizer.js";
import { Options } from "./options.js";

export class ContextMenu {
  static menu = document.getElementById("context_menu");
  static title = document.getElementById("context_menu_title");
  static customEnabled = document.getElementById("part_custom_enabled");
  static source = document.getElementById("part_source");
  static saturationLimit = document.getElementById("part_saturation_limit");
  static darkness = document.getElementById("part_darkness");
  static brightness = document.getElementById("part_brightness");

  static isOpened() {
    return !ContextMenu.menu.classList.contains("hidden");
  }

  static open() {
    ContextMenu.menu.classList.toggle("hidden", false);
  }

  static close() {
    ContextMenu.menu.classList.toggle("hidden", true);
  }

  static positionInside = (parent, clientX, clientY) => {
    const menuRect = this.menu.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    if (clientY + menuRect.height > parentRect.bottom) {
      this.menu.style.top = `${clientY - menuRect.height}px`;
    } else {
      this.menu.style.top = `${clientY}px`;
    }
    if (clientX + menuRect.width > parentRect.right) {
      this.menu.style.left = `${clientX - menuRect.width}px`;
    } else {
      this.menu.style.left = `${clientX}px`;
    }
  };

  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
    addStringOptions("#part_source", Object.values(Options.SOURCES));
    addNumberOptions("#part_saturation_limit", 0.1, 1.0, 0.1);
    addNumberOptions("#part_darkness", 0.0, 5.0, 0.5);
    addNumberOptions("#part_brightness", 0.0, 5.0, 0.5);
  }

  /**
   *
   * @param {string} part
   */
  setPart(part) {
    ContextMenu.title.innerHTML = Localizer.getMessage(part);
    this.loadFromOptions(part);
    this.setupListeners(part);
  }

  /**
   *
   * @param {string} part
   */
  loadFromOptions(part) {
    const partOptions = this.options.getPartOptions(part);
    ContextMenu.customEnabled.checked = partOptions.customEnabled;
    ContextMenu.source.value = partOptions.source;
    ContextMenu.saturationLimit.value = partOptions.saturationLimit;
    ContextMenu.darkness.value = partOptions.darkness;
    ContextMenu.brightness.value = partOptions.brightness;
  }

  /**
   *
   * @param {string} part
   */
  setupListeners(part) {
    ContextMenu.customEnabled.onclick = (e) =>
      this.saveChecked(e, part, "custom_enabled");
    ContextMenu.source.onchange = (e) => this.saveValue(e, part, "source");
    ContextMenu.saturationLimit.onchange = (e) =>
      this.saveValue(e, part, "saturation_limit");
    ContextMenu.darkness.onchange = (e) => this.saveValue(e, part, "darkness");
    ContextMenu.brightness.onchange = (e) =>
      this.saveValue(e, part, "brightness");
  }

  /**
   *
   * @param {Event} event
   * @param {string} part
   * @param {string} key
   */
  async saveChecked(event, part, key) {
    await this.options.setPartOption(part, key, event.target.checked);
  }

  /**
   *
   * @param {Event} event
   * @param {string} part
   * @param {string} key
   */
  async saveValue(event, part, key) {
    await this.options.setPartOption(part, key, event.target.value);
  }
}
