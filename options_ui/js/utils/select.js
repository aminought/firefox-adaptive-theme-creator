import { Localizer } from "./localizer.js";
import { Popup } from "../ui_elements/popup.js";
import { Select } from "../ui_elements/select.js";
import { SelectItem } from "../ui_elements/select_item.js";

/**
 *
 * @param {string} currentValue
 * @param {string[]} values
 * @param {CallableFunction} localize
 * @param {object} params
 * @param {string} params.id
 * @param {Array<string>} params.classList
 * @param {Array<string>} params.itemClassList
 * @param {string} params.alignmentX
 * @param {string} params.alignmentY
 * @param {string} params.orientation
 * @returns {Select}
 */
export const createStringSelect = (
  currentValue,
  values,
  localize = Localizer.getMessage,
  {
    id = null,
    classList = [],
    itemClassList = [],
    alignmentX = Popup.ALIGNMENT_X.CENTER,
    alignmentY = Popup.ALIGNMENT_Y.BELOW,
    orientation = Popup.ORIENTATION.HORIZONTAL,
  } = {}
) => {
  const select = new Select({
    id,
    classList,
    alignmentX,
    alignmentY,
    orientation,
  });
  for (const value of values) {
    const label = localize(value);
    const selectItem = new SelectItem(label, value, select.popup, {
      classList: itemClassList,
    });
    select.appendChild(selectItem);
  }
  return select.setValue(currentValue);
};

/**
 *
 * @param {number} currentValue
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {object} params
 * @param {string} params.id
 * @param {Array<string>} params.classList
 * @param {Array<string>} params.itemClassList
 * @param {string} params.alignmentX
 * @param {string} params.alignmentY
 * @param {string} params.orientation
 * @returns {Select}
 */
export const createNumberSelect = (
  currentValue,
  start,
  end,
  step,
  {
    id = null,
    classList = [],
    itemClassList = [],
    alignmentX = Popup.ALIGNMENT_X.CENTER,
    alignmentY = Popup.ALIGNMENT_Y.BELOW,
    orientation = Popup.ORIENTATION.HORIZONTAL,
  } = {}
) => {
  const select = new Select({
    id,
    classList,
    alignmentX,
    alignmentY,
    orientation,
  });
  for (let i = start; i <= end; i += step) {
    const value = i.toFixed(1);
    const selectItem = new SelectItem(value, value, select.popup, {
      classList: itemClassList,
    });
    select.appendChild(selectItem);
  }
  return select.setValue(currentValue);
};
