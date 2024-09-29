export class Localizer {
    static localizePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        for (const element of elements) {
            const messageName = element.getAttribute('data-i18n');
            element.innerHTML = Localizer.getMessage(messageName);
        }
    }

    /**
     *
     * @param {string} messageName
     * @returns {string}
     */
    static getMessage(messageName) {
        return browser.i18n.getMessage(messageName);
    }

    /**
     *
     * @param {string} inheritance
     * @returns {string}
     */
    static localizeInheritance(inheritance) {
        return Localizer.getMessage(`inheritance.${inheritance}`);
    }

    /**
     *
     * @param {string} background_source
     * @returns {string}
     */
    static localizeBackgroundSource(background_source) {
        return Localizer.getMessage(`background_source.${inheritance}`);
    }

    /**
     *
     * @param {string} foreground_source
     * @returns {string}
     */
    static localizeForegroundSource(foreground_source) {
        return Localizer.getMessage(`foreground_source.${foreground_source}`);
    }

    /**
     *
     * @param {string} algo
     * @returns {string}
     */
    static localizePageColorAlgo(algo) {
        return Localizer.getMessage(`page_color_algo.${algo}`);
    }

    /**
     *
     * @param {string} trigger
     * @returns {string}
     */
    static localizeTrigger(trigger) {
        return Localizer.getMessage(`trigger.${trigger}`);
    }
}
