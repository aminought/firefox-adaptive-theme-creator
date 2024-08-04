export class Palette {
  /**
   *
   * @param {[number, number, number]} rgb
   * @returns {string}
   */
  static encodeColor(rgb) {
    return rgb.join(",");
  }

  /**
   *
   * @param {string} encodedColor
   * @returns {[number, number, number]}
   */
  static decodeColor(encodedColor) {
    return encodedColor.split(",").map(Number);
  }

  constructor() {
    /** @type {Map<string, number>} */
    this.palette = new Map();
  }

  /**
   *
   * @param {[number, number, number]} rgb
   * @returns {number}
   */
  get(rgb) {
    return this.palette.get(Palette.encodeColor(rgb));
  }

  /**
   *
   * @param {[number, number, number]} rgb
   * @param {number} count
   */
  set(rgb, count) {
    this.palette.set(Palette.encodeColor(rgb), count);
  }

  /**
   *
   * @returns {[number, number, number][]}
   */
  keys() {
    return Array.from(this.palette.keys()).map(Palette.decodeColor);
  }

  /**
   *
   * @returns {[[number, number, number], number][]}
   */
  entries() {
    return Array.from(this.palette.entries()).map(([key, value]) => [
      Palette.decodeColor(key),
      value,
    ]);
  }

  /**
   * @return {number}
   */
  get size() {
    return this.palette.size;
  }
}
