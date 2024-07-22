import { Color } from "./color.js";

export class ColorExtractor {
  constructor(options) {
    this.options = options;
  }

  isColorInvalid(red, green, blue) {
    const min = this.options.getColorValueOffset();
    const max = 255 - min;
    return (
      (red < min && green < min && blue < min) ||
      (red > max && green > max && blue > max)
    );
  }

  extractPaletteFromImage(image, canvas, context) {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const colorPalette = new Map();
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const numPixels = image.width * image.height;

    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      const red = imageData.data[offset];
      const green = imageData.data[offset + 1];
      const blue = imageData.data[offset + 2];

      if (this.isColorInvalid(red, green, blue)) {
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

  async getMostPopularColor(base64Image) {
    const palette = await this.getColorPalette(base64Image);
    return palette.length ? new Color(palette[0]) : null;
  }
}
