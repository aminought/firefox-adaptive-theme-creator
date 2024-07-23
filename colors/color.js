const LUMINANCE_THRESHOLD = 0.4;

export class Color {
  constructor(color) {
    this.color = chroma(color);
  }

  getForeground() {
    const isBright = this.color.luminance() > LUMINANCE_THRESHOLD;
    return new Color(isBright ? "#000" : "#FFF");
  }

  limitSaturation(limit) {
    const saturation = this.color.get("hsl.s");
    const color = this.color.set("hsl.s", saturation * limit);
    return new Color(color);
  }

  darken(value) {
    return new Color(this.color.darken(value));
  }

  brighten(value) {
    return new Color(this.color.brighten(value));
  }

  css() {
    return this.color.css();
  }
}
