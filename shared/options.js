import { BACKGROUND_SOURCE, INHERITANCE } from "./constants.js";

import { DEFAULT_OPTIONS } from "./default_options.js";

export class Options {
  constructor(storage) {
    this.storage = storage;
    this.resetCallbacks = [];
    this.reset();
  }

  getGlobalOptions() {
    return this.options.global;
  }

  getPartOptions(partName) {
    return this.options.parts[partName];
  }

  /**
   *
   * @param {string} path
   * @returns {any?}
   */
  get(path) {
    let value = this.options;
    for (const item of path.split(".")) {
      if (item in value) {
        value = value[item];
        continue;
      }
      return null;
    }
    return value;
  }

  /**
   *
   * @param {string} path
   * @param {any?} value
   */
  set(path, value) {
    const items = path.split(".");
    const beforeLastItems = items.slice(0, items.length - 1);
    const lastItem = items[items.length - 1];

    let beforeLast = this.options;
    for (const item of beforeLastItems) {
      if (item in beforeLast) {
        beforeLast = beforeLast[item];
        continue;
      }
      throw new Error(`no ${path} in options`);
    }

    if (lastItem in beforeLast) {
      beforeLast[lastItem] = value;
      return;
    }
    throw new Error(`no ${path} in options`);
  }

  async load() {
    const options = await this.storage.get();
    for (const key in options) {
      if (key in this.options) {
        this.options[key] = options[key];
      }
    }
  }

  async save() {
    await this.storage.set(this.options);
  }

  registerResetCallback(callback) {
    this.resetCallbacks.push(callback);
  }

  reset() {
    this.options = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
    for (const callback of this.resetCallbacks) {
      callback();
    }
  }

  /**
   *
   * @param {string} source
   * @returns {boolean}
   */
  isSourceNeeded(source) {
    if (
      this.options.global.background.source === source ||
      this.options.global.foreground.source === source
    ) {
      return true;
    }

    for (const part of Object.values(this.options.parts)) {
      if (
        part.enabled &&
        part.inheritance === INHERITANCE.OFF &&
        part.source === source
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   *
   * @returns {boolean}
   */
  isPageColorNeeded() {
    return this.isSourceNeeded(BACKGROUND_SOURCE.PAGE);
  }

  /**
   *
   * @returns {boolean}
   */
  isFaviconColorNeeded() {
    return this.isSourceNeeded(BACKGROUND_SOURCE.FAVICON);
  }
}
