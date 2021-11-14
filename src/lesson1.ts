import { setPixel } from "./drawing";
import head from "./model/head";
import { parseObj } from "./model/parseObj";

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

    steep
      ? setPixel(canvas, data, y, x, color)
      : setPixel(canvas, data, x, y, color);
  }
}

export function setLineFourthAttempt(
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

  let dx = x1 - x0;
  let dy = y1 - y0;

  let derror = Math.abs(dy / dx);
  let error = 0;

  let y = y0;

  for (let x = x0; x <= x1; x++) {
    steep
      ? setPixel(canvas, data, y, x, color)
      : setPixel(canvas, data, x, y, color);

    error += derror;

    if (error > 0.5) {
      y += y1 > y0 ? 1 : -1;
      error -= 1;
    }
  }
}

export function setLineFifthAttempt(
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

  let derror2 = Math.abs(dy) * 2;
  let error2 = 0;

  for (let x = x0; x <= x1; x++) {
    steep
      ? setPixel(canvas, data, y, x, color)
      : setPixel(canvas, data, x, y, color);

    error2 += derror2;

    if (error2 > dx) {
      y += y1 > y0 ? 1 : -1;
      error2 -= dx * 2;
    }
  }
}

export function setLineUnbranched(
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

export default {
  "1: line mvp"(canvas, data) {
    let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
    let red1: Color = { r: 174, g: 74, b: 77, a: 255 };

    //setLine(data, 50, 100, 150, 100, blue1);
    setLine(canvas, data, 50, 100, 150, 90, blue1);

    setLine(canvas, data, 13, 20, 80, 40, blue1);
    setLine(canvas, data, 20, 13, 40, 80, red1);
    setLine(canvas, data, 80, 40, 13, 20, red1);
  },
  "1: fourth attempt"(canvas, data) {
    let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
    let red1: Color = { r: 174, g: 74, b: 77, a: 255 };

    //setLine(data, 50, 100, 150, 100, blue1);
    setLineFourthAttempt(canvas, data, 50, 100, 150, 90, blue1);

    setLineFourthAttempt(canvas, data, 13, 20, 80, 40, blue1);
    setLineFourthAttempt(canvas, data, 20, 13, 40, 80, red1);
    setLineFourthAttempt(canvas, data, 80, 40, 13, 20, red1);
  },
  "1: fifth attempt"(canvas, data) {
    let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
    let red1: Color = { r: 174, g: 74, b: 77, a: 255 };

    //setLine(data, 50, 100, 150, 100, blue1);
    setLineFifthAttempt(canvas, data, 50, 100, 150, 90, blue1);

    setLineFifthAttempt(canvas, data, 13, 20, 80, 40, blue1);
    setLineFifthAttempt(canvas, data, 20, 13, 40, 80, red1);
    setLineFifthAttempt(canvas, data, 80, 40, 13, 20, red1);
  },
  "1: unbranched attempt"(canvas, data) {
    let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
    let red1: Color = { r: 174, g: 74, b: 77, a: 255 };

    //setLine(data, 50, 100, 150, 100, blue1);
    setLineUnbranched(canvas, data, 50, 100, 150, 90, blue1);

    setLineUnbranched(canvas, data, 13, 20, 80, 40, blue1);
    setLineUnbranched(canvas, data, 20, 13, 40, 80, red1);
    setLineUnbranched(canvas, data, 80, 40, 13, 20, red1);
  },
  "1: render head": {
    options(folder, render) {
      const params = {
        x: 0,
        y: 1
      }
      const axis = ['x', 'y', 'z']
      
      folder.addInput(params, 'x', {
        view: 'radiogrid',
        groupName: 'x',
        size: [3, 1],
        cells: (x, y) => ({
          title: `${axis[x]}`,
          value: x,
        }),
      
        label: 'x',
      }).on('change', (ev) => {
        render(params)
      });

      folder.addInput(params, 'y', {
        view: 'radiogrid',
        groupName: 'y',
        size: [3, 1],
        cells: (x, y) => ({
          title: `${axis[x]}`,
          value: x,
        }),
      
        label: 'y',
      }).on('change', (ev) => {
        render(params)
      });      
    
      render(params)
    },
    render(canvas, data, options = { x: 0, y: 1 }) {
      let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
      const headObj = parseObj(head);
      const pos = headObj.position;

      for (let i = 0; i < pos.length; i += 9) {
        /*let v1x = (pos[i + 0] + 1) * canvas.halfWidth;
      let v1y = (pos[i + 1] - 1) * -canvas.halfHeight;
      let v1z = (pos[i + 2] + 1) * canvas.halfHeight;
      let v2x = (pos[i + 3 + 0] + 1) * canvas.halfWidth;
      let v2y = (pos[i + 3 + 1] - 1) * -canvas.halfHeight;
      let v2z = (pos[i + 3 + 2] + 1) * canvas.halfHeight;
      let v3x = (pos[i + 6 + 0] + 1) * canvas.halfWidth;
      let v3y = (pos[i + 6 + 1] - 1) * -canvas.halfHeight;
      let v3z = (pos[i + 6 + 2] + 1) * canvas.halfHeight;*/

        let t1x = (pos[i + options.x] + 1) * canvas.halfWidth;
        let t1y = (pos[i + options.y] - 1) * -canvas.halfHeight;

        let t2x = (pos[i + 3 + options.x] + 1) * canvas.halfWidth;
        let t2y = (pos[i + 3 + options.y] - 1) * -canvas.halfHeight;

        let t3x = (pos[i + 6 + options.x] + 1) * canvas.halfWidth;
        let t3y = (pos[i + 6 + options.y] - 1) * -canvas.halfHeight;

        //render triangle
        setLineUnbranched(canvas, data, t1x, t1y, t2x, t2y, blue1);
        setLineUnbranched(canvas, data, t1x, t1y, t3x, t3y, blue1);
        setLineUnbranched(canvas, data, t3x, t3y, t2x, t2y, blue1);
      }
    },
  },
};
