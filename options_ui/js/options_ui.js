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
 * @param {object} options
 * @param {object} sources
 * @returns {UIElement}
 */
const makeGlobalColorDropdown = (label, type, options, sources) => {
  const ids = {
    spoiler: `global_${type}_options`,
    source: `global_${type}_source`,
    color: `global_${type}_color`,
    saturationLimit: `global_${type}_saturation_limit`,
    darkness: `global_${type}_darkness`,
    brightness: `global_${type}_brightness`,
  };
  return new Dropdown(label, {
    id: ids.spoiler,
  }).appendChildren([
    new OptionWithLabel(Localizer.getMessage("source")).appendChild(
      createStringSelect(Object.values(sources), Localizer.getMessage, {
        id: ids.source,
      }).setValue(options.source)
    ),
    new OptionWithLabel("Color", { id: ids.color }).appendChild(
      new ColorInput().setColor(options.color)
    ),
    new OptionWithLabel(Localizer.getMessage("saturationLimit"), {
      id: ids.saturationLimit,
    }).appendChild(
      createNumberSelect(0, 1, 0.1).setValue(options.saturationLimit)
    ),
    new OptionWithLabel(Localizer.getMessage("darkness"), {
      id: ids.darkness,
    }).appendChild(createNumberSelect(0, 5, 0.5).setValue(options.darkness)),
    new OptionWithLabel(Localizer.getMessage("brightness"), {
      id: ids.brightness,
    }).appendChild(createNumberSelect(0, 5, 0.5).setValue(options.brightness)),
  ]);
};

/**
 *
 * @param {object} globalOptions
 * @returns {UIElement}
 */
const makeGlobalOptions = (globalOptions) =>
  new OptionsRow().appendChildren([
    new OptionWithLabel("Enabled").appendChild(
      new Checkbox(globalOptions.enabled, { id: "global_enabled" })
    ),
    makeGlobalColorDropdown(
      "Background Options",
      "background",
      globalOptions.background,
      BACKGROUND_SOURCE
    ),
    makeGlobalColorDropdown(
      "Foreground Options",
      "foreground",
      globalOptions.foreground,
      FOREGROUND_SOURCE
    ),
  ]);

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
 * @param {object} options
 * @returns {UIElement}
 */
const makeFaviconOptionsGroup = (options) =>
  new OptionsGroup(Localizer.getMessage("faviconOptions"), {
    id: "global_favicon_options",
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      new OptionWithLabel(Localizer.getMessage("avoidWhite")).appendChild(
        new Checkbox(options.favicon.avoidWhite)
      ),
      new OptionWithLabel(Localizer.getMessage("avoidBlack")).appendChild(
        new Checkbox(options.favicon.avoidBlack)
      ),
    ])
  );

/**
 *
 * @param {object} options
 * @returns {UIElement}
 */
const makePageOptionsGroup = (options) =>
  new OptionsGroup(Localizer.getMessage("pageOptions"), {
    id: "global_page_options",
  }).appendChild(
    new OptionsRow({ classList: ["wrap"] }).appendChildren([
      new OptionWithLabel(Localizer.getMessage("avoidWhite")).appendChild(
        new Checkbox(options.page.avoidWhite)
      ),
      new OptionWithLabel(Localizer.getMessage("avoidBlack")).appendChild(
        new Checkbox(options.page.avoidBlack)
      ),
      new OptionWithLabel(Localizer.getMessage("algo")).appendChild(
        createStringSelect(Object.values(PAGE_COLOR_ALGO)).setValue(
          options.page.colorAlgo
        )
      ),
      new OptionWithLabel(
        Localizer.getMessage("pageCaptureHeight")
      ).appendChild(new NumberInput(options.page.captureHeight, 1, 500)),
    ])
  );

/**
 *
 * @param {object} options
 * @returns {UIElement}
 */
const makeTriggersOptions = (options) => {
  const row = new OptionsRow({
    classList: ["wrap"],
  });
  for (const trigger of Object.keys(TRIGGER)) {
    row.appendChild(
      new OptionWithLabel(Localizer.getMessage(trigger)).appendChild(
        new Checkbox(options.triggers.includes(trigger))
      )
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
 * @param {object} options
 * @returns {UIElement}
 */
const makeGlobalSourceOptions = (options) =>
  new OptionsRow().appendChildren([
    makeFaviconOptionsGroup(options),
    makePageOptionsGroup(options),
  ]);

/**
 *
 * @returns {UIElement}
 */
const makeFooter = () =>
  new Footer().appendChildren([new Button("Help"), new Button("Reset")]);

/**
 *
 * @param {Options} options
 */
export const makeOptionsUI = (options) => {
  const globalOptions = options.getGlobalOptions();

  const optionsUI = new OptionsCol().appendChildren([
    makeTitle(),
    makeGlobalOptions(globalOptions),
    makeBrowserPreview(),
    makeTriggersOptions(globalOptions),
    makeGlobalSourceOptions(globalOptions),
    makeFooter(),
  ]);

  const body = document.querySelector("body");
  body.appendChild(optionsUI.draw());
};
