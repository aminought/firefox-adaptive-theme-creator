async function getColorPalette(base64Image) {
    if (!base64Image) {
        throw new Error('No image provided');
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    return new Promise((resolve, reject) => {
        image.onload = () => {
            try {
                const width = image.width;
                const height = image.height;

                canvas.width = width;
                canvas.height = height;
                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(0, 0, width, height);

                const colorPalette = new Map();
                const numPixels = width * height;

                for (let i = 0; i < numPixels; i++) {
                    const offset = i * 4;
                    const red = imageData.data[offset];
                    const green = imageData.data[offset + 1];
                    const blue = imageData.data[offset + 2];

                    if (!(red === 0 || (red > 240 && green > 240 && blue > 240))) {
                        const color = `${red},${green},${blue}`;
                        colorPalette.set(color, (colorPalette.get(color) || 0) + 1);
                    }
                }

                const topColors = Array.from(colorPalette.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, Math.min(10, colorPalette.size))
                    .map(([color, count]) => color.split(',').map(Number));

                resolve({ palette: topColors });
            } catch (error) {
                resolve({ palette: [] });
            }
        };

        image.onerror = reject;
        image.src = base64Image;
    });
}

async function updateTheme(tab) {
    const themeInfo = await browser.theme.getCurrent();
    const options = await browser.storage.sync.get();

    const saturationLimit = options["saturation-limit"] || 0.75;
    const defaultBackgroundColor = options["default-background-color"] || '#d7d7db';
    const defaultForegroundColor = options["default-foreground-color"] || '#4a4a4f';

    let faviconColorBackground = chroma(defaultBackgroundColor);
    let faviconColorForeground = chroma(defaultForegroundColor);

    try {
        const { palette } = await getColorPalette(tab.favIconUrl);
        if (palette.length) {
            faviconColorBackground = chroma(palette[0]);
            const saturation = faviconColorBackground.get('hsl.s');
            faviconColorBackground = faviconColorBackground.set('hsl.s', saturation * saturationLimit);
            const isBright = faviconColorBackground.luminance() > 0.4;
            faviconColorForeground = isBright ? chroma('#000') : chroma('#FFF');
        }
    } finally {
        themeInfo.colors.tab_selected = faviconColorBackground.css();
        themeInfo.colors.tab_text = faviconColorForeground.css();
        browser.theme.update(themeInfo);
    }
}

browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId);
    updateTheme(tab);
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        return;
    }

    if (tab.active) {
        updateTheme(tab);
    }
});

