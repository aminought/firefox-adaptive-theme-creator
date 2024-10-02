import { UIElement } from "../ui_element.js";

const ARROW = `
<svg viewBox="0 0 140 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path fill="currentColor" d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
  </g>
</svg>
`;

export class DropdownArrow extends UIElement {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = "", classList = [] } = {}) {
    super({ id, classList: ["dropdown_arrow", ...classList] });
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  draw = () => {
    const element = document.createElement("div");
    element.id = this.id;
    element.classList.add(...this.classList);

    element.insertAdjacentHTML("beforeend", ARROW);

    this.element = element;
    return element;
  };
}
