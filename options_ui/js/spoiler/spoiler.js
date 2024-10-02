import { Label } from "../label.js";
import { UIElement } from "../ui_element.js";
import { SpoilerPopup } from "./spoiler_popup.js";
import { DropdownArrow } from "../dropdown/dropdown_arrow.js";
import { PopupController } from "../popup_controller.js";
import { POSITIONS } from "../utils/positions.js";

export class Spoiler extends UIElement {
  /**
   *
   * @param {string} label
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(label, { id = "", classList = [] } = {}) {
    super({ id, classList: ["spoiler", ...classList] });

    this.popup = new SpoilerPopup();
    this.label = new Label(label, { classList: ["spoiler_label"] });
    this.arrow = new DropdownArrow();
  }

  /**
   *
   * @param {UIElement} element
   */
  appendChild = (element) => {
    this.popup.appendChild(element);
    return this;
  };

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    element.appendChild(this.label.draw());
    element.appendChild(this.arrow.draw());

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, POSITIONS.BELOW);
      }
    };

    this.element = element;
    return element;
  };
}
