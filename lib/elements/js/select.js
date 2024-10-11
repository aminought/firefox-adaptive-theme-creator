import { Input } from "./input.js";
import { Label } from "./label.js";
import { Popup } from "./popup.js";
import { SelectArrow } from "./select_arrow.js";
import { SelectItem } from "./select_item.js";

export class Select extends Input {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   * @param {string} params.alignmentX
   * @param {string} params.alignmentY
   * @param {string} params.orientation
   */
  constructor({
    id = null,
    classList = [],
    alignmentX = Popup.ALIGNMENT_X.CENTER,
    alignmentY = Popup.ALIGNMENT_Y.BELOW,
    orientation = Popup.ORIENTATION.HORIZONTAL,
  } = {}) {
    super("", { id, classList: ["select", ...classList] });
    this.popup = new Popup(this, alignmentX, alignmentY, orientation, {
      classList: ["select_popup"],
    });
    this.label = new Label(this.value, { classList: ["select_label"] });
    this.arrow = new SelectArrow();
    this.values = {};
  }

  /**
   *
   * @returns {Select}
   */
  updateLabel() {
    this.label.setText(this.values[this.value]);
    return this;
  }

  /**
   *
   * @param {string | number} value
   * @returns {Select}
   */
  setValue(value) {
    Input.prototype.setValueInternal.call(this, value);
    return this.updateLabel();
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

  /**
   *
   * @param {SelectItem} selectItem
   * @returns {Select}
   */
  appendChild(selectItem) {
    this.popup.appendChild(selectItem);
    this.values[selectItem.value] = selectItem.label;

    selectItem.onClick = (value) => {
      this.setValue(value);
      this.onChange?.(value);
    };

    return this;
  }
}
