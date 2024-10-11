import { Options } from "../../shared/options.js";
import { PARTS } from "../../shared/browser_parts.js";
import { PopupController } from "../../lib/elements/elements.js";
import { Theme } from "../../shared/theme.js";
import { buildUI } from "./ui_builder.js";
import { setRootVariable } from "./utils/html.js";

const styleUI = (theme) => {
  setRootVariable("background-color", theme.getColor("popup")?.css());
  setRootVariable("color", theme.getColor("popup_text")?.css());

  for (const partName of Object.keys(PARTS)) {
    const part = PARTS[partName];
    if (part.hasPreview) {
      setRootVariable(part.name, theme.getColor(part.name)?.css());
    }
  }
  setRootVariable("page", theme.getProperty("page"));
  setRootVariable("page_text", theme.getProperty("page_text"));

  setRootVariable(
    "global-theme-display",
    theme.getProperty("system") === "true" ? "flex" : "none"
  );
};

/**
 *
 * @param {Event} event
 * @param {Options} options
 * @param {BrowserPreview} browserPreview
 */
// const onBrowserPreviewClick = (event, options, browserPreview) => {
//     event.preventDefault();

//     if (!PopupController.empty()) {
//         return;
//     }

//     const { classList } = event.target;
//     let part = event.target.id;

//     if (classList.contains('placeholder')) {
//         part = 'toolbar';
//     }

// if (BrowserParts.getBackgroundParts().includes(part)) {
//   const { enabled } = options.getPartOptions(part);
//   options.setPartOption(part, "enabled", !enabled);
//   const connectedParts = BrowserParts.getConnectedBackgroundParts(part);
//   for (const connectedPart of connectedParts) {
//     options.setPartOption(connectedPart, "enabled", !enabled);
//   }
// } else if (part === "appcontent" || part === "rickroll") {
//   browserPreview.rickroll();
// }
// };

/**
 *
 * @param {MouseEvent} event
 * @param {Options} options
 */
// const onBrowserPreviewContextMenu = (event, options, body) => {
//     event.preventDefault();
//     PopupController.popFor(event.target);

//     const { classList } = event.target;
//     let part = event.target.id;
//     if (classList.contains('placeholder')) {
//         part = 'toolbar';
//     }
// if (!BrowserParts.getBackgroundParts().includes(part)) {
//   return;
// }

// const parts = [part];
// for (const connectedPart of BrowserParts.getConnectedBackgroundParts(part)) {
//   parts.push(connectedPart);
// }

// const contextMenu = new ContextMenu(options, body, parts);
// PopupController.push(contextMenu, event.clientX, event.clientY);
// };

/**
 *
 * @param {MouseEvent} event
 */
const onBodyClick = (event) => {
  PopupController.popFor(event);
};

document.addEventListener("DOMContentLoaded", async () => {
  const body = document.querySelector("body");

  const options = new Options(browser.storage.local);
  await options.load();

  const theme = new Theme(options);
  await theme.loadAsIs();

  await buildUI(options);
  styleUI(theme);

  body.onclick = onBodyClick;

  browser.runtime.onMessage.addListener(async (message) => {
    if (message.event === "themeUpdated") {
      await theme.loadAsIs();
      styleUI(theme);
    }
  });
});
