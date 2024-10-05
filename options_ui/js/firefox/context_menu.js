import {
  BACKGROUND_SOURCE,
  FOREGROUND_SOURCE,
  INHERITANCE,
} from "../../../shared/constants.js";
import { createNumberSelect, createStringSelect } from "../utils/select.js";

import { Checkbox } from "../ui_elements/checkbox.js";
import { ColorInput } from "../ui_elements/color_input.js";
import { Div } from "../ui_elements/div.js";
import { Localizer } from "../utils/localizer.js";
import { ORIENTATION } from "../ui_elements/select_popup.js";
import { OptionWithLabel } from "../option_with_label.js";
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

    this.select = createStringSelect(
      this.parts[0].name,
      this.parts.map((part) => part.name),
      Localizer.localizePart,
      {
        classList: ["context_menu_select"],
        itemClassList: ["context_menu_select_item"],
        orientation: ORIENTATION.VERTICAL,
      }
    );
    this.items = new Div({ classList: ["context_menu_items"] });
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
    const colorInput = new ColorInput(this.options.get(ids.color));
    this.items.appendChildren([
      new OptionWithLabel(ids.enabled, this.options).appendChild(
        new Checkbox(this.options.get(ids.enabled))
      ),
      new OptionWithLabel(ids.inheritance, this.options).appendChild(
        createStringSelect(
          this.options.get(ids.inheritance),
          part.getInheritances(),
          Localizer.localizeInheritance
        )
      ),
      new OptionWithLabel(ids.source, this.options).appendChild(
        createStringSelect(
          this.options.get(ids.source),
          Object.values(
            part.isForeground ? FOREGROUND_SOURCE : BACKGROUND_SOURCE
          ),
          part.isForeground
            ? Localizer.localizeForegroundSource
            : Localizer.localizeBackgroundSource
        )
      ),
      new OptionWithLabel(ids.color, this.options)
        .appendChild(colorInput)
        .setOnChange(async (value) => {
          const color = value.rgbaString;
          this.options.set(ids.color, color);
          colorInput.setValue(color).updateBackgroundColor();
          await this.options.save();
        }),
      new OptionWithLabel(ids.saturationLimit, this.options).appendChild(
        createNumberSelect(this.options.get(ids.saturationLimit), 0, 1, 0.1)
      ),
      new OptionWithLabel(ids.darkness, this.options).appendChild(
        createNumberSelect(this.options.get(ids.darkness), 0, 5, 0.5)
      ),
      new OptionWithLabel(ids.brightness, this.options).appendChild(
        createNumberSelect(this.options.get(ids.brightness), 0, 5, 0.5)
      ),
    ]);
    for (const child of this.items.children) {
      this.items.element.appendChild(child.draw());
    }
    return this;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  draw() {
    this.updateItems(this.parts[0]);

    this.select.setOnChange((partName) => {
      const [part] = this.parts.filter((p) => p.name === partName);
      this.updateItems(part);
    });

    this.element.appendChild(this.select.draw());
    this.element.appendChild(this.items.draw());

    return this.element;
  }
}
