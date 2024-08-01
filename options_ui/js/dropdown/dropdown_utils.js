import { Dropdown } from "./dropdown.js";
import { DropdownItem } from "./dropdown_item.js";
import { Localizer } from "../utils/localizer.js";

/**
 *
 * @param {string} key
 * @param {string[]} values
 * @returns {Dropdown}
 */
export const createStringDropdown = (key, values) => {
  const dropdown = new Dropdown();
  dropdown.id = key;
  for (const value of values) {
    const dropdownItem = new DropdownItem();
    dropdownItem.value = value;
    dropdownItem.label = Localizer.getMessage(value);
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};

/**
 *
 * @param {string} key
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {number=} fixed
 * @returns {Dropdown}
 */
export const createNumberDropdown = (key, start, end, step, fixed = 1) => {
  const dropdown = new Dropdown();
  dropdown.id = key;
  for (let i = start; i <= end; i += step) {
    const dropdownItem = new DropdownItem();
    dropdownItem.value = i.toFixed(fixed);
    dropdownItem.label = dropdownItem.value;
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};
