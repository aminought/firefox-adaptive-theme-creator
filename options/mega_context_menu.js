// eslint-disable-next-line no-unused-vars
import { PartContextMenu } from "./part_context_menu.js";

export class MegaContextMenu {
  static ID = "mega_context_menu";
  /**
   *
   * @param {PartContextMenu[]} menus
   */
  constructor(menus) {
    this.menus = menus;
    this.megaMenuElement = this.#create();
  }

  /**
   *
   * @returns {boolean}
   */
  static exists() {
    const megaMenuElement = document.getElementById(MegaContextMenu.ID);
    return Boolean(megaMenuElement);
  }

  static remove() {
    const megaMenuElement = document.getElementById(MegaContextMenu.ID);
    megaMenuElement.parentElement.removeChild(megaMenuElement);
  }

  /**
   *
   * @param {HTMLElement} parent
   * @param {number} clientX
   * @param {number} clientY
   */
  draw(parent, clientX, clientY) {
    parent.appendChild(this.megaMenuElement);

    const rect = this.megaMenuElement.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    if (clientY + rect.height > parentRect.bottom) {
      this.megaMenuElement.style.top = `${
        parentRect.bottom - rect.height - 10
      }px`;
    } else {
      this.megaMenuElement.style.top = `${clientY}px`;
    }
    if (clientX + rect.width > parentRect.right) {
      this.megaMenuElement.style.left = `${
        parentRect.right - rect.width - 10
      }px`;
    } else {
      this.megaMenuElement.style.left = `${clientX}px`;
    }
  }

  /**
   * @returns {HTMLDivElement}
   */
  #create() {
    const megaMenuElement = document.createElement("div");
    megaMenuElement.id = MegaContextMenu.ID;
    for (const menu of this.menus) {
      const menuElement = menu.create();
      megaMenuElement.appendChild(menuElement);
    }
    return megaMenuElement;
  }
}
