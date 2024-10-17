import {
  Checkbox,
  ColorInput,
  NumberInput,
  Popup,
  Select,
  SelectItem,
} from "../../../lib/elements/elements.js";

import { Localizer } from "./localizer.js";
import { Option } from "../options/option.js";
import { Options } from "../../../shared/options.js";

/**
 *
 * @param {string} currentValue
 * @param {Array<string>} values
 * @param {CallableFunction} localize
 * @param {object} params
 * @param {string} params.id
 * @param {Array<string>} params.classList
 * @param {Array<string>} params.itemClassList
 * @param {string} params.alignmentX
 * @param {string} params.alignmentY
 * @param {string} params.orientation
 * @returns {Option}
 */
export const makeStringSelect = (
  currentValue,
  values,
  localize = Localizer.getMessage,
  {
    classList = [],
    itemClassList = [],
    alignmentX = Popup.ALIGNMENT_X.CENTER,
    alignmentY = Popup.ALIGNMENT_Y.BELOW,
    orientation = Popup.ORIENTATION.HORIZONTAL,
  } = {}
) => {
  const select = new Select({
    classList,
    alignmentX,
    alignmentY,
    orientation,
  });
  for (const value of values) {
    const selectItem = new SelectItem({
      classList: itemClassList,
    })
      .setLabel(localize(value))
      .setValue(value);
    select.addItem(selectItem);
  }
  return select.setLabel(localize(currentValue)).setValue(currentValue);
};

/**
 *
 * @param {string} id
 * @param {Options} options
 * @param {Array<string>} values
 * @param {CallableFunction} localize
 * @param {object} params
 * @param {string} params.id
 * @param {Array<string>} params.classList
 * @param {Array<string>} params.itemClassList
 * @param {string} params.orientation
 * @returns {Option}
 */
export const makeStringSelectOption = (
  id,
  options,
  values,
  localize = Localizer.getMessage,
  {
    classList = [],
    itemClassList = [],
    orientation = Popup.ORIENTATION.HORIZONTAL,
  } = {}
) =>
  new Option(id, options).setInputElement(
    makeStringSelect(options.get(id), values, localize, {
      classList,
      itemClassList,
      orientation,
    }),
    {
      onReset: (element) => {
        const value = options.get(id);
        element.setValue(value).setLabel(localize(value));
      },
    }
  );

/**
 *
 * @param {string} id
 * @param {Options} options
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @param {object} params
 * @param {Array<string>} params.classList
 * @param {Array<string>} params.itemClassList
 * @param {string} params.orientation
 * @returns {Select}
 */
export const makeNumberSelectOption = (
  id,
  options,
  start,
  end,
  step,
  {
    classList = [],
    itemClassList = [],
    orientation = Popup.ORIENTATION.HORIZONTAL,
  } = {}
) => {
  const select = new Select({
    id,
    classList,
    orientation,
  });
  for (let i = start; i <= end; i += step) {
    const value = i.toFixed(1);
    const selectItem = new SelectItem({
      classList: itemClassList,
    })
      .setLabel(value)
      .setValue(value);
    select.addItem(selectItem);
  }
  const currentValue = options.get(id);
  return new Option(id, options).setInputElement(
    select.setValue(currentValue).setLabel(currentValue),
    {
      onReset: (element) => {
        const value = options.get(id);
        element.setLabel(value).setValue(value);
      },
    }
  );
};

/**
 *
 * @param {string} id
 * @param {Options} options
 * @returns {Option}
 */
export const makeColorInputOption = (id, options) =>
  new Option(id, options).setInputElement(
    new ColorInput().setValue(options.get(id))
  );

/**
 *
 * @param {string} id
 * @param {Options} options
 * @returns {Option}
 */
export const makeCheckboxOption = (id, options) =>
  new Option(id, options).setInputElement(
    new Checkbox().setValue(options.get(id))
  );

/**
 *
 * @param {string} id
 * @param {Options} options
 * @param {number} min
 * @param {number} max
 * @returns {Option}
 */
export const makeNumberInputOption = (id, options, min, max) =>
  new Option(id, options).setInputElement(
    new NumberInput(min, max).setValue(options.get(id))
  );
