const extractPaletteFromImage = (image, canvas, context) => {
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

    if (!(red === 0 || (red > 240 && green > 240 && blue > 240))) {
      const color = `${red},${green},${blue}`;
      colorPalette.set(color, (colorPalette.get(color) || 0) + 1);
    }
  }

  const palette = Array.from(colorPalette.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(10, colorPalette.size))
    .map(([color]) => color.split(",").map(Number));

  return palette;
};

const getColorPalette = (base64Image) => {
  if (!base64Image) {
    throw new Error("No image provided");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      try {
        const palette = extractPaletteFromImage(image, canvas, context);
        resolve(palette);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        resolve([]);
      }
    };

    image.onerror = reject;
    image.src = base64Image;
  });
};

// eslint-disable-next-line no-unused-vars
const getMostPopularColor = async (base64Image) => {
  try {
    const palette = await getColorPalette(base64Image);
    return palette.length ? chroma(palette[0]) : null;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null;
  }
};

const fixDataUrl = (dataUrl) =>
  new Promise((resolve, reject) => {
    if (!dataUrl.startsWith("data:image/svg")) {
      resolve(dataUrl);
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      const pngDataUrl = canvas.toDataURL("image/png");
      resolve(pngDataUrl);
    };

    image.onerror = reject;
    image.src = dataUrl;
  });

const getDataUrl = (url) =>
  new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "blob";
    request.onload = () => {
      const reader = new FileReader();
      reader.readAsDataURL(request.response);
      reader.onload = (e) => {
        resolve(e.target.result);
      };
    };
    request.send();
  });

// eslint-disable-next-line no-unused-vars
const fixImages = async (images) => {
  if (images.additional_backgrounds) {
    for (let i = 0; i < images.additional_backgrounds.length; ++i) {
      const url = images.additional_backgrounds[i];
      if (url === null) {
        continue;
      }
      let dataUrl = await getDataUrl(url);
      dataUrl = await fixDataUrl(dataUrl);
      // eslint-disable-next-line require-atomic-updates
      images.additional_backgrounds[i] = dataUrl;
    }
  }
  if (images.theme_frame) {
    let dataUrl = await getDataUrl(images.theme_frame);
    dataUrl = await fixDataUrl(dataUrl);
    // eslint-disable-next-line require-atomic-updates
    images.theme_frame = dataUrl;
  }
};
