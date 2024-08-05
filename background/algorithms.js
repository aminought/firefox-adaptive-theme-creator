import { Color } from "../shared/color.js";
// eslint-disable-next-line no-unused-vars
import { Palette } from "./palette.js";
import { kmeans } from "../lib/clusterfck/kmeans.js";

/**
 *
 * @param {Palette} palette
 * @returns {Color?}
 */
export const extractColorFromPaletteBasic = (palette) => {
  if (palette.size === 0) {
    return null;
  }

  const [rgb] = palette
    .entries()
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  return new Color(rgb);
};

/**
 *
 * @param {Palette} palette
 * @returns {Color?}
 */
export const extractColorFromPaletteKMeans = (palette) => {
  if (palette.size === 0) {
    return null;
  }

  const colors = palette.keys();

  /** @type {[number, number, number][][]} */
  const clusters = kmeans(colors);

  const clusterIndex = clusters
    .map((cluster) =>
      cluster.map((rgb) => palette.get(rgb)).reduce((a, b) => a + b)
    )
    .reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);

  const cluster = clusters[clusterIndex];

  const [rgb] = cluster
    .map((color) => [color, palette.get(color)])
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  return new Color(rgb);
};
