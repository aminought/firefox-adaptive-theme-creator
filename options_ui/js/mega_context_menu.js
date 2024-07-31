// eslint-disable-next-line no-unused-vars
import { PartContextMenu } from "./part_context_menu.js";
import { setPosition } from "./utils/html.js";

export class MegaContextMenu {
  /**
   *
   * @param {PartContextMenu[]} menus
   */
  constructor(menus) {
    this.menus = menus;
    this.element = MegaContextMenu.createElement(menus);
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  static createElement(menus) {
    const element = document.createElement("div");
    element.id = "mega_context_menu";
    for (const menu of menus) {
      const menuElement = menu.create();
      element.appendChild(menuElement);
    }
    return element;
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
    return Array.from(this.element.children).some((child) =>
      child.contains(element)
    );
  }
}
