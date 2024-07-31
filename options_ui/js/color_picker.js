import { PopupController } from "./popup_controller.js";
import { setPosition } from "./utils/html.js";

export class ColorPicker {
  /**
   *
   * @param {string} color
   * @param {function(string):void} callback
   */
  constructor(color, callback) {
    this.element = ColorPicker.createElement();
    this.picker = ColorPicker.createPicker(this.element, color, callback);
  }

  static createElement() {
    const element = document.createElement("div");
    element.style.position = "absolute";
    return element;
  }

  /**
   *
   * @param {HTMLElement} parent
   * @param {string} color
   * @param {function(string):void} callback
   */
  static createPicker(parent, color, callback) {
    const picker = new Picker({ parent, popup: false, alpha: false, color });
    picker.onChange = callback;
    picker.onDone = () => PopupController.pop();
    return picker;
  }

  /**
   *
   * @param {HTMLElement} parent
   * @param {number} clientX
   * @param {number} clientY
   */
  draw(parent, clientX, clientY) {
    parent.appendChild(this.element);
    setPosition(this.element, parent, clientX, clientY);
  }

  /**
   *
   * @returns {boolean}
   */
  exists() {
    return Boolean(this.element.parentElement);
  }

  remove() {
    if (this.exists()) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  contains(element) {
    return this.element.contains(element);
  }
}
