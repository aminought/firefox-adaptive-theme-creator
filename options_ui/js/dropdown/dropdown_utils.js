import { Dropdown } from "./dropdown.js";
import { DropdownItem } from "./dropdown_item.js";
import { Localizer } from "../utils/localizer.js";

/**
 *
 * @param {string[]} values
 * @param {CallableFunction} localize
 * @returns {Dropdown}
 */
export const createStringDropdown = (
  values,
  localize = Localizer.getMessage,
  { id = "", className: classList = [] } = {}
) => {
  const dropdown = new Dropdown({ id, classList });
  for (const value of values) {
    const label = localize(value);
    const dropdownItem = new DropdownItem(label, value);
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @returns {Dropdown}
 */
export const createNumberDropdown = (start, end, step) => {
  const dropdown = new Dropdown();
  for (let i = start; i <= end; i += step) {
    const value = i.toFixed(1);
    const dropdownItem = new DropdownItem(value, value);
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};
