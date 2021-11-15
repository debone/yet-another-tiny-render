import { setLine } from "./drawing";
import { Color } from "./types";

export function lineSweepingTriangle(v0, v1, v2, canvas, data, color) {
  let red: Color = { r: 255, g: 99, b: 121, a: 255 };
  let green: Color = { r: 13, g: 123, b: 17, a: 255 };
  let white: Color = { r: 255, g: 255, b: 255, a: 255 };


  let y0 = Math.abs(v1.y - v0.y);
  let y1 = Math.abs(v2.y - v0.y);
  let y2 = Math.abs(v2.y - v1.y);

  if (y0 > y1 || y0 > y2) {
    // y0 is the longest y
  } else if (y1 > y2) {
    // y1 is the longest y
    [v2, v1] = [v1, v2];
  } else {
    // y2 is the longest y
    [v2, v0] = [v0, v2];
  }

  if (v0.y > v1.y) {
    [v0, v1] = [v1, v0];
  }

  let line1_x = v0.x + 0;
  let line1_dx = v1.x - v0.x;
  let line1_dy = v1.y - v0.y;
  let line1_rate = Math.max(1, Math.abs(line1_dx / line1_dy));
  let line1_derror2 = Math.abs(line1_dx) * 2;
  let line1_error2 = 0;

  let line2_x = v0.x + 0;
  let line2_dx = v2.x - v0.x;
  let line2_dy = v2.y - v0.y;
  let line2_rate = Math.max(1, Math.abs(line2_dx / line2_dy));
  let line2_derror2 = Math.abs(line2_dx) * 2;
  let line2_error2 = 0;

  let line3_x = v2.x + 0;
  let line3_dx = v1.x - v2.x;
  let line3_dy = v1.y - v2.y;
  let line3_rate = Math.max(1, Math.abs(line3_dx / line3_dy));
  let line3_derror2 = Math.abs(line3_dx) * 2;
  let line3_error2 = 0;

  let z = 0;

  for (let y = v0.y; y <= v1.y; y++) {
    if (y < v2.y) {
      setLine(canvas, data, line1_x, y, line2_x, y, white);
    } else {
      setLine(canvas, data, line1_x, y, line3_x, y, white);
    }

    line1_error2 += line1_derror2;

    if (line1_error2 > line1_dy) {
      line1_x += v1.x > v0.x ? line1_rate : -line1_rate;
      line1_error2 -= line1_dy * 2;
    }

    if (y < v2.y) {
      line2_error2 += line2_derror2;

      if (line2_error2 > line2_dy) {
        line2_x += v2.x > v0.x ? line2_rate : -line2_rate;
        line2_error2 -= line2_dy * 2;
      }
    } else {
      line3_error2 += line3_derror2;

      if (line3_error2 > line3_dy) {
        line3_x += v1.x > v2.x ? line3_rate : -line3_rate;
        line3_error2 -= line3_dy * 2;
      }
    }

    if (z++ > 1000) {
      break;
    }
  }

  setLine(canvas, data, v0.x, v0.y, v1.x, v1.y, green);
  setLine(canvas, data, v0.x, v0.y, v2.x, v2.y, red);
  setLine(canvas, data, v2.x, v2.y, v1.x, v1.y, red);
}

export default {
  "2: line-sweeping triangle": {
    options(folder, render) {
      const params = {
        x: 0,
        y: 1,
      };
      /*const axis = ['x', 'y', 'z']
          
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
          */
      render(params);
    },
    render(canvas, data, options = { x: 0, y: 1 }) {
      let t0 = [
        { x: 10, y: 70 },
        { x: 50, y: 160 },
        { x: 70, y: 80 },
      ];
      let t1 = [
        { x: 180, y: 50 },
        { x: 150, y: 1 },
        { x: 70, y: 180 },
      ];
      let t2 = [
        { x: 180, y: 150 },
        { x: 120, y: 160 },
        { x: 130, y: 180 },
      ];

      let red: Color = { r: 255, g: 99, b: 121, a: 255 };
      let green: Color = { r: 13, g: 123, b: 17, a: 255 };
      let white: Color = { r: 255, g: 255, b: 255, a: 255 };

      lineSweepingTriangle(t0[0], t0[1], t0[2], canvas, data, red);
      lineSweepingTriangle(t1[0], t1[1], t1[2], canvas, data, white);
      lineSweepingTriangle(t2[0], t2[1], t2[2], canvas, data, green);
    },
  },
};
