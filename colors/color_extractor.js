import { Color } from "./color.js";
import { Options } from "../options/options.js";

const AVOID_WHITE_OFFSET = 15;
const AVOID_BLACK_OFFSET = 15;

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
   * @param {object} globalOptions
   * @param {string} source
   * @returns {boolean}
   */
  static isColorInvalid(red, green, blue, globalOptions, source) {
    let sourceOptions = null;
    if (source === Options.SOURCES.FAVICON) {
      sourceOptions = globalOptions.favicon;
    } else if (source === Options.SOURCES.PAGE) {
      sourceOptions = globalOptions.page;
    }
    const min = sourceOptions.avoidBlack ? AVOID_BLACK_OFFSET : 0;
    const max = 255 - (sourceOptions.avoidWhite ? AVOID_WHITE_OFFSET : 0);
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
   * @param {string} source
   * @returns {object[]}
   */
  extractPaletteFromImageData(imageData, width, height, source) {
    const colorPalette = new Map();
    const numPixels = width * height;

    const globalOptions = this.options.getGlobalOptions();

    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      const red = imageData.data[offset];
      const green = imageData.data[offset + 1];
      const blue = imageData.data[offset + 2];

      if (
        ColorExtractor.isColorInvalid(red, green, blue, globalOptions, source)
      ) {
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
   * @param {string} source
   * @returns {object[]}
   */
  extractPaletteFromImage(image, canvas, context, source) {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, image.width, image.height);
    return this.extractPaletteFromImageData(
      imageData,
      image.width,
      image.height,
      source
    );
  }

  /**
   *
   * @param {string} base64Image
   * @param {string} source
   * @returns {object[]}
   */
  getColorPalette(base64Image, source) {
    if (!base64Image) {
      throw new Error("No image provided");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    return new Promise((resolve, reject) => {
      image.onload = () => {
        try {
          const palette = this.extractPaletteFromImage(
            image,
            canvas,
            context,
            source
          );
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
    const palette = await this.getColorPalette(
      base64Image,
      Options.SOURCES.FAVICON
    );
    return palette.length ? new Color(palette[0]) : null;
  }

  /**
   *
   * @param {Tab} tab
   * @returns {Color?}
   */
  async getMostPopularColorFromPage(tab) {
    const globalOptions = this.options.getGlobalOptions();
    const base64Image = await browser.tabs.captureTab(tab.id, {
      rect: {
        x: 0,
        y: 0,
        width: tab.width,
        height: Number(globalOptions.page.captureHeight),
      },
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
            height,
            Options.SOURCES.PAGE
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
