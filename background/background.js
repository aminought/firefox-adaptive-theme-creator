import { Options } from "../shared/options.js";
import { Runtime } from "./runtime.js";
import { Theme } from "../shared/theme.js";

const options = new Options(browser.storage.local);

options.load().then(async () => {
  const theme = await Theme.load();
  const runtime = new Runtime(options, theme);

  runtime.updateTheme();

  browser.tabs.onActivated.addListener(({ tabId }) => {
    runtime.onTabActivated(tabId);
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    runtime.onTabUpdated(tabId, changeInfo, tab);
  });

  browser.storage.local.onChanged.addListener(
    async () => await runtime.onOptionsUpdated()
  );

  browser.theme.onUpdated.addListener((updateInfo) => {
    const updatedTheme = new Theme(updateInfo.theme);
    runtime.onThemeUpdated(updatedTheme);
  });

  browser.runtime.onMessage.addListener((message) => {
    runtime.onContentMessage(message);
  });
});
