import { Localizer } from "./localizer.js";
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
 * @returns {Select}
 */
export const createStringSelect = (
  currentValue,
  values,
  localize = Localizer.getMessage,
  { id = null, className: classList = [] } = {}
) => {
  const select = new Select(currentValue, { id, classList });
  for (const value of values) {
    const label = localize(value);
    const selectItem = new SelectItem(label, value);
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
 * @returns {Select}
 */
export const createNumberSelect = (
  currentValue,
  start,
  end,
  step,
  { id = null, className: classList = [] } = {}
) => {
  const select = new Select(currentValue, { id, classList });
  for (let i = start; i <= end; i += step) {
    const value = i.toFixed(1);
    const selectItem = new SelectItem(value, value);
    select.appendChild(selectItem);
  }
  return select.setValue(currentValue);
};
