import { addNumberOptions, addStringOptions } from "./html.js";
import { BrowserParts } from "./browser_parts.js";
import { ColorPicker } from "./color_picker.js";
import { Localizer } from "./localizer.js";
import { Options } from "./options.js";
import { PopupController } from "./popup_controller.js";

export class PartContextMenu {
  /**
   *
   * @param {Options} options
   * @param {string} part
   */
  constructor(options, part) {
    this.id = `${part}_context_menu`;
    this.part = part;
    this.options = options;
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  create() {
    const menuElement = document.createElement("div");
    menuElement.id = this.id;
    menuElement.className = "context_menu";

    const titleElement = this.#createTitle();
    menuElement.appendChild(titleElement);

    const customEnabledElement = this.#createOption(
      "inheritance",
      ["option"],
      "inheritFrom",
      (partKey, inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addStringOptions(
            inputElement,
            BrowserParts.getInheritances(this.part)
          )
        )
    );
    menuElement.appendChild(customEnabledElement);

    const sourceElement = this.#createOption(
      "source",
      ["option", "custom_option"],
      "source",
      (partKey, inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addStringOptions(inputElement, Object.values(Options.SOURCES))
        )
    );
    menuElement.appendChild(sourceElement);

    const colorPreviewElement = this.#createOption(
      "color",
      ["option", "custom_option"],
      "own_color",
      (partKey, inputId, value) =>
        this.#createColorPreviewElement(partKey, inputId, value)
    );
    menuElement.appendChild(colorPreviewElement);

    const saturationLimitElement = this.#createOption(
      "saturation_limit",
      ["option", "custom_option"],
      "saturationLimit",
      (partKey, inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addNumberOptions(inputElement, 0.1, 1.0, 0.1)
        )
    );
    menuElement.appendChild(saturationLimitElement);

    const darknessElement = this.#createOption(
      "darkness",
      ["option", "custom_option"],
      "darkness",
      (partKey, inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addNumberOptions(inputElement, 0.0, 5.0, 0.5)
        )
    );
    menuElement.appendChild(darknessElement);

    const brightnessElement = this.#createOption(
      "brightness",
      ["option", "custom_option"],
      "brightness",
      (partKey, inputId, value) =>
        this.#createSelectElement(partKey, inputId, value, (inputElement) =>
          addNumberOptions(inputElement, 0.0, 5.0, 0.5)
        )
    );
    menuElement.appendChild(brightnessElement);

    return menuElement;
  }

  /**
   *
   * @returns {HTMLLabelElement}
   */
  #createTitle() {
    const titleElement = document.createElement("label");
    titleElement.className = "context_menu_title";
    titleElement.innerHTML = Localizer.getMessage(this.part);
    return titleElement;
  }

  /**
   *
   * @param {string} partKey
   * @param {string[]} classList
   * @param {string} i18nMessage
   * @param {function(string, string, any):HTMLElement} createInputElement
   * @returns {HTMLDivElement}
   */
  #createOption(partKey, classList, i18nMessage, createInputElement) {
    const optionElement = document.createElement("div");
    for (const token of classList) {
      optionElement.classList.add(token);
    }

    const inputId = `${this.part}_${partKey}`;

    const labelElement = PartContextMenu.#createOptionLabel(
      inputId,
      i18nMessage
    );
    optionElement.appendChild(labelElement);

    const value = this.options.getPartOption(this.part, partKey);
    const inputElement = createInputElement(partKey, inputId, value);

    optionElement.appendChild(inputElement);

    return optionElement;
  }

  /**
   *
   * @param {string} inputId
   * @param {string} i18nMessage
   * @returns {HTMLLabelElement}
   */
  static #createOptionLabel(inputId, i18nMessage) {
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", inputId);
    labelElement.innerText = Localizer.getMessage(i18nMessage);
    return labelElement;
  }

  /**
   *
   * @param {string} partKey
   * @param {string} inputId
   * @param {boolean} value
   * @returns {HTMLElement}
   */
  // eslint-disable-next-line no-unused-private-class-members
  #createCheckboxElement(partKey, inputId, value) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = inputId;
    checkbox.checked = value;
    checkbox.setAttribute("data-value", value);

    checkbox.onclick = () => {
      this.options.setPartOption(this.part, partKey, checkbox.checked);
      checkbox.setAttribute("data-value", checkbox.checked);
    };

    return checkbox;
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
      const colorPicker = new ColorPicker(value, (color) => {
        colorPreview.style.backgroundColor = color.rgbaString;
        this.options.setPartOption(this.part, partKey, color.rgbaString);
        colorPreview.setAttribute("data-value", color.rgbaString);
      });

      const body = document.querySelector("body");
      PopupController.push(colorPicker, body, event.clientX, event.clientY);
    };

    return colorPreview;
  }
}
