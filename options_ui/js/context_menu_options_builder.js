import { addNumberOptions, addStringOptions } from "./utils/html.js";
import { BrowserParts } from "../../shared/browser_parts.js";
import { ColorPicker } from "./color_picker.js";
import { Localizer } from "./utils/localizer.js";
import { Options } from "../../shared/options.js";
import { PopupController } from "./popup_controller.js";

export class ContextMenuOptionsBuilder {
  /**
   *
   * @param {Options} options
   * @param {HTMLElement} parent
   * @param {string} part
   * @param {function():void} repositionContextMenu
   */
  constructor(options, parent, part, repositionContextMenu) {
    this.options = options;
    this.parent = parent;
    this.part = part;
    this.repositionContextMenu = repositionContextMenu;
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  createPartOptionsElement() {
    const partOptionsElement = document.createElement("div");
    partOptionsElement.id = this.id;
    partOptionsElement.className = "context_menu_options";

    partOptionsElement.appendChild(this.#createInheritanceOption());
    partOptionsElement.appendChild(this.#createSourceOption());
    partOptionsElement.appendChild(this.#createColorOption());
    partOptionsElement.appendChild(this.#createSaturationLimitOption());
    partOptionsElement.appendChild(this.#createDarknessOption());
    partOptionsElement.appendChild(this.#createBrightnessOption());

    return partOptionsElement;
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createInheritanceOption() {
    const partKey = "inheritance";
    return this.#createOption(
      partKey,
      ["option"],
      "inheritFrom",
      (inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addStringOptions(
            inputElement,
            BrowserParts.getInheritances(this.part)
          )
        )
    );
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createSourceOption() {
    const partKey = "source";
    return this.#createOption(
      partKey,
      ["option", "option_inherit_from_off"],
      "source",
      (inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addStringOptions(inputElement, Object.values(Options.SOURCES))
        )
    );
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createColorOption() {
    const partKey = "color";
    return this.#createOption(
      "color",
      ["option", "option_inherit_from_off", "option_source_own_color"],
      "color",
      (inputId, value) =>
        this.#createColorPreviewElement(partKey, inputId, value)
    );
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createSaturationLimitOption() {
    const partKey = "saturation_limit";
    return this.#createOption(
      partKey,
      ["option", "option_inherit_from_off"],
      "saturationLimit",
      (inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addNumberOptions(inputElement, 0.1, 1.0, 0.1)
        )
    );
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createDarknessOption() {
    const partKey = "darkness";
    return this.#createOption(
      partKey,
      ["option", "option_inherit_from_off"],
      "darkness",
      (inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addNumberOptions(inputElement, 0.0, 5.0, 0.5)
        )
    );
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createBrightnessOption() {
    const partKey = "brightness";
    return this.#createOption(
      partKey,
      ["option", "option_inherit_from_off"],
      "brightness",
      (inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addNumberOptions(inputElement, 0.0, 5.0, 0.5)
        )
    );
  }

  /**
   *
   * @param {string} partKey
   * @param {string[]} classList
   * @param {string} i18nMessage
   * @param {function(string, any):HTMLElement} createInputElement
   * @returns {HTMLDivElement}
   */
  #createOption(partKey, classList, i18nMessage, createInputElement) {
    const optionElement = document.createElement("div");
    for (const token of classList) {
      optionElement.classList.add(token);
    }

    const inputId = `${this.part}_${partKey}`;
    const value = this.options.getPartOption(this.part, partKey);

    optionElement.appendChild(
      ContextMenuOptionsBuilder.#createLabelElement(inputId, i18nMessage)
    );
    optionElement.appendChild(ContextMenuOptionsBuilder.#createSeparator());
    optionElement.appendChild(createInputElement(inputId, value));

    return optionElement;
  }

  /**
   *
   * @param {string} inputId
   * @param {string} i18nMessage
   * @returns {HTMLLabelElement}
   */
  static #createLabelElement(inputId, i18nMessage) {
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", inputId);
    labelElement.innerText = Localizer.getMessage(i18nMessage);
    return labelElement;
  }

  static #createSeparator() {
    const separator = document.createElement("div");
    separator.className = "separator";
    return separator;
  }

  /**
   *
   * @param {string} partKey
   * @param {string} inputId
   * @param {any} value
   * @param {function(HTMLSelectElement):void} fillSelect
   * @returns {HTMLElement}
   */
  #createSelectElement(partKey, inputId, value, fillSelect) {
    const select = document.createElement("select");
    fillSelect(select);
    select.id = inputId;
    select.value = value;
    select.setAttribute("data-value", value);

    select.onchange = () => {
      this.options.setPartOption(this.part, partKey, select.value);
      select.setAttribute("data-value", select.value);
      this.repositionContextMenu();
    };

    return select;
  }

  /**
   *
   * @param {string} partKey
   * @param {string} inputId
   * @param {string} value
   * @returns {HTMLElement}
   */
  #createColorPreviewElement(partKey, inputId, value) {
    const colorPreview = document.createElement("div");
    colorPreview.id = inputId;
    colorPreview.className = "color_preview";
    colorPreview.style.backgroundColor = value;
    colorPreview.setAttribute("data-value", value);

    colorPreview.onclick = (event) => {
      event.stopPropagation();
      PopupController.popFor(event.target);
      const colorPicker = new ColorPicker(this.parent, value, (color) => {
        colorPreview.style.backgroundColor = color.rgbaString;
        this.options.setPartOption(this.part, partKey, color.rgbaString);
        colorPreview.setAttribute("data-value", color.rgbaString);
      });

      PopupController.push(colorPicker, event.clientX, event.clientY);
    };

    return colorPreview;
  }
}
