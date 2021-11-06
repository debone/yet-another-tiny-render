import { setPixel } from "./drawing";

import { Color } from "./types";

export function setLine(
  canvas,
  data: Uint8ClampedArray,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: Color
) {
  let steep = false;

  if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
    // if the line is steep, we transpose the image
    [x0, y0] = [y0, x0];
    [y1, x1] = [x1, y1];
    steep = true;
  }

  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }

  for (let x = x0; x <= x1; x++) {
    let t = (x - x0) / (x1 - x0);
    let y = y0 * (1 - t) + y1 * t;

    steep ? setPixel(canvas,data, y, x, color) : setPixel(canvas, data, x, y, color);
  }
}


export default {
  something(canvas, data) {
    let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
    let red1: Color = { r: 174, g: 74, b: 77, a: 255 };
    for (let k = 0; k < 100; k++) {
      setPixel(canvas, data, 100 + k, 100 + k, blue1);
    }

    //setLine(data, 50, 100, 150, 100, blue1);
    setLine(canvas, data, 50, 100, 150, 90, blue1);

    setLine(canvas, data, 13, 20, 80, 40, blue1);
    setLine(canvas, data, 20, 13, 40, 80, red1);
    setLine(canvas, data, 80, 40, 13, 20, red1);
  },
  somethingElse() {


  },
};
