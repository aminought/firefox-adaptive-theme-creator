import {
  BACKGROUND_SOURCE,
  FOREGROUND_SOURCE,
} from "../../../shared/constants.js";
import { createNumberSelect, createStringSelect } from "../utils/select.js";

import { Checkbox } from "../ui_elements/checkbox.js";
import { ColorInput } from "../ui_elements/color_input.js";
import { Div } from "../ui_elements/div.js";
import { Localizer } from "../utils/localizer.js";
import { ORIENTATION } from "../ui_elements/select_popup.js";
import { Option } from "../option.js";
import { Options } from "../../../shared/options.js";
import { POSITION } from "../utils/positions.js";
import { Part } from "../../../shared/browser_parts.js";
import { PopupController } from "../popup_controller.js";
import { StatusBar } from "../status_bar.js";

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
        position: POSITION.BELOW_ALIGN_LEFT,
        orientation: ORIENTATION.VERTICAL,
      }
    );
    this.items = new Div({ classList: ["context_menu_items"] });
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  setOnVisualChange(callback) {
    this.onVisualChange = callback;
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
      new Option(ids.enabled, this.options)
        .appendChild(new Checkbox(this.options.get(ids.enabled)))
        .setOnChange((value) => {
          this.options.set(ids.enabled, value);
          this.onVisualChange();
        }),
      new Option(ids.inheritance, this.options)
        .appendChild(
          createStringSelect(
            this.options.get(ids.inheritance),
            part.getInheritances(),
            Localizer.localizeInheritance
          )
        )
        .setOnChange((value) => {
          this.options.set(ids.inheritance, value);
          this.onVisualChange();
        }),
      new Option(ids.source, this.options)
        .appendChild(
          createStringSelect(
            this.options.get(ids.source),
            Object.values(
              part.isForeground ? FOREGROUND_SOURCE : BACKGROUND_SOURCE
            ),
            part.isForeground
              ? Localizer.localizeForegroundSource
              : Localizer.localizeBackgroundSource
          )
        )
        .setOnChange((value) => {
          this.options.set(ids.source, value);
          this.onVisualChange();
        }),
      new Option(ids.color, this.options)
        .appendChild(colorInput)
        .setOnChange((value) => {
          const color = value.rgbaString;
          this.options.set(ids.color, color);
          colorInput.setValue(color).updateBackgroundColor();
        }),
      new Option(ids.saturationLimit, this.options).appendChild(
        createNumberSelect(this.options.get(ids.saturationLimit), 0, 1, 0.1)
      ),
      new Option(ids.darkness, this.options).appendChild(
        createNumberSelect(this.options.get(ids.darkness), 0, 5, 0.5)
      ),
      new Option(ids.brightness, this.options).appendChild(
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
      this.onVisualChange?.();
    });

    this.element.appendChild(this.select.draw());
    this.element.appendChild(this.items.draw());

    return this.element;
  }
}
