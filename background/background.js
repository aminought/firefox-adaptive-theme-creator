import { Options } from "../shared/options.js";
import { Runtime } from "./runtime.js";
import { Theme } from "../shared/theme.js";

Options.load().then(async (options) => {
  const theme = await Theme.load();
  const runtime = new Runtime(options, theme);

  runtime.updateTheme();

  browser.tabs.onActivated.addListener(({ tabId }) => {
    runtime.onTabActivated(tabId);
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    runtime.onTabUpdated(tabId, changeInfo, tab);
  });

  browser.runtime.onMessage.addListener((message) => {
    runtime.onMessage(message);
  });

  browser.theme.onUpdated.addListener((updateInfo) => {
    const updatedTheme = new Theme(updateInfo.theme);
    runtime.onThemeUpdated(updatedTheme);
  });
});
