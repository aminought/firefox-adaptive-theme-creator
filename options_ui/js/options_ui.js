/* eslint-disable max-lines */

import {
  BACKGROUND_SOURCE,
  FOREGROUND_SOURCE,
  PAGE_COLOR_ALGO,
  TRIGGER,
} from "../../shared/constants.js";
import { createNumberSelect, createStringSelect } from "./utils/select.js";

import { Button } from "./ui_elements/button.js";
import { Checkbox } from "./ui_elements/checkbox.js";
import { ColorInput } from "./ui_elements/color_input.js";
import { Div } from "./ui_elements/div.js";
import { Dropdown } from "./ui_elements/dropdown.js";
import { Footer } from "./footer.js";
import { Label } from "./ui_elements/label.js";
import { Localizer } from "./utils/localizer.js";
import { NumberInput } from "./ui_elements/number_input.js";
import { OptionWithLabel } from "./option_with_label.js";
import { Options } from "../../shared/options.js";
import { OptionsCol } from "./options_col.js";
import { OptionsGroup } from "./options_group.js";
import { OptionsRow } from "./options_row.js";
import { Title } from "./title.js";
import { UIElement } from "./ui_elements/ui_element.js";

const FILLER = "@".repeat(100);

/**
 *
 * @returns {UIElement}
 */
const makeTitle = () =>
  new OptionsRow().appendChild(new Title("ADAPTIVE THEME CREATOR"));

/**
 *
 * @param {string} label
 * @param {Options} options
 * @param {object} sources
 * @returns {UIElement}
 */
const makeGlobalColorDropdown = (label, type, options, sources) => {
  const ids = {
    dropdown: `global_${type}_options`,
    source: `global.${type}.source`,
    color: `global.${type}.color`,
    saturationLimit: `global.${type}.saturationLimit`,
    darkness: `global.${type}.darkness`,
    brightness: `global.${type}.brightness`,
  };
  const colorInput = new ColorInput(options.get(ids.color));
  return new Dropdown(label, {
    id: ids.dropdown,
  }).appendChildren([
    new OptionWithLabel(
      ids.source,
      Localizer.getMessage("source"),
      options
    ).appendChild(
      createStringSelect(
        options.get(ids.source),
        Object.values(sources),
        Localizer.getMessage
      )
    ),
    new OptionWithLabel(ids.color, "Color", options)
      .appendChild(colorInput)
      .setOnChange(async (value) => {
        const color = value.rgbaString;
        options.set(ids.color, color);
        colorInput.setValue(color).updateBackgroundColor();
        await options.save();
      }),
    new OptionWithLabel(
      ids.saturationLimit,
      Localizer.getMessage("saturationLimit"),
      options
    ).appendChild(
      createNumberSelect(options.get(ids.saturationLimit), 0, 1, 0.1)
    ),
    new OptionWithLabel(
      ids.darkness,
      Localizer.getMessage("darkness"),
      options
    ).appendChild(createNumberSelect(options.get(ids.darkness), 0, 5, 0.5)),
    new OptionWithLabel(
      ids.brightness,
      Localizer.getMessage("brightness"),
      options
    ).appendChild(createNumberSelect(options.get(ids.brightness), 0, 5, 0.5)),
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
    new OptionWithLabel(ids.enabled, "Enabled", options).appendChild(
      new Checkbox(options.get(ids.enabled))
    ),
    makeGlobalColorDropdown(
      "Background Options",
      "background",
      options,
      BACKGROUND_SOURCE
    ),
    makeGlobalColorDropdown(
      "Foreground Options",
      "foreground",
      options,
      FOREGROUND_SOURCE
    ),
  ]);
};

/**
 *
 * @returns {UIElement}
 */
const makeBrowserPreview = () =>
  new OptionsRow().appendChild(
    new Div({ id: "browser_preview" }).appendChild(
      new Div({ id: "navigator" }).appendChildren([
        new Div({ id: "frame", classList: ["part"] }).appendChild(
          new Div({
            id: "tab_selected",
            classList: ["part"],
          }).appendChild(new Label(FILLER, { classList: ["filler"] }))
        ),
        new Div({ id: "toolbar", classList: ["part"] }).appendChildren([
          new Div({ classList: ["toolbar_button"] }),
          new Div({ classList: ["toolbar_button"] }),
          new Div({ classList: ["placeholder"] }),
          new Div({ classList: ["placeholder"] }),
          new Div({ id: "toolbar_field", classList: ["part"] }).appendChild(
            new Label(FILLER, { classList: ["filler"] })
          ),
          new Div({ classList: ["placeholder"] }),
          new Div({ classList: ["placeholder"] }),
          new Div({ classList: ["placeholder"] }),
          new Div({ classList: ["toolbar_button"] }),
          new Div({ id: "popup", classList: ["part"] }).appendChildren([
            new Label(FILLER, { classList: ["filler"] }),
            new Label(FILLER, { classList: ["filler"] }),
          ]),
        ]),
        new Div({ id: "browser" }).appendChildren([
          new Div({ id: "sidebar", classList: ["part"] }).appendChildren([
            new Label(FILLER, { classList: ["filler"] }),
            new Label(FILLER, { classList: ["filler"] }),
            new Label(FILLER, { classList: ["filler"] }),
          ]),
          new Div({ id: "appcontent", classList: ["part"] }),
        ]),
      ])
    )
  );

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
  return new OptionsGroup(Localizer.getMessage("faviconOptions"), {
    id: ids.group,
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      new OptionWithLabel(
        ids.avoidWhite,
        Localizer.getMessage("avoidWhite"),
        options
      ).appendChild(new Checkbox(options.get(ids.avoidWhite))),
      new OptionWithLabel(
        ids.avoidBlack,
        Localizer.getMessage("avoidBlack"),
        options
      ).appendChild(new Checkbox(options.get(ids.avoidBlack))),
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
    captureHeight: "global.page.captureHeight",
  };
  return new OptionsGroup(Localizer.getMessage("pageOptions"), {
    id: ids.group,
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      new OptionWithLabel(
        ids.avoidWhite,
        Localizer.getMessage("avoidWhite"),
        options
      ).appendChild(new Checkbox(options.get(ids.avoidWhite))),
      new OptionWithLabel(
        ids.avoidBlack,
        Localizer.getMessage("avoidBlack"),
        options
      ).appendChild(new Checkbox(options.get(ids.avoidBlack))),
      new OptionWithLabel(
        ids.colorAlgo,
        Localizer.getMessage("algo"),
        options
      ).appendChild(
        createStringSelect(
          options.get(ids.colorAlgo),
          Object.values(PAGE_COLOR_ALGO)
        )
      ),
      new OptionWithLabel(
        ids.captureHeight,
        Localizer.getMessage("pageCaptureHeight"),
        options
      ).appendChild(new NumberInput(options.get(ids.captureHeight), 1, 500)),
    ])
  );
};

/**
 *
 * @param {Options} options
 * @returns {UIElement}
 */
const makeTriggersOptions = (options) => {
  const makeId = (trigger) => `trigger_${trigger}`;
  const optionPath = "global.triggers";
  const row = new OptionsRow({
    classList: ["wrap"],
  });
  for (const trigger of Object.keys(TRIGGER)) {
    row.appendChild(
      new OptionWithLabel(
        makeId(trigger),
        Localizer.getMessage(trigger),
        options
      )
        .appendChild(new Checkbox(options.get(optionPath).includes(trigger)))
        .setOnChange(async (value) => {
          const triggers = new Set(options.get(optionPath));
          if (value) {
            triggers.add(trigger);
          } else {
            triggers.delete(trigger);
          }
          options.set(optionPath, Array.from(triggers));
          await options.save();
        })
        .setOnReset((child) => {
          const triggers = options.get(optionPath);
          child.setValue(triggers.includes(trigger));
        })
    );
  }
  return new OptionsRow({
    id: "global_triggers_options",
  }).appendChild(
    new OptionsGroup(Localizer.getMessage("triggers")).appendChild(row)
  );
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
    }),
  ]);

/**
 *
 * @param {Options} options
 */
export const makeOptionsUI = (options) => {
  const optionsUI = new OptionsCol().appendChildren([
    makeTitle(),
    makeGlobalOptions(options),
    makeBrowserPreview(),
    makeTriggersOptions(options),
    makeGlobalSourceOptions(options),
    makeFooter(options),
  ]);

  const body = document.querySelector("body");
  body.appendChild(optionsUI.draw());
};
