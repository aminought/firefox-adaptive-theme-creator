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
  })
    .appendChild(
      new OptionWithLabel(Localizer.getMessage("source")).appendChild(
        createStringSelect(Object.values(sources), Localizer.getMessage, {
          id: ids.source,
        }).setValue(options.source)
      )
    )
    .appendChild(
      new OptionWithLabel("Color", { id: ids.color }).appendChild(
        new ColorInput().setColor(options.color)
      )
    )
    .appendChild(
      new OptionWithLabel(Localizer.getMessage("saturationLimit"), {
        id: ids.saturationLimit,
      }).appendChild(
        createNumberSelect(0, 1, 0.1).setValue(options.saturationLimit)
      )
    )
    .appendChild(
      new OptionWithLabel(Localizer.getMessage("darkness"), {
        id: ids.darkness,
      }).appendChild(createNumberSelect(0, 5, 0.5).setValue(options.darkness))
    )
    .appendChild(
      new OptionWithLabel(Localizer.getMessage("brightness"), {
        id: ids.brightness,
      }).appendChild(createNumberSelect(0, 5, 0.5).setValue(options.brightness))
    );
};

/**
 *
 * @param {object} globalOptions
 * @returns {UIElement}
 */
const makeGlobalOptions = (globalOptions) =>
  new OptionsRow()
    .appendChild(
      new OptionWithLabel("Enabled").appendChild(
        new Checkbox(globalOptions.enabled, { id: "global_enabled" })
      )
    )
    .appendChild(
      makeGlobalColorDropdown(
        "Background Options",
        "background",
        globalOptions.background,
        BACKGROUND_SOURCE
      )
    )
    .appendChild(
      makeGlobalColorDropdown(
        "Foreground Options",
        "foreground",
        globalOptions.foreground,
        FOREGROUND_SOURCE
      )
    );

/**
 *
 * @returns {UIElement}
 */
const makeBrowserPreview = () =>
  new OptionsRow().appendChild(
    new Div({ id: "browser_preview" }).appendChild(
      new Div({ id: "navigator" })
        .appendChild(
          new Div({ id: "frame", classList: ["part"] }).appendChild(
            new Div({
              id: "tab_selected",
              classList: ["part"],
            }).appendChild(new Label(FILLER, { classList: ["filler"] }))
          )
        )
        .appendChild(
          new Div({ id: "toolbar", classList: ["part"] })
            .appendChild(new Div({ classList: ["toolbar_button"] }))
            .appendChild(new Div({ classList: ["toolbar_button"] }))
            .appendChild(new Div({ classList: ["placeholder"] }))
            .appendChild(new Div({ classList: ["placeholder"] }))
            .appendChild(
              new Div({ id: "toolbar_field", classList: ["part"] }).appendChild(
                new Label(FILLER, { classList: ["filler"] })
              )
            )
            .appendChild(new Div({ classList: ["placeholder"] }))
            .appendChild(new Div({ classList: ["placeholder"] }))
            .appendChild(new Div({ classList: ["placeholder"] }))
            .appendChild(new Div({ classList: ["toolbar_button"] }))
            .appendChild(
              new Div({ id: "popup", classList: ["part"] })
                .appendChild(new Label(FILLER, { classList: ["filler"] }))
                .appendChild(new Label(FILLER, { classList: ["filler"] }))
            )
        )
        .appendChild(
          new Div({ id: "browser" })
            .appendChild(
              new Div({ id: "sidebar", classList: ["part"] })
                .appendChild(new Label(FILLER, { classList: ["filler"] }))
                .appendChild(new Label(FILLER, { classList: ["filler"] }))
                .appendChild(new Label(FILLER, { classList: ["filler"] }))
            )
            .appendChild(new Div({ id: "appcontent", classList: ["part"] }))
        )
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
    new OptionsRow({ classList: ["wrap"] })
      .appendChild(
        new OptionWithLabel(Localizer.getMessage("avoidWhite")).appendChild(
          new Checkbox(options.favicon.avoidWhite)
        )
      )
      .appendChild(
        new OptionWithLabel(Localizer.getMessage("avoidBlack")).appendChild(
          new Checkbox(options.favicon.avoidBlack)
        )
      )
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
    new OptionsRow({ classList: ["wrap"] })
      .appendChild(
        new OptionWithLabel(Localizer.getMessage("avoidWhite")).appendChild(
          new Checkbox(options.page.avoidWhite)
        )
      )
      .appendChild(
        new OptionWithLabel(Localizer.getMessage("avoidBlack")).appendChild(
          new Checkbox(options.page.avoidBlack)
        )
      )
      .appendChild(
        new OptionWithLabel(Localizer.getMessage("algo")).appendChild(
          createStringSelect(Object.values(PAGE_COLOR_ALGO)).setValue(
            options.page.colorAlgo
          )
        )
      )
      .appendChild(
        new OptionWithLabel(
          Localizer.getMessage("pageCaptureHeight")
        ).appendChild(new NumberInput(options.page.captureHeight, 1, 500))
      )
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
  new OptionsRow()
    .appendChild(makeFaviconOptionsGroup(options))
    .appendChild(makePageOptionsGroup(options));

/**
 *
 * @returns {UIElement}
 */
const makeFooter = () =>
  new Footer().appendChild(new Button("Help")).appendChild(new Button("Reset"));

/**
 *
 * @param {Options} options
 */
export const makeOptionsUI = (options) => {
  const globalOptions = options.getGlobalOptions();

  const optionsUI = new OptionsCol()
    .appendChild(makeTitle())
    .appendChild(makeGlobalOptions(globalOptions))
    .appendChild(makeBrowserPreview())
    .appendChild(makeTriggersOptions(globalOptions))
    .appendChild(makeGlobalSourceOptions(globalOptions))
    .appendChild(makeFooter());

  const body = document.querySelector("body");
  body.appendChild(optionsUI.draw());
};
