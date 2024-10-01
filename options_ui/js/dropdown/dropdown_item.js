// eslint-disable-next-line no-unused-vars
import { PopupController } from '../popup_controller.js';
import { UIElement } from '../ui_element.js';

export class DropdownItem extends UIElement {
    /**
     *
     * @param {string} label
     * @param {string} value
     * @param {object} params
     * @param {string} params.id
     * @param {Array<string>} params.classList
     */
    constructor(label, value, { id = '', classList = [] } = {}) {
        super({ id, classList: ['dropdown_item', ...classList] });
        this.label = label;
        this.value = value;
        this.onClick = null;
    }

    /**
     *
     * @returns {HTMLDivElement}
     */
    draw() {
        const element = document.createElement('div');
        element.id = this.id;
        element.classList.add(...this.classList);

        element.innerText = this.label;

        element.onclick = (event) => {
            event.stopPropagation();
            PopupController.pop();
            this.onClick?.(this.value);
        };

        this.element = element;
        return element;
    }
}
