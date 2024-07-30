import { BrowserParts } from "./browser_parts.js";
import { BrowserPreview } from "./browser_preview.js";
import { Form } from "./form.js";
import { Localizer } from "./localizer.js";
import { MegaContextMenu } from "./mega_context_menu.js";
import { Options } from "./options.js";
import { PartContextMenu } from "./part_context_menu.js";
import { PopupController } from "./popup_controller.js";
import { Theme } from "../theme/theme.js";
import { setRootColor } from "./html.js";

/**
 *
 * @param {Options} options
 */
const stylePage = async (options) => {
  const theme = await Theme.load();
  const warning = document.getElementById("warning");
  if (!theme.isCompatible()) {
    warning.classList.toggle("hidden", false);
    return;
  }
  warning.classList.toggle("hidden", true);

  setRootColor("--background-color", theme.getColor("popup")?.css());
  setRootColor("--color", theme.getColor("popup_text")?.css());

  for (const part of BrowserParts.getBackgroundParts()) {
    const partOptions = options.getPartOptions(part);
    const color = theme.getColor(part);
    BrowserPreview.colorPart(part, color, partOptions.enabled);
  }
};

/**
 *
 * @param {Event} event
 * @param {Options} options
 * @param {BrowserPreview} browserPreview
 */
const onBrowserPreviewClick = (event, options, browserPreview) => {
  event.preventDefault();

  if (!PopupController.empty()) {
    return;
  }

  const { classList } = event.target;
  let part = event.target.id;

  if (classList.contains("placeholder")) {
    part = "toolbar";
  }

  if (BrowserParts.getBackgroundParts().includes(part)) {
    const { enabled } = options.getPartOptions(part);
    options.setPartOption(part, "enabled", !enabled);
  } else if (part === "appcontent" || part === "rickroll") {
    browserPreview.rickroll();
  }
};

/**
 *
 * @param {MouseEvent} event
 * @param {Options} options
 */
const onBrowserPreviewContextMenu = (event, options, body) => {
  event.preventDefault();
  PopupController.popFor(event.target);

  const { classList } = event.target;
  let part = event.target.id;
  if (classList.contains("placeholder")) {
    part = "toolbar";
  }
  if (!BrowserParts.getBackgroundParts().includes(part)) {
    return;
  }

  const contextMenus = [];
  contextMenus.push(new PartContextMenu(options, part));

  for (const connectedPart of BrowserParts.getConnectedBackgroundParts(part)) {
    contextMenus.push(new PartContextMenu(options, connectedPart));
  }

  const megaContextMenu = new MegaContextMenu(contextMenus);

  PopupController.push(megaContextMenu, body, event.clientX, event.clientY);
};

/**
 *
 * @param {MouseEvent} event
 */
const onBodyClick = (event) => {
  PopupController.popFor(event.target);
};

document.addEventListener("DOMContentLoaded", async () => {
  const body = document.querySelector("body");
  const options = await Options.load();
  // eslint-disable-next-line no-unused-vars
  const form = new Form(options);
  const browserPreview = new BrowserPreview();

  Localizer.localizePage();
  stylePage(options);

  body.onclick = onBodyClick;

  browserPreview.onClick((e) =>
    onBrowserPreviewClick(e, options, browserPreview)
  );
  browserPreview.onContextMenu((e) =>
    onBrowserPreviewContextMenu(e, options, body)
  );

  browser.runtime.onMessage.addListener((message) => {
    if (message.event === "themeUpdated") {
      stylePage(options);
    }
  });
});
