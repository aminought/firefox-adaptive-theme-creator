import { Localizer } from "./localizer.js";

/**
 *
 * @param {string} selector
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {number=} fixed
 */
const addNumberOptions = (selector, start, end, step, fixed = 1) => {
  const select = document.querySelector(selector);
  for (let i = start; i <= end; i += step) {
    const option = document.createElement("option");
    option.value = i.toFixed(fixed);
    option.label = option.value;
    select.appendChild(option);
  }
};

/**
 *
 * @param {string} selector
 * @param {string[]} strings
 */
const addStringOptions = (selector, strings) => {
  const select = document.querySelector(selector);
  for (const string of strings) {
    const option = document.createElement("option");
    option.value = string;
    option.label = Localizer.getMessage(string);
    select.appendChild(option);
  }
};

const setRootColor = (property, color) => {
  document.documentElement.style.setProperty(property, color);
};

export { addNumberOptions, addStringOptions, setRootColor };
