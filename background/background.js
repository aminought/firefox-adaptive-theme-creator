const theme = new Theme();

theme.init().then(() => {
    theme.update();

    browser.tabs.onActivated.addListener(async ({ tabId }) => {
        const tab = await browser.tabs.get(tabId);
        theme.update(tab);
    });

    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'loading') return;
        if (tab.active) theme.update(tab);
    });

    browser.runtime.onMessage.addListener((message) => {
        if (message.event === 'optionsUpdated') theme.updateOptions().then(() => theme.update());
    });
});
