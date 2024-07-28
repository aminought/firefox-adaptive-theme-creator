import { addNumberOptions, addStringOptions } from "./html.js";
import { Localizer } from "./localizer.js";
import { Options } from "./options.js";

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
      "custom_enabled",
      "input",
      "checkbox",
      null,
      null,
      "specialSettings"
    );
    menuElement.appendChild(customEnabledElement);

    const sourceElement = this.#createOption(
      "source",
      "select",
      null,
      "custom_option",
      (inputElement) =>
        addStringOptions(inputElement, Object.values(Options.SOURCES)),
      "source"
    );
    menuElement.appendChild(sourceElement);

    const saturationLimitElement = this.#createOption(
      "saturation_limit",
      "select",
      null,
      "custom_option",
      (inputElement) => addNumberOptions(inputElement, 0.1, 1.0, 0.1),
      "saturationLimit"
    );
    menuElement.appendChild(saturationLimitElement);

    const darknessElement = this.#createOption(
      "darkness",
      "select",
      null,
      "custom_option",
      (inputElement) => addNumberOptions(inputElement, 0.0, 5.0, 0.5),
      "darkness"
    );
    menuElement.appendChild(darknessElement);

    const brightnessElement = this.#createOption(
      "brightness",
      "select",
      null,
      "custom_option",
      (inputElement) => addNumberOptions(inputElement, 0.0, 5.0, 0.5),
      "brightness"
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
   * @param {string} key
   * @param {string} tag
   * @param {string} type
   * @param {string?} additionalClass
   * @param {function?} fillSelect
   * @param {string} i18nMessage
   * @returns {HTMLDivElement}
   */
  #createOption(key, tag, type, additionalClass, fillSelect, i18nMessage) {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    if (additionalClass) {
      optionElement.classList.add(additionalClass);
    }

    const inputId = `${this.part}_${key}`;

    const labelElement = PartContextMenu.#createOptionLabel(
      inputId,
      i18nMessage
    );
    optionElement.appendChild(labelElement);

    const inputElement = this.#createOptionInput(
      key,
      inputId,
      tag,
      type,
      fillSelect
    );
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
   * @param {string} key
   * @param {string} inputId
   * @param {string} tag
   * @param {string=} type
   * @param {function=} fillSelect
   * @returns {HTMLElement}
   */
  #createOptionInput(key, inputId, tag, type, fillSelect) {
    const inputElement = document.createElement(tag);
    if (type) {
      inputElement.type = type;
    }
    inputElement.id = inputId;

    if (type === "checkbox") {
      inputElement.checked = this.options.getPartOption(this.part, key);
      inputElement.onclick = (e) =>
        this.options.setPartOption(this.part, key, e.target.checked);
    } else {
      if (tag === "select" && fillSelect) {
        fillSelect(inputElement);
      }
      inputElement.value = this.options.getPartOption(this.part, key);
      inputElement.onchange = (e) =>
        this.options.setPartOption(this.part, key, e.target.value);
    }

    return inputElement;
  }
}
