function limitSaturation(color, saturationLimit) {
    const saturation = color.get('hsl.s');
    return color.set('hsl.s', saturation * saturationLimit);
}

function calculateFgColor(color) {
    const isBright = color.luminance() > 0.4;
    return isBright ? chroma('#000') : chroma('#FFF');
}
