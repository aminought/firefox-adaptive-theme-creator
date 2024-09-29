import { Dropdown } from "./dropdown.js";
import { DropdownItem } from "./dropdown_item.js";
import { Localizer } from "../utils/localizer.js";
import { POSITIONS } from "../utils/positions.js";

/**
 *
 * @param {string} id
 * @param {string[]} values
 * @param {string=} position
 * @param {CallableFunction} localize
 * @returns {Dropdown}
 */
export const createStringDropdown = (
  id,
  values,
  position = POSITIONS.BELOW,
  localize = Localizer.getMessage
) => {
  const dropdown = new Dropdown(position);
  dropdown.id = id;
  for (const value of values) {
    const dropdownItem = new DropdownItem();
    dropdownItem.value = value;
    dropdownItem.label = localize(value);
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};

/**
 *
 * @param {string} id
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {string=} position
 * @returns {Dropdown}
 */
export const createNumberDropdown = (
  id,
  start,
  end,
  step,
  position = POSITIONS.BELOW
) => {
  const dropdown = new Dropdown(position);
  dropdown.id = id;
  for (let i = start; i <= end; i += step) {
    const dropdownItem = new DropdownItem();
    dropdownItem.value = i.toFixed(1);
    dropdownItem.label = dropdownItem.value;
    dropdown.appendChild(dropdownItem);
  }
  return dropdown;
};
