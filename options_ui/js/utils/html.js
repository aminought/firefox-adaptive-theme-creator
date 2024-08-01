import { Color } from "../../../shared/color.js";
import { Localizer } from "./localizer.js";

/**
 *
 * @param {HTMLSelectElement} selectElement
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {number=} fixed
 */
export const addNumberOptions = (
  selectElement,
  start,
  end,
  step,
  fixed = 1
) => {
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
export const positionByCoords = (child, parent, clientX, clientY) => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  const x = clientX - parentRect.left;
  const y = clientY - parentRect.top;

  if (y + childRect.height > parentRect.bottom) {
    child.style.top = `${parentRect.bottom - childRect.height}px`;
  } else {
    child.style.top = `${y}px`;
  }
  if (x + childRect.width > parentRect.right) {
    child.style.left = `${parentRect.right - childRect.width}px`;
  } else {
    child.style.left = `${x}px`;
  }
};

/**
 *
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {HTMLElement} target
 * @param {number} padding
 */
export const positionAbove = (child, parent, target, padding) => {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  let x = targetRect.left - parentRect.left;
  const y = targetRect.top - parentRect.top - childRect.height - padding;

  if (x + childRect.width > parentRect.right) {
    x = parentRect.right - childRect.width;
  }

  child.style.left = `${x}px`;
  child.style.top = `${y}px`;
};

/**
 *
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {HTMLElement} target
 * @param {number} padding
 */
export const positionBelow = (child, parent, target, padding) => {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  let x =
    targetRect.left -
    parentRect.left -
    childRect.width / 2 +
    targetRect.width / 2;
  const y = targetRect.bottom - parentRect.top + padding;

  if (x + childRect.width > parentRect.right) {
    x = parentRect.right - childRect.width;
  }

  if (x < parentRect.left) {
    x = parentRect.left;
  }

  child.style.left = `${x}px`;
  child.style.top = `${y}px`;
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} color
 */
export const setBackgroundColor = (element, color) => {
  element.style.backgroundColor = color;
  const foregroundColor = new Color(color).getForeground();
  element.style.backgroundImage = `
    repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, ${foregroundColor.css()} 0%, transparent) 0 5px,
      color-mix(in srgb, ${foregroundColor.css()} 25%, transparent) 5px 10px
    )`;
  element.setAttribute("data-value", color);
};
