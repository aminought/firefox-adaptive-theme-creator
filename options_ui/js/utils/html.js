import { Localizer } from "./localizer.js";

/**
 *
 * @param {HTMLSelectElement} selectElement
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {number=} fixed
 */
export const addNumberOptions = (selectElement, start, end, step, fixed = 1) => {
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
export const addStringOptions = (selectElement, strings) => {
  for (const string of strings) {
    const option = document.createElement("option");
    option.value = string;
    option.label = Localizer.getMessage(string);
    selectElement.appendChild(option);
  }
};

/**
 *
 * @param {string} property
 * @param {string} color
 */
export const setRootColor = (property, color) => {
  document.documentElement.style.setProperty(property, color);
};

/**
 *
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {number} clientX
 * @param {number} clientY
 */
export const setPosition = (child, parent, clientX, clientY) => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  if (clientY + childRect.height > parentRect.bottom) {
    child.style.top = `${parentRect.bottom - childRect.height}px`;
  } else {
    child.style.top = `${clientY}px`;
  }
  if (clientX + childRect.width > parentRect.right) {
    child.style.left = `${parentRect.right - childRect.width}px`;
  } else {
    child.style.left = `${clientX}px`;
  }
};
