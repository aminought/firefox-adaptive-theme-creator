import { Localizer } from "./localizer.js";
import { ORIENTATION } from "../ui_elements/select_popup.js";
import { POSITION } from "./positions.js";
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
 * @param {string} params.posiition
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
    position = POSITION.BELOW_ALIGN_CENTER,
    orientation = ORIENTATION.HORIZONTAL,
  } = {}
) => {
  const select = new Select({
    id,
    classList,
    orientation,
    popupPosition: position,
  });
  for (const value of values) {
    const label = localize(value);
    const selectItem = new SelectItem(label, value, {
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
 * @param {string} params.position
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
    position = POSITION.BELOW_ALIGN_LEFT,
    orientation = ORIENTATION.HORIZONTAL,
  } = {}
) => {
  const select = new Select({
    id,
    classList,
    orientation,
    popupPosition: position,
  });
  for (let i = start; i <= end; i += step) {
    const value = i.toFixed(1);
    const selectItem = new SelectItem(value, value, {
      classList: itemClassList,
    });
    select.appendChild(selectItem);
  }
  return select.setValue(currentValue);
};
