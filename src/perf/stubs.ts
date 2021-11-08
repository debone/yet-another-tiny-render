import { Color } from "../types";

export const tenByTenCanvas = {
  width: 10,
  height: 10,
};

export const tenByTenDataWhite = new Uint8ClampedArray([
  ...Array(10 * 10 * 4).fill(255),
]);

export const stoByStoCanvas = {
  width: 100,
  height: 100,
};

export const stoByStoDataWhite = new Uint8ClampedArray([
  ...Array(100 * 100 * 4).fill(255),
]);

export const milByMilCanvas = {
  width: 1000,
  height: 1000,
};

export const milByMilDataWhite = new Uint8ClampedArray([
  ...Array(1000 * 1000 * 4).fill(255),
]);

export const sceneCanvas = {
  width: 800,
  height: 450,
};

export const sceneDataWhite = new Uint8ClampedArray([
  ...Array(800 * 450 * 4).fill(255),
]);

export const black: Color = { r: 0, g: 0, b: 0, a: 255 };
