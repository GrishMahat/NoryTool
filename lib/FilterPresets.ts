/** @format */

interface FilterValues {
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

export const FilterPresets: Record<string, FilterValues> = {
  Normal: {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  },
  Vintage: {
    brightness: 120,
    contrast: 90,
    saturate: 85,
    blur: 0,
    hueRotate: 20,
    grayscale: 20,
    sepia: 30,
    invert: 0,
  },
  Noir: {
    brightness: 110,
    contrast: 130,
    saturate: 0,
    blur: 0,
    hueRotate: 0,
    grayscale: 100,
    sepia: 0,
    invert: 0,
  },
  Vivid: {
    brightness: 110,
    contrast: 120,
    saturate: 150,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  },
  Dreamy: {
    brightness: 105,
    contrast: 90,
    saturate: 110,
    blur: 1.5,
    hueRotate: 0,
    grayscale: 0,
    sepia: 20,
    invert: 0,
  },
};
