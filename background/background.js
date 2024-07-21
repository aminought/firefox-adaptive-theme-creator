const options = new Options();

options.load().then(async () => {
  const cache = new Cache();
  const theme = new Theme(options, cache);
  await theme.loadTheme();
  theme.update();

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId);
    theme.update(tab);
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading") {return;}
    if (tab.active) {
      theme.update(tab);
    }
  });

  browser.runtime.onMessage.addListener(async (message) => {
    if (message.event === "optionsUpdated") {
      await options.load();
      theme.update();
    }
  });

  browser.theme.onUpdated.addListener(async (updateInfo) => {
    if (theme.isEqual(updateInfo.theme)) {
      return;
    }
    await theme.loadTheme();
    theme.update();
  });
});
