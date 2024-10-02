import { Localizer } from "./localizer.js";
import { Select } from "../ui_elements/select.js";
import { SelectItem } from "../ui_elements/select_item.js";

/**
 *
 * @param {string[]} values
 * @param {CallableFunction} localize
 * @returns {Select}
 */
export const createStringSelect = (
  values,
  localize = Localizer.getMessage,
  { id = null, className: classList = [] } = {}
) => {
  const select = new Select({ id, classList });
  for (const value of values) {
    const label = localize(value);
    const selectItem = new SelectItem(label, value);
    select.appendChild(selectItem);
  }
  return select;
};

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @returns {Select}
 */
export const createNumberSelect = (start, end, step) => {
  const select = new Select();
  for (let i = start; i <= end; i += step) {
    const value = i.toFixed(1);
    const selectItem = new SelectItem(value, value);
    select.appendChild(selectItem);
  }
  return select;
};
