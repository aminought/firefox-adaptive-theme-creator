const LUMINANCE_THRESHOLD = 0.4;

// eslint-disable-next-line no-unused-vars
const calculateFgColor = (color) => {
  const isBright = color.luminance() > LUMINANCE_THRESHOLD;
  return isBright ? chroma("#000") : chroma("#FFF");
};

// eslint-disable-next-line no-unused-vars
const limitSaturation = (color, saturationLimit) => {
  const saturation = color.get("hsl.s");
  return color.set("hsl.s", saturation * saturationLimit);
};
