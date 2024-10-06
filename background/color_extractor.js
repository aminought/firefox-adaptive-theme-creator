/* eslint-disable max-lines */
import {
  BACKGROUND_SOURCE,
  PAGE_CAPTURE_ALGO,
  PAGE_COLOR_ALGO,
} from "../shared/constants.js";
import {
  extractColorFromPaletteBasic,
  extractColorFromPaletteKMeans,
} from "./algorithms.js";

import { Options } from "../shared/options.js";
import { Palette } from "./palette.js";

const AVOID_WHITE_OFFSET = 225;
const AVOID_BLACK_OFFSET = 30;

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
   * @returns {boolean}
   */
  static isNaN(red, green, blue) {
    return isNaN(red) || isNaN(green) || isNaN(blue);
  }

  /**
   *
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @param {number} max
   * @returns {boolean}
   */
  static isWhite(red, green, blue, max) {
    return red > max && green > max && blue > max;
  }

  /**
   *
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @param {number} min
   * @returns {boolean}
   */
  static isBlack(red, green, blue, min) {
    return red < min && green < min && blue < min;
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
    if (source === BACKGROUND_SOURCE.FAVICON) {
      sourceOptions = globalOptions.favicon;
    } else if (source === BACKGROUND_SOURCE.PAGE) {
      sourceOptions = globalOptions.page;
    }
    const min = sourceOptions.avoidBlack ? AVOID_BLACK_OFFSET : 0;
    const max = sourceOptions.avoidWhite ? AVOID_WHITE_OFFSET : 255;
    return (
      ColorExtractor.isNaN(red, green, blue) ||
      ColorExtractor.isWhite(red, green, blue, max) ||
      ColorExtractor.isBlack(red, green, blue, min)
    );
  }

  /**
   *
   * @param {ImageData} imageData
   * @param {number} width
   * @param {number} height
   * @param {string} source
   * @returns {Palette}
   */
  extractPaletteFromImageData(imageData, width, height, source) {
    const palette = new Palette();
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

      const rgb = [red, green, blue];
      palette.set(rgb, (palette.get(rgb) || 0) + 1);
    }

    return palette;
  }

  /**
   *
   * @param {Palette} palette
   * @returns {Color?}
   */
  extractColorFromPalette(palette) {
    const algo = this.options.get("global.page.colorAlgo");
    if (algo === PAGE_COLOR_ALGO.BASIC) {
      return extractColorFromPaletteBasic(palette);
    } else if (algo === PAGE_COLOR_ALGO.KMEANS) {
      return extractColorFromPaletteKMeans(palette);
    }
    return null;
  }

  /**
   *
   * @param {HTMLImageElement} image
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} context
   * @param {string} source
   * @returns {Palette}
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
   * @returns {Palette}
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
   * @param {ImageData} imageData
   * @param {string} captureAlgo
   * @param {number} captureWidth
   * @returns {ImageData}
   */
  static captureEdges(imageData, captureAlgo, captureWidth) {
    const { width, height } = imageData;
    const values = [];
    for (let i = 0; i < height; i++) {
      const rowLength = width * 4;
      const rowStart = rowLength * i;
      const rowEnd = rowStart + rowLength;
      const row = imageData.data.slice(rowStart, rowEnd);
      if (
        [PAGE_CAPTURE_ALGO.LEFT_EDGE, PAGE_CAPTURE_ALGO.EDGES].includes(
          captureAlgo
        )
      ) {
        values.push(...row.slice(0, captureWidth * 4));
      }
      if (
        [PAGE_CAPTURE_ALGO.RIGHT_EDGE, PAGE_CAPTURE_ALGO.EDGES].includes(
          captureAlgo
        )
      ) {
        values.push(...row.slice(rowLength - captureWidth * 4, rowLength));
      }
    }
    const widthMap = {
      [PAGE_CAPTURE_ALGO.LEFT_EDGE]: captureWidth,
      [PAGE_CAPTURE_ALGO.RIGHT_EDGE]: captureWidth,
      [PAGE_CAPTURE_ALGO.EDGES]: captureWidth * 2,
    };
    return new ImageData(
      Uint8ClampedArray.from(values),
      widthMap[captureAlgo],
      height
    );
  }

  /**
   *
   * @param {string} base64Image
   * @returns {Color?}
   */
  async getMostPopularColorFromFavicon(base64Image) {
    const palette = await this.getColorPalette(
      base64Image,
      BACKGROUND_SOURCE.FAVICON
    );
    return this.extractColorFromPalette(palette);
  }

  /**
   *
   * @param {Tab} tab
   * @param {number} pageY
   * @returns {Color?}
   */
  async getMostPopularColorFromPage(tab, pageY) {
    const globalOptions = this.options.getGlobalOptions();
    const base64Image = await browser.tabs.captureVisibleTab(tab.windowId, {
      rect: {
        x: 0,
        y: pageY,
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
          let imageData = context.getImageData(0, 0, width, height);

          const { captureAlgo, captureWidth } = globalOptions.page;
          if (captureAlgo !== PAGE_CAPTURE_ALGO.FULL_WIDTH) {
            imageData = ColorExtractor.captureEdges(
              imageData,
              captureAlgo,
              captureWidth
            );
          }

          const palette = this.extractPaletteFromImageData(
            imageData,
            width,
            height,
            BACKGROUND_SOURCE.PAGE
          );
          const color = this.extractColorFromPalette(palette);
          resolve(color);
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = reject;
      image.src = base64Image;
    });
  }
}
