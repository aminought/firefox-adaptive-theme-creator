import { Div } from "./div.js";
import { Label } from "./label.js";
import { Popup } from "./popup.js";
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
    this.popup = new Popup(
      this,
      Popup.ALIGNMENT_X.CENTER,
      Popup.ALIGNMENT_Y.BELOW,
      Popup.ORIENTATION.VERTICAL,
      {
        classList: ["dropdown_popup"],
      }
    );
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
      this.popup.push(event);
    };

    return this.element;
  }
}
