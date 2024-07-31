import { PopupController } from "./popup_controller.js";
import { setPosition } from "./utils/html.js";

export class ColorPicker {
  /**
   *
   * @param {HTMLElement} parent
   * @param {string} color
   * @param {function(string):void} callback
   */
  constructor(parent, color, callback) {
    this.parent = parent;
    this.wrapper = ColorPicker.createWrapper();
    this.picker = ColorPicker.createPicker(this.wrapper, color, callback);
  }

  static createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.className = "color_picker_wrapper";
    wrapper.style.position = "absolute";
    return wrapper;
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
   * @param {number} clientX
   * @param {number} clientY
   */
  draw(clientX, clientY) {
    this.parent.appendChild(this.wrapper);
    setPosition(this.wrapper, this.parent, clientX, clientY);
  }

  /**
   *
   * @returns {boolean}
   */
  exists() {
    return Boolean(this.wrapper.parentElement);
  }

  remove() {
    if (this.exists()) {
      this.wrapper.parentElement.removeChild(this.wrapper);
    }
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  contains(element) {
    return this.wrapper.contains(element);
  }
}
