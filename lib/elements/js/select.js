import { ArrowDown } from "./arrow_down.js";
import { Div } from "./div.js";
import { Input } from "./mutators/input.js";
import { Label } from "./label.js";
import { Popup } from "../elements.js";
import { SelectItem } from "./select_item.js";
import { SelectPopup } from "./select_popup.js";

export class Select extends Div {
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
    super({ id, classList: ["select", ...classList] });
    this.label = new Label({ classList: ["select_label"] });
    this.arrow = new ArrowDown();

    this.appendChild(this.label);
    this.appendChild(this.arrow);

    this.selectPopup = new SelectPopup(this, {
      classList: ["select_popup"],
      alignmentX,
      alignmentY,
      orientation,
    });

    this.addOnClick((event) => {
      event.stopPropagation();
      this.selectPopup.popup.push(event);
    });

    this.input = new Input(this);
  }

  /**
   *
   * @param {SelectItem} item
   * @returns {Select}
   */
  addItem(item) {
    item.addOnClick((event) => {
      event.stopPropagation();
      this.setLabel(item.getLabel()).setValue(item.getValue(), true);
      this.selectPopup.popup.pop();
    });
    this.selectPopup.appendChild(item);
    return this;
  }

  /**
   *
   * @param {string}
   * @returns {Select}
   */
  setLabel(text) {
    this.label.setText(text);
    return this;
  }

  /**
   *
   * @param {any} value
   * @param {boolean} trigger
   * @returns {Select}
   */
  setValue(value, trigger = false) {
    this.input.setValue(value, trigger);
    return this;
  }

  /**
   *
   * @param {function(any):void} callback
   * @returns {Select}
   */
  addOnChange(callback) {
    this.input.addOnChange(callback);
    return this;
  }
}
