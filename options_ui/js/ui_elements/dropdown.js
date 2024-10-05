import { Div } from "./div.js";
import { DropdownPopup } from "./dropdown_popup.js";
import { Label } from "./label.js";
import { POSITION } from "../utils/positions.js";
import { PopupController } from "../popup_controller.js";
import { SelectArrow } from "./select_arrow.js";

export class Dropdown extends Div {
  /**
   *
   * @param {string} label
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.position
   */
  constructor(
    label,
    { id = null, classList = [], position = POSITION.BELOW_ALIGN_CENTER } = {}
  ) {
    super({ id, classList: ["dropdown", ...classList] });
    this.position = position;
    this.popup = new DropdownPopup();
    this.label = new Label(label, { classList: ["dropdown_label"] });
    this.arrow = new SelectArrow();
  }

  /**
   *
   * @param {UIElement} element
   */
  appendChild(element) {
    this.popup.appendChild(element);
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.appendChild(this.label.draw());
    this.element.appendChild(this.arrow.draw());

    this.element.onclick = (event) => {
      event.stopPropagation();
      if (!PopupController.popFor(this.element)) {
        PopupController.push(event, this.popup, this.element, this.position);
      }
    };

    return this.element;
  }
}
