/* eslint-disable max-lines */

import {
  BACKGROUND_SOURCE,
  FOREGROUND_SOURCE,
  PAGE_CAPTURE_ALGO,
  PAGE_COLOR_ALGO,
  THEME,
  TRIGGER,
} from "../../shared/constants.js";
import { Button, Checkbox, Dropdown } from "../../lib/elements/elements.js";
import {
  makeCheckboxOption,
  makeColorInputOption,
  makeNumberInputOption,
  makeNumberSelectOption,
  makeStringSelectOption,
} from "./utils/option_elements.js";

import { Firefox } from "./firefox/firefox.js";
import { Footer } from "./options/footer.js";
import { Localizer } from "./utils/localizer.js";
import { Option } from "./options/option.js";
import { Options } from "../../shared/options.js";
import { OptionsCol } from "./options/options_col.js";
import { OptionsGroup } from "./options/options_group.js";
import { OptionsRow } from "./options/options_row.js";
import { StatusBar } from "./options/status_bar.js";
import { Title } from "./options/title.js";

/**
 *
 * @returns {Title}
 */
const buildTitle = () =>
  new OptionsRow().appendChild(
    new Title().setText(Localizer.getMessage("title"))
  );

/**
 *
 * @param {string} type
 * @param {Options} options
 * @param {object} sources
 * @returns {Dropdown}
 */
const buildGlobalColorDropdown = (type, options, sources) => {
  const ids = {
    dropdown: `global_${type}_options`,
    source: `global.${type}.source`,
    color: `global.${type}.color`,
    saturationLimit: `global.${type}.saturationLimit`,
    darkness: `global.${type}.darkness`,
    brightness: `global.${type}.brightness`,
  };
  return new Dropdown({ id: ids.dropdown })
    .setText(Localizer.localizeOptionGroup(type))
    .appendDropdownItems([
      makeStringSelectOption(
        ids.source,
        options,
        Object.values(sources),
        type === "foreground"
          ? Localizer.localizeForegroundSource
          : Localizer.localizeBackgroundSource
      ),
      makeColorInputOption(ids.color, options),
      makeNumberSelectOption(ids.saturationLimit, options, 0, 1, 0.1),
      makeNumberSelectOption(ids.darkness, options, 0, 5, 0.5),
      makeNumberSelectOption(ids.brightness, options, 0, 5, 0.5),
    ]);
};

/**
 *
 * @param {Options} options
 * @returns {OptionsCol}
 */
const buildGlobalOptions = (options) => {
  const ids = {
    enabled: "global.enabled",
    theme: "global.theme",
  };
  return new OptionsCol().appendChildren([
    new OptionsRow().appendChildren([
      new OptionsCol().appendChildren([
        makeCheckboxOption(ids.enabled, options),
      ]),
      new OptionsRow().appendChildren([
        buildGlobalColorDropdown("background", options, BACKGROUND_SOURCE),
        buildGlobalColorDropdown("foreground", options, FOREGROUND_SOURCE),
      ]),
    ]),
    new OptionsRow({ classList: ["left"] }).appendChild(
      makeStringSelectOption(
        ids.theme,
        options,
        Object.values(THEME),
        Localizer.localizeTheme
      )
    ),
  ]);
};

/**
 *
 * @param {Options} options
 * @param {string} tabUrl
 * @returns {OptionsRow}
 */
const buildFirefoxPreview = (options, tabUrl) =>
  new OptionsRow().appendChild(new Firefox(options, tabUrl));

/**
 *
 * @param {Options} options
 * @returns {OptionsGroup}
 */
const buildFaviconOptionsGroup = (options) => {
  const ids = {
    group: "global_favicon_options",
    avoidWhite: "global.favicon.avoidWhite",
    avoidBlack: "global.favicon.avoidBlack",
  };
  return new OptionsGroup("global.favicon", {
    id: ids.group,
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      makeCheckboxOption(ids.avoidWhite, options),
      makeCheckboxOption(ids.avoidBlack, options),
    ])
  );
};

/**
 *
 * @param {Options} options
 * @returns {OptionsGroup}
 */
const buildPageOptionsGroup = (options) => {
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
      makeCheckboxOption(ids.avoidWhite, options),
      makeCheckboxOption(ids.avoidBlack, options),
      makeStringSelectOption(
        ids.colorAlgo,
        options,
        Object.values(PAGE_COLOR_ALGO),
        Localizer.localizePageColorAlgo
      ),
      makeStringSelectOption(
        ids.captureAlgo,
        options,
        Object.values(PAGE_CAPTURE_ALGO),
        Localizer.localizePageCaptureAlgo
      ),
      makeNumberInputOption(ids.captureHeight, options, 1, 500),
      makeNumberInputOption(ids.captureWidth, options, 1, 500),
    ])
  );
};

/**
 *
 * @param {Options} options
 * @returns {OptionsRow}
 */
const buildTriggersOptions = (options) => {
  const makeId = (trigger) => `trigger.${trigger}`;
  const optionPath = "global.triggers";
  const row = new OptionsRow({
    classList: ["wrap"],
  });
  for (const trigger of Object.keys(TRIGGER)) {
    row.appendChild(
      new Option(makeId(trigger), options, {
        localize: Localizer.localizeTrigger,
      }).setInputElement(
        new Checkbox().setValue(options.get(optionPath).includes(trigger)),
        {
          onChange: (value) => {
            const triggers = new Set(options.get(optionPath));
            if (value) {
              triggers.add(trigger);
            } else {
              triggers.delete(trigger);
            }
            options.set(optionPath, Array.from(triggers));
          },
          onReset: (element) => {
            const triggers = options.get(optionPath);
            element.setValue(triggers.includes(trigger));
          },
        }
      )
    );
  }
  return new OptionsRow({
    id: "global_triggers_options",
  }).appendChild(new OptionsGroup("global.triggers").addToGroup(row));
};

/**
 *
 * @param {Options} options
 * @returns {OptionsRow}
 */
const buildGlobalSourceOptions = (options) =>
  new OptionsRow().appendChildren([
    buildFaviconOptionsGroup(options),
    buildPageOptionsGroup(options),
  ]);

/**
 *
 * @param {Options} options
 * @returns {Footer}
 */
const buildFooter = (options) =>
  new Footer().appendChildren([
    new Button().setText("Help"),
    new Button().setText("Reset").addOnClick(async () => {
      options.reset();
      await options.save();
      new StatusBar(true).setText("options_reset").show();
    }),
  ]);

/**
 *
 * @param {Options} options
 */
export const buildUI = async (options) => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const optionsUI = new OptionsCol().appendChildren([
    buildTitle(),
    buildGlobalOptions(options),
    buildFirefoxPreview(options, tab.url),
    buildTriggersOptions(options),
    buildGlobalSourceOptions(options),
    buildFooter(options),
  ]);

  const body = document.querySelector("body");
  body.appendChild(optionsUI.draw());
};
