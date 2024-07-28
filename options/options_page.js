import { BrowserParts } from "./browser_parts.js";
import { BrowserPreview } from "./browser_preview.js";
import { ContextMenu } from "./context_menu.js";
import { Form } from "./form.js";
import { Localizer } from "./localizer.js";
import { Options } from "./options.js";
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
    BrowserPreview.colorPart(part, color);
    BrowserPreview.markChanged(part, partOptions.enabled);
  }
};

/**
 *
 * @param {Event} e
 * @param {Options} options
 * @param {BrowserPreview} browserPreview
 * @param {ContextMenu} contextMenu
 * @returns
 */
const onBrowserPreviewClick = (e, options, browserPreview) => {
  e.preventDefault();
  if (ContextMenu.isOpened()) {
    ContextMenu.close();
    return;
  }

  const { classList } = e.target;
  let part = e.target.id;

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
 * @param {Event} e
 * @param {ContextMenu} contextMenu
 * @returns
 */
const onBrowserPreviewContextMenu = (e, contextMenu) => {
  e.preventDefault();
  const { classList } = e.target;
  let part = e.target.id;
  if (classList.contains("placeholder")) {
    part = "toolbar";
  }
  if (!BrowserParts.getBackgroundParts().includes(part)) {
    return;
  }

  contextMenu.setPart(part);
  ContextMenu.open();

  const body = document.querySelector("body");
  ContextMenu.positionInside(body, e.clientX, e.clientY);
};

document.addEventListener("DOMContentLoaded", async () => {
  const options = await Options.load();
  // eslint-disable-next-line no-unused-vars
  const form = new Form(options);
  const browserPreview = new BrowserPreview();
  const contextMenu = new ContextMenu(options);

  Localizer.localizePage();
  stylePage(options);

  browserPreview.onClick((e) =>
    onBrowserPreviewClick(e, options, browserPreview, contextMenu)
  );
  browserPreview.onContextMenu((e) =>
    onBrowserPreviewContextMenu(e, contextMenu)
  );

  browser.runtime.onMessage.addListener((message) => {
    if (message.event === "themeUpdated") {
      stylePage(options);
    }
  });
});
