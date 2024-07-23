import { BrowserPreview } from "./browser_preview.js";
import { Color } from "../colors/color.js";
import { ContextMenu } from "./context_menu.js";
import { Form } from "./form.js";
import { Options } from "./options.js";
import { Theme } from "../theme/theme.js";

const onFormChange = async (e, options, form) => {
  e.preventDefault();
  form.export(options);
  await options.save();
};

const onFormReset = async (e, options, form) => {
  e.preventDefault();
  options.reset();
  await options.save();
  form.import(options);
};

// eslint-disable-next-line max-params
const addOptions = (selector, start, end, step, fixed = 1) => {
  const select = document.querySelector(selector);
  for (let i = start; i <= end; i += step) {
    const option = document.createElement("option");
    option.value = i.toFixed(fixed);
    option.label = option.value;
    select.appendChild(option);
  }
};

const setRootColor = (property, color) => {
  document.documentElement.style.setProperty(property, color);
};

const stylePage = async (options) => {
  const theme = await Theme.load();
  if (!theme.isCompatible()) {
    return;
  }

  setRootColor("--background-color", theme.getColor("popup")?.css());
  setRootColor("--color", theme.getColor("popup_text")?.css());

  const [tab] = await browser.tabs.query({ active: true });

  for (const part of Options.PARTS) {
    let color = theme.getColor(part);
    let saturationLimit = options.getGlobalSaturationLimit();
    const darken = options.getGlobalDarken();
    const brighten = options.getGlobalBrighten();
    if (tab.url.startsWith("about:") && options.isEnabled(part)) {
      if (options.isCustomSaturationLimitEnabled(part)) {
        saturationLimit = options.getCustomSaturationLimit(part);
      }
      color = new Color("red")
        .limitSaturation(saturationLimit)
        .darken(darken)
        .brighten(brighten);
    }
    BrowserPreview.colorPart(part, color);
  }
};

const loadContent = (options, form) => {
  addOptions("#saturation_limit", 0.1, 1.0, 0.1);
  addOptions(".custom_saturation_limit", 0.1, 1.0, 0.1);
  addOptions("#darken", 0.0, 5.0, 0.5);
  addOptions("#brighten", 0.0, 5.0, 0.5);
  form.import(options);
};

// eslint-disable-next-line max-params
const onBrowserPreviewClick = (e, options, browserPreview, contextMenu) => {
  e.preventDefault();
  if (contextMenu.isOpened()) {
    contextMenu.close();
    return;
  }

  const { classList } = e.target;
  let part = e.target.id;

  if (classList.contains("placeholder")) {
    part = "toolbar";
  }

  if (Options.PARTS.includes(part)) {
    options.toggleEnabled(part);
    options.save();
  } else if (part === "appcontent" || part === "rickroll") {
    browserPreview.rickroll();
  }
};

const onBrowserPreviewContextMenu = (e, options, contextMenu) => {
  e.preventDefault();
  const { classList } = e.target;
  let part = e.target.id;
  if (classList.contains("placeholder")) {
    part = "toolbar";
  }
  if (!Options.PARTS.includes(part)) {
    return;
  }
  const saturationLimitEnabled = options.isCustomSaturationLimitEnabled(part);
  const saturationLimit = options.getCustomSaturationLimit(part)
    ? options.getCustomSaturationLimit(part)
    : options.getGlobalSaturationLimit();

  contextMenu.fillTitle(part);
  contextMenu.fillSaturationLimitEnabled(part, saturationLimitEnabled);
  contextMenu.fillSaturationLimit(part, saturationLimit);
  contextMenu.open();

  const body = document.querySelector("body");
  contextMenu.positionInside(body, e.clientX, e.clientY);
};

document.addEventListener("DOMContentLoaded", async () => {
  const options = await Options.load();
  const form = new Form();
  const browserPreview = new BrowserPreview();
  const contextMenu = new ContextMenu();
  const resetButton = document.getElementById("reset_button");

  loadContent(options, form);
  stylePage(options);

  form.onChange((e) => onFormChange(e, options, form));

  resetButton.addEventListener("click", (e) => onFormReset(e, options, form));

  browserPreview.onClick((e) =>
    onBrowserPreviewClick(e, options, browserPreview, contextMenu)
  );
  browserPreview.onContextMenu((e) =>
    onBrowserPreviewContextMenu(e, options, contextMenu)
  );

  browser.runtime.onMessage.addListener((message) => {
    if (message.event === "themeUpdated") {
      stylePage(options);
    }
  });
});
