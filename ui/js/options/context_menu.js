import {
  BACKGROUND_SOURCE,
  FOREGROUND_SOURCE,
} from "../../../shared/constants.js";
import { Div, Popup } from "../../../lib/elements/elements.js";
import {
  makeCheckboxOption,
  makeColorInputOption,
  makeNumberSelectOption,
  makeStringSelect,
  makeStringSelectOption,
} from "../utils/option_elements.js";

import { Localizer } from "../utils/localizer.js";
import { Options } from "../../../shared/options.js";
import { Part } from "../../../shared/browser_parts.js";

export class ContextMenu extends Div {
  /**
   *
   * @param {Array<Part>} parts
   * @param {Options} options
   * @param {object} params
   * @param {string} params.id
   * @param {Array<string>} params.classList
   */
  constructor(parts, options, { id = null, classList = [] } = {}) {
    super({ id, classList: ["context_menu", ...classList] });
    this.parts = parts;
    this.options = options;

    this.select = makeStringSelect(
      this.parts[0].name,
      this.parts.map((part) => part.name),
      Localizer.localizePart,
      {
        classList: ["context_menu_select"],
        itemClassList: ["context_menu_select_item"],
        alignmentX: Popup.ALIGNMENT_X.LEFT,
        orientation: Popup.ORIENTATION.VERTICAL,
      }
    );
    this.items = new Div({ classList: ["context_menu_items"] });

    this.appendChild(this.select);
    this.appendChild(this.items);

    this.popup = new Popup(this, {
      alignmentX: Popup.ALIGNMENT_X.OFF,
      alignmentY: Popup.ALIGNMENT_Y.OFF,
      orientation: Popup.ORIENTATION.VERTICAL,
    });

    this.select.addOnChange((partName) => {
      const [part] = this.parts.filter((p) => p.name === partName);
      this.updateItems(part);
      this.popup.reposition();
    });

    this.updateItems(this.parts[0]);
  }

  /**
   *
   * @param {Part} part
   * @returns {ContextMenu}
   */
  updateItems(part) {
    this.items.removeChildren();
    const makeId = (option) => `parts.${part.name}.${option}`;
    const ids = {
      enabled: makeId("enabled"),
      inheritance: makeId("inheritance"),
      source: makeId("source"),
      color: makeId("color"),
      saturationLimit: makeId("saturationLimit"),
      darkness: makeId("darkness"),
      brightness: makeId("brightness"),
    };
    this.items.appendChildren([
      makeCheckboxOption(ids.enabled, this.options).addOnChange(() =>
        this.popup.reposition()
      ),
      makeStringSelectOption(
        ids.inheritance,
        this.options,
        part.getInheritances(),
        Localizer.localizeInheritance
      ).addOnChange(() => this.popup.reposition()),
      makeStringSelectOption(
        ids.source,
        this.options,
        Object.values(
          part.isForeground ? FOREGROUND_SOURCE : BACKGROUND_SOURCE
        ),
        part.isForeground
          ? Localizer.localizeForegroundSource
          : Localizer.localizeBackgroundSource
      ).addOnChange(() => this.popup.reposition()),
      makeColorInputOption(ids.color, this.options),
      makeNumberSelectOption(ids.saturationLimit, this.options, 0, 1, 0.1),
      makeNumberSelectOption(ids.darkness, this.options, 0, 5, 0.5),
      makeNumberSelectOption(ids.brightness, this.options, 0, 5, 0.5),
    ]);
    return this;
  }
}
