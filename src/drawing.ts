import { Color } from "./types";

export function bg(canvas, data) {
  for (let i = 0; i < canvas.height; i++) {
    for (let j = 0; j < canvas.width; j++) {
      data[j * 4 + i * 4 * canvas.width] = 0;
      data[1 + j * 4 + i * 4 * canvas.width] = 153;
      data[2 + j * 4 + i * 4 * canvas.width] = 204;
      data[3 + j * 4 + i * 4 * canvas.width] = 255;
    }
  }
}

export function setPixel(
  canvas,
  data: Uint8ClampedArray,
  x: number,
  y: number,
  color: Color
) {
  // TODO huh, setPixel with non-integers?
  x = Math.floor(x) * 4;
  y = Math.floor(y) * 4 * canvas.width;
  data[0 + x + y] = color.r;
  data[1 + x + y] = color.g;
  data[2 + x + y] = color.b;
  data[3 + x + y] = color.a;
}