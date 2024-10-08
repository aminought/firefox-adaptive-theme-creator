import { Options } from "../shared/options.js";
import { Runtime } from "./runtime.js";
import { Theme } from "../shared/theme.js";

const options = new Options(browser.storage.local);

options.load().then(async () => {
  const theme = new Theme(options);
  await theme.load();

  const runtime = new Runtime(options, theme);
  await runtime.updateTheme();

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    await runtime.onTabActivated(tabId);
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    await runtime.onTabUpdated(tabId, changeInfo, tab);
  });

  browser.storage.local.onChanged.addListener(async () => {
    await runtime.onOptionsUpdated();
  });

  browser.theme.onUpdated.addListener(async (updateInfo) => {
    await runtime.onThemeUpdated(updateInfo.theme);
  });

  browser.runtime.onMessage.addListener(async (message) => {
    await runtime.onContentMessage(message);
  });
});
