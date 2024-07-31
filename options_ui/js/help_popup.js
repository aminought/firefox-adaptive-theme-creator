import { Localizer } from "./utils/localizer.js";
import { positionAbove } from "./utils/html.js";

export class HelpPopup {
  /**
   *
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    this.parent = parent;
    this.wrapper = HelpPopup.#createWrapper();
  }

  static #createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.className = "help_popup";

    wrapper.appendChild(this.#createParagraph("help1Greetings"));
    wrapper.appendChild(this.#createParagraph("help2Intro"));
    wrapper.appendChild(this.#createParagraph("help3Description"));
    wrapper.appendChild(this.#createParagraph("help4Conclusion"));
    wrapper.appendChild(this.#createParagraph("help5Contacts"));

    return wrapper;
  }

  /**
   *
   * @param {string} i18nMessage
   * @returns {HTMLParagraphElement}
   */
  static #createParagraph(i18nMessage) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = Localizer.getMessage(i18nMessage);
    return paragraph;
  }

  /**
   *
   * @param {HTMLElement} target
   */
  draw(target) {
    this.parent.appendChild(this.wrapper);
    positionAbove(this.wrapper, this.parent, target);
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
