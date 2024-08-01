import { ContextMenuOptionsBuilder } from "./context_menu_options_builder.js";
import { DropdownPopup } from "./dropdown/dropdown_popup.js";
// eslint-disable-next-line no-unused-vars
import { Options } from "../../shared/options.js";
import { createStringDropdown } from "./dropdown/dropdown_utils.js";
import { positionByCoords } from "./utils/html.js";

export class ContextMenu {
  /**
   *
   * @param {Options} options
   * @param {HTMLElement} parent
   * @param {string[]} parts
   */
  constructor(options, parent, parts) {
    this.options = options;
    this.parent = parent;
    this.parts = parts;
    this.wrapper = this.#createMenuElement();
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createMenuElement() {
    const menuElement = document.createElement("div");
    menuElement.className = "context_menu";

    menuElement.appendChild(this.#createPartsElement());

    const optionsBuilder = new ContextMenuOptionsBuilder(
      this.options,
      this.parent,
      this.parts[0],
      () => this.reposition()
    );
    this.partOptionsElement = optionsBuilder.createPartOptionsElement();
    menuElement.appendChild(this.partOptionsElement);

    return menuElement;
  }

  /**
   *
   * @returns {HTMLSelectElement}
   */
  #createPartsElement() {
    const partsDropdown = createStringDropdown(
      "context_menu_parts",
      this.parts,
      DropdownPopup.POSITION.below
    );
    [partsDropdown.value] = this.parts;

    partsDropdown.onChange = (value) => {
      this.wrapper.removeChild(this.partOptionsElement);
      const optionsBuilder = new ContextMenuOptionsBuilder(
        this.options,
        this.parent,
        value,
        () => this.reposition()
      );
      this.partOptionsElement = optionsBuilder.createPartOptionsElement();
      this.wrapper.appendChild(this.partOptionsElement);
      this.reposition();
    };

    return partsDropdown.element;
  }

  /**
   *
   * @param {number} clientX
   * @param {number} clientY
   */
  draw(clientX, clientY) {
    this.parent.appendChild(this.wrapper);
    positionByCoords(this.wrapper, this.parent, clientX, clientY);
  }

  reposition() {
    const rect = this.wrapper.getBoundingClientRect();
    positionByCoords(this.wrapper, this.parent, rect.left, rect.top);
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
