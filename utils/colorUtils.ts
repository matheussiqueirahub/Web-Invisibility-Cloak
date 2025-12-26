/**
 * Converts RGB to HSL.
 * r, g, b are in [0, 255]
 * Returns { h, s, l } where h in [0, 360], s, l in [0, 100]
 */
export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Checks if a pixel matches the target color range.
 * Handles Hue wrapping (e.g. Red is near 0 and 360).
 */
export const isColorMatch = (
  h: number,
  s: number,
  l: number,
  targetHue: number,
  hueThresh: number,
  satThresh: number,
  valThresh: number
): boolean => {
  // Saturation and Lightness check (avoid black/white/gray)
  if (s < satThresh || l < valThresh || l > 95) {
    return false;
  }

  // Hue distance calculation with wrap-around support
  const diff = Math.abs(h - targetHue);
  const distance = Math.min(diff, 360 - diff);

  return distance <= hueThresh;
};