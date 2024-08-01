import {
  createNumberDropdown,
  createStringDropdown,
} from "./dropdown/dropdown_utils.js";
import { ColorPicker } from "./color_picker.js";
import { HelpPopup } from "./help_popup.js";
import { Options } from "../../shared/options.js";
import { PopupController } from "./popup_controller.js";
import { createCheckbox } from "./checkbox/checkbox_utils.js";
import { setBackgroundColor } from "./utils/html.js";

export class Form {
  static body = document.querySelector("body");

  static sourceOption = document.getElementById("source_option");
  static saturationLimitOption = document.getElementById(
    "saturation_limit_option"
  );
  static darknessOption = document.getElementById("darkness_option");
  static brightnessOption = document.getElementById("brightness_option");
  static faviconAvoidWhiteOption = document.getElementById(
    "favicon_avoid_white_option"
  );
  static faviconAvoidBlackOption = document.getElementById(
    "favicon_avoid_black_option"
  );
  static pageAvoidWhiteOption = document.getElementById(
    "page_avoid_white_option"
  );
  static pageAvoidBlackOption = document.getElementById(
    "page_avoid_black_option"
  );

  static color = document.getElementById("color");
  static colorPreview = document.getElementById("color_preview");
  static pageCaptureHeight = document.getElementById("page_capture_height");
  static helpButton = document.getElementById("help_button");
  static resetButton = document.getElementById("reset_button");

  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;

    this.sourceDropdown = createStringDropdown(
      "source",
      Object.values(Options.SOURCES)
    );
    Form.sourceOption.appendChild(this.sourceDropdown.element);

    this.saturationLimitDropdown = createNumberDropdown(
      "saturation_limit",
      0.1,
      1.0,
      0.1
    );
    Form.saturationLimitOption.appendChild(
      this.saturationLimitDropdown.element
    );

    this.darknessDropdown = createNumberDropdown("darkness", 0.0, 5.0, 0.5);
    Form.darknessOption.appendChild(this.darknessDropdown.element);

    this.brightnessDropdown = createNumberDropdown("brightness", 0.0, 5.0, 0.5);
    Form.brightnessOption.appendChild(this.brightnessDropdown.element);

    this.faviconAvoidWhiteCheckbox = createCheckbox("favicon_avoid_white");
    Form.faviconAvoidWhiteOption.appendChild(
      this.faviconAvoidWhiteCheckbox.element
    );

    this.faviconAvoidBlackCheckbox = createCheckbox("favicon_avoid_black");
    Form.faviconAvoidBlackOption.appendChild(
      this.faviconAvoidBlackCheckbox.element
    );

    this.pageAvoidWhiteCheckbox = createCheckbox("page_avoid_white");
    Form.pageAvoidWhiteOption.appendChild(this.pageAvoidWhiteCheckbox.element);

    this.pageAvoidBlackCheckbox = createCheckbox("page_avoid_black");
    Form.pageAvoidBlackOption.appendChild(this.pageAvoidBlackCheckbox.element);

    this.loadFromOptions();
    this.setupListeners();
  }

  loadFromOptions() {
    const globalOptions = this.options.getGlobalOptions();

    this.sourceDropdown.value = globalOptions.source;
    Form.loadBackgroundColorOption(Form.colorPreview, globalOptions.color);
    this.saturationLimitDropdown.value = globalOptions.saturationLimit;
    this.darknessDropdown.value = globalOptions.darkness;
    this.brightnessDropdown.value = globalOptions.brightness;
    this.faviconAvoidWhiteCheckbox.value = globalOptions.favicon.avoidWhite;
    this.faviconAvoidBlackCheckbox.value = globalOptions.favicon.avoidBlack;
    Form.loadValueOption(
      Form.pageCaptureHeight,
      globalOptions.page.captureHeight
    );
    this.pageAvoidWhiteCheckbox.value = globalOptions.page.avoidWhite;
    this.pageAvoidBlackCheckbox.value = globalOptions.page.avoidBlack;
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {any} value
   */
  static loadValueOption(element, value) {
    element.value = value;
    element.setAttribute("data-value", value);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {any} value
   */
  static loadCheckedOption(element, value) {
    element.checked = value;
    element.setAttribute("data-value", value);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {any} value
   */
  static loadBackgroundColorOption(element, value) {
    setBackgroundColor(element, value);
  }

  setupListeners() {
    this.sourceDropdown.onChange = (value) =>
      this.saveDropdownValue("source", value);
    Form.colorPreview.onclick = (e) => this.showColorPicker(e, "color");
    this.saturationLimitDropdown.onChange = (value) =>
      this.saveDropdownValue("saturation_limit", value);
    this.darknessDropdown.onChange = (value) =>
      this.saveDropdownValue("darkness", value);
    this.brightnessDropdown.onChange = (value) =>
      this.saveDropdownValue("brightness", value);
    this.faviconAvoidWhiteCheckbox.onChange = (value) =>
      this.saveCheckboxValue("favicon.avoid_white", value);
    this.faviconAvoidBlackCheckbox.onChange = (value) =>
      this.saveCheckboxValue("favicon.avoid_black", value);
    Form.pageCaptureHeight.onchange = (e) =>
      this.saveValue(e, "page.capture_height");
    this.pageAvoidWhiteCheckbox.onChange = (value) =>
      this.saveCheckboxValue("page.avoid_white", value);
    this.pageAvoidBlackCheckbox.onChange = (value) =>
      this.saveCheckboxValue("page.avoid_black", value);

    Form.resetButton.onclick = (e) => this.reset(e);
    Form.helpButton.onclick = (e) => Form.showHelp(e);
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {string} key
   */
  showColorPicker(event, key) {
    event.stopPropagation();
    PopupController.popFor(event.target);
    const colorPicker = new ColorPicker(
      Form.body,
      Form.colorPreview.style.backgroundColor,
      (color) => this.saveBackgroundColor(Form.colorPreview, color, key)
    );

    PopupController.push(colorPicker, event.clientX, event.clientY);
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   */
  async saveDropdownValue(key, value) {
    await this.options.setGlobalOption(key, value);
  }

  /**
   *
   * @param {string} key
   * @param {boolean} value
   */
  async saveCheckboxValue(key, value) {
    await this.options.setGlobalOption(key, value === "true");
  }

  /**
   *
   * @param {Event} event
   * @param {string} key
   */
  async saveChecked(event, key) {
    await this.options.setGlobalOption(key, event.target.checked);
  }

  /**
   *
   * @param {Event} event
   * @param {string} key
   */
  async saveValue(event, key) {
    await this.options.setGlobalOption(key, event.target.value);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {object} color
   * @param {string} key
   */
  async saveBackgroundColor(element, color, key) {
    setBackgroundColor(element, color.rgbaString);
    await this.options.setGlobalOption(key, color.rgbaString);
  }

  /**
   *
   * @param {Event} event
   */
  async reset(event) {
    event.preventDefault();
    await this.options.reset();
    this.loadFromOptions();
  }

  /**
   *
   * @param {MouseEvent} event
   */
  static showHelp(event) {
    event.stopPropagation();
    if (!PopupController.popFor(event.target)) {
      const helpPopup = new HelpPopup(this.body);
      PopupController.push(helpPopup, event.target);
    }
  }
}
