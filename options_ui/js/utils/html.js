import { Color } from "../../../shared/color.js";

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
