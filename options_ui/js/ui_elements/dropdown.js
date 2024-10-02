import { Div } from "./div.js";
import { DropdownPopup } from "./dropdown_popup.js";
import { Label } from "./label.js";
import { POSITIONS } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { SelectArrow } from "./select_arrow.js";

export class Dropdown extends Div {
  /**
   *
   * @param {string} label
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(label, { id = null, classList = [] } = {}) {
    super({ id, classList: ["dropdown", ...classList] });

    this.popup = new DropdownPopup();
    this.label = new Label(label, { classList: ["dropdown_label"] });
    this.arrow = new SelectArrow();
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
   * @param {HTMLElement} element
   */
  customize = (element) => {
    element.appendChild(this.label.draw());
    element.appendChild(this.arrow.draw());

    element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(element)) {
        PopupController.push(this.popup, element, POSITIONS.BELOW);
      }
    };
  };
}
