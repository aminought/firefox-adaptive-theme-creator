import { Input } from "./input.js";

const EMPTY = `
  <svg  width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M20 21H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
`;

const CHECK = `
  <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M21 11v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h12"/><path data-name="primary" d="M21 5l-9 9-4-4"/></g></svg>
`;

export class Checkbox extends Input {
  /**
   *
   * @param {boolean} value
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(value, { id = null, classList = [] } = {}) {
    super(value, { id, classList: ["checkbox", ...classList] });
    this.updateCheckbox();
  }

  /**
   *
   * @returns {Checkbox}
   */
  updateCheckbox() {
    this.element.innerHTML = this.value ? CHECK : EMPTY;
    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {Checkbox}
   */
  setValue(value) {
    Input.prototype.setValueInternal.call(this, value);
    return this.updateCheckbox();
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.element.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.setValue(!this.value);
      this.onChange?.(this.value);
    };

    return this.element;
  }
}
