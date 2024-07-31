import { addStringOptions, setPosition } from "./utils/html.js";
import { ContextMenuOptionsBuilder } from "./context_menu_options_builder.js";
// eslint-disable-next-line no-unused-vars
import { Options } from "../../shared/options.js";

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
    const partsElement = document.createElement("select");
    partsElement.className = "context_menu_parts";
    addStringOptions(partsElement, this.parts);

    [partsElement.value] = this.parts;

    partsElement.onchange = (event) => {
      event.stopPropagation();
      this.wrapper.removeChild(this.partOptionsElement);
      const optionsBuilder = new ContextMenuOptionsBuilder(
        this.options,
        this.parent,
        partsElement.value,
        () => this.reposition()
      );
      this.partOptionsElement = optionsBuilder.createPartOptionsElement();
      this.wrapper.appendChild(this.partOptionsElement);
      this.reposition();
    };

    return partsElement;
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

  reposition() {
    const rect = this.wrapper.getBoundingClientRect();
    setPosition(this.wrapper, this.parent, rect.left, rect.top);
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
