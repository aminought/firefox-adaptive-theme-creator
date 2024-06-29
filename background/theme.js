class Theme {
    async init() {
        await this.loadTheme();
        await this.updateOptions();
    }

    async loadTheme() {
        this.defaultThemeInfo = await browser.theme.getCurrent();
    }

    async updateOptions() {
        this.options = await browser.storage.sync.get();
    }

    async update(tab) {
        if (!tab) {
            tab = await browser.tabs.query({ active: true, currentWindow: true })[0];
        }

        const saturationLimit = this.options.saturationLimit || 1;
        let tabBgColor = this.#defaultTabBgColor;
        let tabFgColor = this.#defaultTabFgColor;

        try {
            const mostPopularColor = await getMostPopularColor(tab.favIconUrl);
            if (mostPopularColor) {
                tabBgColor = limitSaturation(mostPopularColor, saturationLimit);
                tabFgColor = calculateFgColor(tabBgColor);
            }
        } finally {
            const themeInfo = this.clone();
            themeInfo.colors.tab_selected = tabBgColor.css();
            themeInfo.colors.tab_text = tabFgColor.css();
            browser.theme.update(themeInfo);
        }
    }

    clone() {
        return JSON.parse(JSON.stringify(this.defaultThemeInfo));
    }

    get #defaultTabBgColor() {
        return chroma(
            this.options.changeDefaultTabColors
                ? this.options.defaultTabBgColor || this.defaultThemeInfo.colors.tab_selected
                : this.defaultThemeInfo.colors.tab_selected
        );
    }

    get #defaultTabFgColor() {
        return chroma(
            this.options.changeDefaultTabColors
                ? this.options.defaultTabFgColor || this.defaultThemeInfo.colors.tab_text
                : this.defaultThemeInfo.colors.tab_text
        );
    }
}
