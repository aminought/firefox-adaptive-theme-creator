import { UIElement } from './ui_element.js';

export class Label extends UIElement {
    /**
     *
     * @param {string} text
     * @param {object} params
     * @param {string} params.id
     * @param {Array<string>} params.classList
     * @param {string} params.for_
     */
    constructor(text, { id = '', classList = [], for_ = '' } = {}) {
        super({ id, classList });
        this.text = text;
        this.for = for_;
    }

    /**
     *
     * @returns {HTMLDivElement}
     */
    draw = () => {
        const element = document.createElement('label');
        element.id = this.id;
        element.classList.add(...this.classList);
        element.innerText = this.text;
        element.setAttribute('for', this.for);

        this.element = element;
        return this.element;
    };

    /**
     *
     * @param {string} text
     * @returns {Label}
     */
    setText = (text) => {
        this.text = text;
        if (this.element) {
            this.element.innerText = text;
        }
        return this;
    };
}
