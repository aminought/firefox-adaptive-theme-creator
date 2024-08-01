const EMPTY = `
  <svg class="checkbox_empty" width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M20 21H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
`;

const CHECK = `
  <svg class="checkbox_checked" width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M21 11v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h12"/><path data-name="primary" d="M21 5l-9 9-4-4"/></g></svg>
`;

export class Checkbox {
  constructor() {
    this.element = this.#createElement();
    /**
     *
     * @param {boolean} value
     */
    // eslint-disable-next-line no-unused-vars, no-empty-function
    this.onChange = (value) => {};
  }

  /**
   *
   * @returns {HTMLDivElement}
   */
  #createElement() {
    const checkbox = document.createElement("div");
    checkbox.className = "checkbox";
    checkbox.insertAdjacentHTML("beforeend", EMPTY);
    checkbox.insertAdjacentHTML("beforeend", CHECK);

    checkbox.onclick = () => {
      this.value = this.value === "false";
      this.onChange(this.value);
    };

    return checkbox;
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.element.id;
  }

  /**
   * @param {string} id
   */
  set id(id) {
    this.element.id = id;
  }

  /**
   * @returns {boolean}
   */
  get value() {
    return this.element.getAttribute("data-value");
  }

  /**
   * @param {boolean} value
   */
  set value(value) {
    this.element.setAttribute("data-value", value);
  }
}
