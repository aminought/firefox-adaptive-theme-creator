import { Localizer } from "./localizer.js";

/**
 *
 * @param {HTMLSelectElement} selectElement
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {number=} fixed
 */
const addNumberOptions = (selectElement, start, end, step, fixed = 1) => {
  for (let i = start; i <= end; i += step) {
    const option = document.createElement("option");
    option.value = i.toFixed(fixed);
    option.label = option.value;
    selectElement.appendChild(option);
  }
};

/**
 *
 * @param {HTMLSelectElement} selectElement
 * @param {string[]} strings
 */
const addStringOptions = (selectElement, strings) => {
  for (const string of strings) {
    const option = document.createElement("option");
    option.value = string;
    option.label = Localizer.getMessage(string);
    selectElement.appendChild(option);
  }
};

const setRootColor = (property, color) => {
  document.documentElement.style.setProperty(property, color);
};

export { addNumberOptions, addStringOptions, setRootColor };
