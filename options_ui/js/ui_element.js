export class UIElement {
    /**
     *
     * @param {object} params
     * @param {string} params.id
     * @param {Array<string>} params.classList
     */
    constructor({ id = '', classList = [] } = {}) {
        this.id = id;
        this.classList = classList;
        this.children = [];
        this.element = null;
    }

    /**
     *
     * @param {UIElement} child
     */
    appendChild = (child) => {
        this.children.push(child);
        return this;
    };

    /**
     *
     * @returns {HTMLElement}
     */
    // eslint-disable-next-line class-methods-use-this
    draw = () => document.createElement('div');

    /**
     *
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    contains = (element) => this.element?.contains(element);

    /**
     *
     * @returns {void}
     */
    remove = () => this.element?.remove();
}
