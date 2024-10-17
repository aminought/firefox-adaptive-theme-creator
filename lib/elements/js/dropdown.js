import { ArrowDown } from "./arrow_down.js";
import { Div } from "./div.js";
import { DropdownPopup } from "./dropdown_popup.js";
import { Element } from "./element.js";
import { Input } from "./mutators/input.js";
import { Label } from "./label.js";

export class Dropdown extends Div {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ id, classList: ["dropdown", ...classList] });

    this.label = new Label({ classList: ["dropdown_label"] });
    this.arrow = new ArrowDown();

    this.appendChild(this.label);
    this.appendChild(this.arrow);

    this.dropdownPopup = new DropdownPopup(this);

    this.addOnClick((event) => {
      event.stopPropagation();
      this.dropdownPopup.popup.push(event);
    });
  }

  /**
   *
   * @param {string} text
   * @returns {Dropdown}
   */
  setText(text) {
    this.label.setText(text);
    return this;
  }

  /**
   *
   * @param {Element} element
   * @returns {Dropdown}
   */
  appendDropdownItem(element) {
    this.dropdownPopup.appendChild(element);
    return this;
  }

  /**
   *
   * @param {Array<Element>} elements
   * @returns {Dropdown}
   */
  appendDropdownItems(elements) {
    for (const element of elements) {
      this.appendDropdownItem(element);
    }
    return this;
  }
}
