import { Dropdown } from "./dropdown.js";
import { DropdownItem } from "./dropdown_item.js";
import { Localizer } from "../utils/localizer.js";

/**
 *
 * @param {string} key
 * @param {string[]} values
 * @param {string=} position
 * @returns {Dropdown}
 */
export const createStringDropdown = (key, values, position) => {
  const dropdown = new Dropdown(position);
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
 * @param {string=} position
 * @returns {Dropdown}
 */
export const createNumberDropdown = (key, start, end, step, position) => {
  const dropdown = new Dropdown(position);
  dropdown.id = key;
  for (let i = start; i <= end; i += step) {
    const dropdownItem = new DropdownItem();
    dropdownItem.value = i.toFixed(1);
    dropdownItem.label = dropdownItem.value;
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};
