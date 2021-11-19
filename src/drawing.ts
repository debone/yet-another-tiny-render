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

export function markZ(canvas, data, zbuff) {
  for (let i = 0; i < canvas.height; i++) {
    for (let j = 0; j < canvas.width; j++) {
      if (zbuff[i + j * canvas.width] > -Infinity) continue;
      data[j * 4 + i * 4 * canvas.width] = 255;
      data[1 + j * 4 + i * 4 * canvas.width] = 0;
      data[2 + j * 4 + i * 4 * canvas.width] = 0;
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
  x = Math.round(x) * 4;
  y = Math.round(y) * 4 * canvas.width;
  
  data[0 + x + y] = color.r;
  data[1 + x + y] = color.g;
  data[2 + x + y] = color.b;
  data[3 + x + y] = color.a;
}

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
  let y = y0 + 0;

  let dx = x1 - x0;
  let dy = y1 - y0;

  let dx2 = dx * 2;

  let derror2 = Math.abs(dy) * 2;
  let error2 = 0;

  let yincr = y1 > y0 ? 1 : -1;

  if (steep) {
    for (let x = x0; x <= x1; x++) {
      setPixel(canvas, data, y, x, color);
      error2 += derror2;

      if (error2 > dx) {
        y += yincr;
        error2 -= dx2;
      }
    }
  } else {
    for (let x = x0; x <= x1; x++) {
      setPixel(canvas, data, x, y, color);
      error2 += derror2;

      if (error2 > dx) {
        y += yincr;
        error2 -= dx2;
      }
    }
  }
}


export const bluerocolors : Color[] = [
  {r:20,  g:95,  b: 242, a: 255},
  {r:143, g:81,  b: 223, a: 255},
  {r:195, g:66,  b: 198, a: 255},
  {r:227, g:58,  b: 170, a: 255},
  {r:247, g:64,  b: 141, a: 255},
  {r:255, g:82,  b: 115, a: 255},
  {r:254, g:105, b: 93, a: 255},
  {r:247, g:129, b: 77, a: 255},
  {r:234, g:150, b: 69, a: 255},
  {r:219, g:170, b: 72, a: 255},
]