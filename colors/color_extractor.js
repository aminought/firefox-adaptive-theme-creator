import { Color } from "./color.js";
// eslint-disable-next-line no-unused-vars
import { Options } from "../options/options.js";

export class ColorExtractor {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   *
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @param {number} colorValueOffset
   * @returns {boolean}
   */
  // eslint-disable-next-line max-params
  static isColorInvalid(red, green, blue, colorValueOffset) {
    const min = colorValueOffset;
    const max = 255 - min;
    return (
      isNaN(red) ||
      isNaN(green) ||
      isNaN(blue) ||
      (red < min && green < min && blue < min) ||
      (red > max && green > max && blue > max)
    );
  }

  /**
   *
   * @param {ImageData} imageData
   * @param {number} width
   * @param {number} height
   * @returns {object[]}
   */
  extractPaletteFromImageData(imageData, width, height) {
    const colorPalette = new Map();
    const numPixels = width * height;

    const { colorValueOffset } = this.options.getGlobalOptions();

    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      const red = imageData.data[offset];
      const green = imageData.data[offset + 1];
      const blue = imageData.data[offset + 2];

      if (ColorExtractor.isColorInvalid(red, green, blue, colorValueOffset)) {
        continue;
      }

      const color = `${red},${green},${blue}`;
      colorPalette.set(color, (colorPalette.get(color) || 0) + 1);
    }

    const palette = Array.from(colorPalette.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.min(10, colorPalette.size))
      .map(([color]) => color.split(",").map(Number));

    return palette;
  }

  /**
   *
   * @param {HTMLImageElement} image
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} context
   * @returns {object[]}
   */
  extractPaletteFromImage(image, canvas, context) {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, image.width, image.height);
    return this.extractPaletteFromImageData(
      imageData,
      image.width,
      image.height
    );
  }

  /**
   *
   * @param {string} base64Image
   * @returns {object[]}
   */
  getColorPalette(base64Image) {
    if (!base64Image) {
      throw new Error("No image provided");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    return new Promise((resolve, reject) => {
      image.onload = () => {
        try {
          const palette = this.extractPaletteFromImage(image, canvas, context);
          resolve(palette);
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = reject;
      image.src = base64Image;
    });
  }

  /**
   *
   * @param {string} base64Image
   * @returns {Color?}
   */
  async getMostPopularColorFromFavicon(base64Image) {
    const palette = await this.getColorPalette(base64Image);
    return palette.length ? new Color(palette[0]) : null;
  }

  /**
   *
   * @param {Tab} tab
   * @returns {Color?}
   */
  async getMostPopularColorFromPage(tab) {
    const { pageCaptureHeight } = this.options.getGlobalOptions();
    const base64Image = await browser.tabs.captureTab(tab.id, {
      rect: { x: 0, y: 0, width: tab.width, height: Number(pageCaptureHeight) },
    });
    if (!base64Image) {
      throw new Error("No image provided");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    return new Promise((resolve, reject) => {
      image.onload = () => {
        try {
          const { width, height } = image;
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, width, height);

          const palette = this.extractPaletteFromImageData(
            imageData,
            width,
            height
          );
          resolve(palette.length ? new Color(palette[0]) : null);
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = reject;
      image.src = base64Image;
    });
  }
}
