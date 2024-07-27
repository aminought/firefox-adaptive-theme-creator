import { Color } from "./color.js";

const blobToBase64 = (blob) => {
  const blobUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = blobUrl;
  }).then((img) => {
    URL.revokeObjectURL(blobUrl);
    const [width, height] = [img.width, img.height];
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
  });
};

const imageDataToBlob = (imageData) => {
  const { width, height } = imageData;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve);
  });
};

export class ColorExtractor {
  constructor(options) {
    this.options = options;
  }

  isColorInvalid(red, green, blue) {
    const min = this.options.getColorValueOffset();
    const max = 255 - min;
    return (
      isNaN(red) ||
      isNaN(green) ||
      isNaN(blue) ||
      (red < min && green < min && blue < min) ||
      (red > max && green > max && blue > max)
    );
  }

  extractPaletteFromImageData(imageData, width, height) {
    const colorPalette = new Map();
    const numPixels = width * height;

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

  async getMostPopularColorFromFavicon(base64Image) {
    const palette = await this.getColorPalette(base64Image);
    return palette.length ? new Color(palette[0]) : null;
  }

  async getMostPopularColorFromTab() {
    const base64Image = await browser.tabs.captureTab();
    if (!base64Image) {
      throw new Error("No image provided");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    return new Promise((resolve, reject) => {
      image.onload = () => {
        try {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, image.width, 100);

          // console.log("imageData:", imageData);

          // imageDataToBlob(imageData).then((blob) => {
          //   console.log("blob:", blob);
          //   blobToBase64(blob).then((base64) => {
          //     console.log("base64:", base64);
          //   });
          // });

          const palette = this.extractPaletteFromImageData(
            imageData,
            image.width,
            image.height
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
