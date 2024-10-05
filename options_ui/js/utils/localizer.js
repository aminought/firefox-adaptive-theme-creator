import { INHERITANCE } from "../../../shared/constants.js";

export class Localizer {
  /**
   *
   * @param {string} messageName
   * @returns {string}
   */
  static getMessage(messageName) {
    return browser.i18n.getMessage(messageName);
  }

  /**
   *
   * @param {string} backgroundSource
   * @returns {string}
   */
  static localizeBackgroundSource(backgroundSource) {
    return Localizer.getMessage(`background_source.${backgroundSource}`);
  }

  /**
   *
   * @param {string} button
   * @returns {string}
   */
  static localizeButton(button) {
    return Localizer.getMessage(`button.${button}`);
  }

  /**
   *
   * @param {string} foregroundSource
   * @returns {string}
   */
  static localizeForegroundSource(foregroundSource) {
    return Localizer.getMessage(`foreground_source.${foregroundSource}`);
  }

  /**
   *
   * @param {string} inheritance
   * @returns {string}
   */
  static localizeInheritance(inheritance) {
    if (inheritance in INHERITANCE) {
      return Localizer.getMessage(`inheritance.${inheritance}`);
    }
    return Localizer.localizePart(inheritance);
  }

  /**
   *
   * @param {string} option
   * @returns {string}
   */
  static localizeOption(option) {
    const suffix = option.split(".").pop();
    return Localizer.getMessage(`option.${suffix}`);
  }

  /**
   *
   * @param {string} optionGroup
   * @returns {string}
   */
  static localizeOptionGroup(optionGroup) {
    const suffix = optionGroup.split(".").pop();
    return Localizer.getMessage(`option_group.${suffix}`);
  }

  /**
   *
   * @param {string} pageColorAlgo
   * @returns {string}
   */
  static localizePageColorAlgo(pageColorAlgo) {
    return Localizer.getMessage(`page_color_algo.${pageColorAlgo}`);
  }

  /**
   *
   * @param {string} part
   * @returns {string}
   */
  static localizePart(part) {
    return Localizer.getMessage(`part.${part}`);
  }

  /**
   *
   * @param {string} triggerId
   * @returns {string}
   */
  static localizeTrigger(triggerId) {
    const trigger = triggerId.split(".").pop();
    return Localizer.getMessage(`trigger.${trigger}`);
  }

  /**
   *
   * @param {string} text
   * @returns {string}
   */
  static localizeStatusBar(text) {
    return Localizer.getMessage(`status_bar.${text}`);
  }
}
