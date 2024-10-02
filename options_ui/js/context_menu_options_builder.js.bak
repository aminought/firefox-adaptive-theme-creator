import { BACKGROUND_SOURCE } from "../../shared/constants.js";
import {
  createNumberDropdown,
  createStringDropdown,
} from "./dropdown/dropdown_utils.js";
// import { BrowserParts } from "../../shared/browser_parts.js";
import { ColorPicker } from "./color_picker.js";
import { Localizer } from "./utils/localizer.js";
import { Options } from "../../shared/options.js";
import { PopupController } from "./popup_controller.js";
import { setBackgroundColor } from "./utils/html.js";

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
    // return this.#createOption(
    //   partKey,
    //   ["option"],
    //   "inheritFrom",
    //   (inputId, value) =>
    //     this.#createStringDropdownElement(
    //       partKey,
    //       inputId,
    //       BrowserParts.getInheritances(this.part),
    //       value
    //     )
    // );
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
        this.#createStringDropdownElement(
          partKey,
          inputId,
          Object.values(BACKGROUND_SOURCE),
          value
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
        this.#createNumberDropdownElement(
          partKey,
          inputId,
          0.1,
          1.0,
          0.1,
          value
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
        this.#createNumberDropdownElement(
          partKey,
          inputId,
          0.0,
          5.0,
          0.5,
          value
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
        this.#createNumberDropdownElement(
          partKey,
          inputId,
          0.0,
          5.0,
          0.5,
          value
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
   * @param {string[]} values
   * @param {string} value
   * @returns {HTMLElement}
   */
  #createStringDropdownElement(partKey, inputId, values, value) {
    const dropdown = createStringDropdown(inputId, values);
    dropdown.value = value;

    dropdown.onChange = (newValue) => {
      this.options.setPartOption(this.part, partKey, newValue);
      this.repositionContextMenu();
    };

    return dropdown.element;
  }

  /**
   *
   * @param {string} partKey
   * @param {string} inputId
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @param {string} value
   * @returns {HTMLElement}
   */
  #createNumberDropdownElement(partKey, inputId, start, end, step, value) {
    const dropdown = createNumberDropdown(inputId, start, end, step);
    dropdown.value = value;

    dropdown.onChange = (newValue) => {
      this.options.setPartOption(this.part, partKey, newValue);
      this.repositionContextMenu();
    };

    return dropdown.element;
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
    setBackgroundColor(colorPreview, value);

    colorPreview.onclick = (event) => {
      event.stopPropagation();
      PopupController.popFor(event.target);
      const colorPicker = new ColorPicker(this.parent, value, (color) => {
        setBackgroundColor(colorPreview, color.rgbaString);
        this.options.setPartOption(this.part, partKey, color.rgbaString);
      });

      PopupController.push(colorPicker, event.clientX, event.clientY);
    };

    return colorPreview;
  }
}
