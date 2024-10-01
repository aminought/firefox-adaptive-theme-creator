import { positionRelative } from './utils/positions.js';

export class PopupController {
    static stack = [];

    /**
     *
     * @param {object} popup
     * @param {HTMLElement} target
     * @param {string} position
     * @param  {...any} args
     */
    static push(popup, target, position, ...args) {
        const element = popup.draw(...args);
        const body = document.querySelector('body');
        body.appendChild(element);
        positionRelative(position, element, body, target);
        this.stack.push(popup);
    }

    static pop() {
        if (!this.stack.length) {
            return;
        }
        const popup = this.stack.pop();
        popup.remove();
    }

    /**
     *
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static popFor(element) {
        let popped = false;
        while (!this.empty()) {
            const popup = this.peek();
            if (popup.contains(element)) {
                return popped;
            }
            this.pop();
            popped = true;
        }
        return popped;
    }

    /**
     *
     * @returns {object}
     */
    static peek() {
        return this.stack[this.stack.length - 1];
    }

    static clear() {
        while (!this.empty()) {
            this.pop();
        }
    }

    static empty() {
        return !this.stack.length;
    }
}
