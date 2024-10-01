import {
    BACKGROUND_SOURCE,
    FOREGROUND_SOURCE,
    PAGE_COLOR_ALGO,
    TRIGGER,
} from '../../shared/constants.js';
import { createNumberDropdown, createStringDropdown } from './dropdown/dropdown_utils.js';

import { ColorPicker } from './color_picker.js';
import { HelpPopup } from './help_popup.js';
import { Localizer } from './utils/localizer.js';
import { Options } from '../../shared/options.js';
import { POSITIONS } from './utils/positions.js';
import { PopupController } from './popup_controller.js';
import { createCheckbox } from './checkbox/checkbox_utils.js';
import { setBackgroundColor } from './utils/html.js';

export class Form {
    static body = document.querySelector('body');

    /**
     *
     * @param {Options} options
     */
    constructor(options) {
        this.options = options;
        this.resetHandlers = [];

        this.#addStringDropdownOption('background_source', Object.values(BACKGROUND_SOURCE));
        this.#addStringDropdownOption('foreground_source', Object.values(FOREGROUND_SOURCE));
        this.#addStringDropdownOption('algo', Object.values(PAGE_COLOR_ALGO), Localizer.localizePageColorAlgo);
        this.#configureBackgroundColorOption("color");
        this.#addNumberDropdownOption("saturation_limit", 0.1, 1.0, 0.1);
        this.#addNumberDropdownOption("darkness", 0.0, 5.0, 0.5);
        this.#addNumberDropdownOption("brightness", 0.0, 5.0, 0.5);
        this.#addCheckboxOptions(Object.values(TRIGGER), "triggers");
        this.#addCheckboxOption("favicon.avoid_white");
        this.#addCheckboxOption("favicon.avoid_black");
        this.#addCheckboxOption("page.avoid_white");
        this.#addCheckboxOption("page.avoid_black");
        this.#configureInputOption("page.capture_height");

        const helpButton = document.getElementById('help_button');
        helpButton.onclick = (e) => Form.#showHelp(e);

        const resetButton = document.getElementById('reset_button');
        resetButton.onclick = (e) => this.reset(e);
    }

    /**
     *
     * @param {string} id
     * @param {string[]} values
     * @param {CallableFunction} localize
     */
    #addStringDropdownOption(id, values, localize = Localizer.getMessage) {
        const dropdown = createStringDropdown(id, values, POSITIONS.BELOW, localize);
        dropdown.onChange = async (value) => await this.options.setGlobalOption(id, value);

        this.#registerResetHandlerAndReset(() => {
            dropdown.value = this.options.getGlobalOption(id);
        });

        const parent = document.getElementById(`${id}_option`);
        parent.appendChild(dropdown.element);
    }

    /**
     *
     * @param {string} id
     * @param {number} start
     * @param {number} end
     * @param {number} step
     */
    #addNumberDropdownOption(id, start, end, step) {
        const dropdown = createNumberDropdown(id, start, end, step);
        dropdown.onChange = async (value) => await this.options.setGlobalOption(id, value);

        this.#registerResetHandlerAndReset(() => {
            dropdown.value = this.options.getGlobalOption(id);
        });

        const parent = document.getElementById(`${id}_option`);
        parent.appendChild(dropdown.element);
    }

    /**
     *
     * @param {string} id
     */
    #addCheckboxOption(id) {
        const checkbox = createCheckbox(id);
        checkbox.onChange = async (value) => await this.options.setGlobalOption(id, value);

        this.#registerResetHandlerAndReset(() => {
            checkbox.value = this.options.getGlobalOption(id);
        });

        const parent = document.getElementById(`${id}_option`);
        parent.appendChild(checkbox.element);
    }

    /**
     *
     * @param {string[]} ids
     * @param {string} key
     */
    #addCheckboxOptions(ids, key) {
        for (const id of ids) {
            const checkbox = createCheckbox(id);
            checkbox.onChange = async (value) => {
                const values = this.options.getGlobalOptionAsSet(key);
                if (value) {
                    values.add(id);
                } else {
                    values.delete(id);
                }
                await this.options.setGlobalOption(key, values);
            };

            this.#registerResetHandlerAndReset(() => {
                checkbox.value = this.options.getGlobalOptionAsSet(key).has(id);
            });

            const parent = document.getElementById(`${id}_option`);
            parent.appendChild(checkbox.element);
        }
    }

    /**
     *
     * @param {string} id
     */
    #configureBackgroundColorOption(id) {
        const element = document.getElementById(id);

        this.#registerResetHandlerAndReset(() =>
            setBackgroundColor(element, this.options.getGlobalOption(id))
        );

        element.onclick = (e) => this.#showColorPicker(e, id, element.style.backgroundColor);
    }

    /**
     *
     * @param {string} id
     */
    #configureInputOption(id) {
        const pageCaptureHeight = document.getElementById(id);

        this.#registerResetHandlerAndReset(() => {
            pageCaptureHeight.value = this.options.getGlobalOption(id);
        });

        pageCaptureHeight.onchange = async (e) =>
            await this.options.setGlobalOption(id, e.target.value);
    }

    /**
     *
     * @param {MouseEvent} event
     * @param {string} key
     * @param {string} color
     */
    #showColorPicker(event, key, color) {
        event.stopPropagation();
        PopupController.popFor(event.target);
        const colorPicker = new ColorPicker(Form.body, color, (value) => {
            const colorPreview = document.getElementById(key);
            this.#saveBackgroundColor(colorPreview, value, key);
        });

        PopupController.push(colorPicker, event.clientX, event.clientY);
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {object} color
     * @param {string} key
     */
    async #saveBackgroundColor(element, color, key) {
        setBackgroundColor(element, color.rgbaString);
        await this.options.setGlobalOption(key, color.rgbaString);
    }

    /**
     *
     * @param {function():void} reset
     */
    #registerResetHandlerAndReset(reset) {
        this.resetHandlers.push(reset);
        reset();
    }

    /**
     *
     * @param {Event} event
     */
    async reset(event) {
        event.preventDefault();
        await this.options.reset();
        for (const reset of this.resetHandlers) {
            reset();
        }
    }

    /**
     *
     * @param {MouseEvent} event
     */
    static #showHelp(event) {
        event.stopPropagation();
        if (!PopupController.popFor(event.target)) {
            const helpPopup = new HelpPopup(this.body);
            PopupController.push(helpPopup, event.target);
        }
    }
}
