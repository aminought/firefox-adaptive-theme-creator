/* eslint-disable max-lines */

import {
  BACKGROUND_SOURCE,
  FOREGROUND_SOURCE,
  PAGE_CAPTURE_ALGO,
  PAGE_COLOR_ALGO,
  TRIGGER,
} from "../../shared/constants.js";
import { createNumberSelect, createStringSelect } from "./utils/select.js";

import { Button } from "./ui_elements/button.js";
import { Checkbox } from "./ui_elements/checkbox.js";
import { ColorInput } from "./ui_elements/color_input.js";
import { Dropdown } from "./ui_elements/dropdown.js";
import { Firefox } from "./firefox/firefox.js";
import { Footer } from "./footer.js";
import { Localizer } from "./utils/localizer.js";
import { NumberInput } from "./ui_elements/number_input.js";
import { Option } from "./option.js";
import { Options } from "../../shared/options.js";
import { OptionsCol } from "./options_col.js";
import { OptionsGroup } from "./options_group.js";
import { OptionsRow } from "./options_row.js";
import { PopupController } from "./popup_controller.js";
import { StatusBar } from "./status_bar.js";
import { Title } from "./title.js";
import { UIElement } from "./ui_elements/ui_element.js";

/**
 *
 * @returns {UIElement}
 */
const makeTitle = () => new OptionsRow().appendChild(new Title("title"));

/**
 *
 * @param {string} type
 * @param {Options} options
 * @param {object} sources
 * @returns {UIElement}
 */
const makeGlobalColorDropdown = (type, options, sources) => {
  const ids = {
    dropdown: `global_${type}_options`,
    source: `global.${type}.source`,
    color: `global.${type}.color`,
    saturationLimit: `global.${type}.saturationLimit`,
    darkness: `global.${type}.darkness`,
    brightness: `global.${type}.brightness`,
  };
  const colorInput = new ColorInput(options.get(ids.color));
  return new Dropdown(Localizer.localizeOptionGroup(type), {
    id: ids.dropdown,
  }).appendChildren([
    new Option(ids.source, options).appendChild(
      createStringSelect(
        options.get(ids.source),
        Object.values(sources),
        type === "foreground"
          ? Localizer.localizeForegroundSource
          : Localizer.localizeBackgroundSource
      )
    ),
    new Option(ids.color, options)
      .appendChild(colorInput)
      .setOnChange((value) => {
        const color = value.rgbaString;
        options.set(ids.color, color);
        colorInput.setValue(color).updateBackgroundColor();
      }),
    new Option(ids.saturationLimit, options).appendChild(
      createNumberSelect(options.get(ids.saturationLimit), 0, 1, 0.1)
    ),
    new Option(ids.darkness, options).appendChild(
      createNumberSelect(options.get(ids.darkness), 0, 5, 0.5)
    ),
    new Option(ids.brightness, options).appendChild(
      createNumberSelect(options.get(ids.brightness), 0, 5, 0.5)
    ),
  ]);
};

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makeGlobalOptions = (options) => {
  const ids = {
    enabled: "global.enabled",
  };
  return new OptionsRow().appendChildren([
    new Option(ids.enabled, options).appendChild(
      new Checkbox(options.get(ids.enabled))
    ),
    makeGlobalColorDropdown("background", options, BACKGROUND_SOURCE),
    makeGlobalColorDropdown("foreground", options, FOREGROUND_SOURCE),
  ]);
};

/**
 *
 * @param {Options} options
 * @param {string} tabUrl
 * @returns {UIElement}
 */
const makeFirefoxPreview = (options, tabUrl) =>
  new OptionsRow().appendChild(new Firefox(options, tabUrl));

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makeFaviconOptionsGroup = (options) => {
  const ids = {
    group: "global_favicon_options",
    avoidWhite: "global.favicon.avoidWhite",
    avoidBlack: "global.favicon.avoidBlack",
  };
  return new OptionsGroup("global.favicon", {
    id: ids.group,
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      new Option(ids.avoidWhite, options).appendChild(
        new Checkbox(options.get(ids.avoidWhite))
      ),
      new Option(ids.avoidBlack, options).appendChild(
        new Checkbox(options.get(ids.avoidBlack))
      ),
    ])
  );
};

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makePageOptionsGroup = (options) => {
  const ids = {
    group: "global_page_options",
    avoidWhite: "global.page.avoidWhite",
    avoidBlack: "global.page.avoidBlack",
    colorAlgo: "global.page.colorAlgo",
    captureAlgo: "global.page.captureAlgo",
    captureHeight: "global.page.captureHeight",
    captureWidth: "global.page.captureWidth",
  };
  return new OptionsGroup("global.page", {
    id: ids.group,
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      new Option(ids.avoidWhite, options).appendChild(
        new Checkbox(options.get(ids.avoidWhite))
      ),
      new Option(ids.avoidBlack, options).appendChild(
        new Checkbox(options.get(ids.avoidBlack))
      ),
      new Option(ids.colorAlgo, options).appendChild(
        createStringSelect(
          options.get(ids.colorAlgo),
          Object.values(PAGE_COLOR_ALGO),
          Localizer.localizePageColorAlgo
        )
      ),
      new Option(ids.captureAlgo, options).appendChild(
        createStringSelect(
          options.get(ids.captureAlgo),
          Object.values(PAGE_CAPTURE_ALGO),
          Localizer.localizePageCaptureAlgo
        )
      ),
      new Option(ids.captureHeight, options).appendChild(
        new NumberInput(options.get(ids.captureHeight), 1, 500)
      ),
      new Option(ids.captureWidth, options).appendChild(
        new NumberInput(options.get(ids.captureWidth), 1, 500)
      ),
    ])
  );
};

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makeTriggersOptions = (options) => {
  const makeId = (trigger) => `trigger.${trigger}`;
  const optionPath = "global.triggers";
  const row = new OptionsRow({
    classList: ["wrap"],
  });
  for (const trigger of Object.keys(TRIGGER)) {
    row.appendChild(
      new Option(makeId(trigger), options, {
        localize: Localizer.localizeTrigger,
      })
        .appendChild(new Checkbox(options.get(optionPath).includes(trigger)))
        .setOnChange((value) => {
          const triggers = new Set(options.get(optionPath));
          if (value) {
            triggers.add(trigger);
          } else {
            triggers.delete(trigger);
          }
          options.set(optionPath, Array.from(triggers));
        })
        .setOnReset((child) => {
          const triggers = options.get(optionPath);
          child.setValue(triggers.includes(trigger));
        })
    );
  }
  return new OptionsRow({
    id: "global_triggers_options",
  }).appendChild(new OptionsGroup("global.triggers").appendChild(row));
};

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makeGlobalSourceOptions = (options) =>
  new OptionsRow().appendChildren([
    makeFaviconOptionsGroup(options),
    makePageOptionsGroup(options),
  ]);

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makeFooter = (options) =>
  new Footer().appendChildren([
    new Button("Help"),
    new Button("Reset").setOnClick(async () => {
      options.reset();
      await options.save();
      PopupController.showFixed(new StatusBar("options_reset"));
    }),
  ]);

/**
 *
 * @param {Options} options
 */
export const makeOptionsUI = async (options) => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const optionsUI = new OptionsCol().appendChildren([
    makeTitle(),
    makeGlobalOptions(options),
    makeFirefoxPreview(options, tab.url),
    makeTriggersOptions(options),
    makeGlobalSourceOptions(options),
    makeFooter(options),
  ]);

  const body = document.querySelector("body");
  body.appendChild(optionsUI.draw());
};
