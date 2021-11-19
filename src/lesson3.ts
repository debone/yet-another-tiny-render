import { bluerocolors, markZ, setPixel } from "./drawing";
import {
  bboxTriangleHot,
  cross,
  dot,
  getBarycentric,
  getBarycentricHot,
} from "./lesson2";
import head from "./model/head";
import headLowPoly from "./model/headLowPoly";
import { parseObj } from "./model/parseObj";
import parseTga from "./model/parseTga";
import { Color } from "./types";

export function bboxTriangleZBuff(v0, v1, v2, zbuffer, canvas, data, color) {
  const points = [
    [v0.x, v0.y, v0.z].map(Math.round),
    [v1.x, v1.y, v1.z].map(Math.round),
    [v2.x, v2.y, v2.z].map(Math.round),
  ];

  let bboxMin = [canvas.width - 1, canvas.height - 1];
  let bboxMax = [0, 0];
  let clamp = [canvas.width - 1, canvas.height - 1];

  let pixelMargin = 5;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      bboxMin[j] =
        Math.max(0, Math.min(bboxMin[j], points[i][j])) - pixelMargin;
      bboxMax[j] =
        Math.min(clamp[j], Math.max(bboxMax[j], points[i][j])) + pixelMargin;
    }
  }

  let stopper = 0;

  let p = { x: 0, y: 0, z: 0 };
  for (p.x = bboxMin[0]; p.x <= bboxMax[0]; p.x++) {
    for (p.y = bboxMin[1]; p.y <= bboxMax[1]; p.y++) {
      const barycentricCoord = getBarycentric(points, [p.x, p.y]);
      //console.log(p);
      if (stopper++ > 250000) {
        break;
      }

      if (
        barycentricCoord[0] < 0 ||
        barycentricCoord[1] < 0 ||
        barycentricCoord[2] < 0
      ) {
        continue;
      }

      p.z = 0;
      p.z += points[0][2] * barycentricCoord[0];
      p.z += points[1][2] * barycentricCoord[1];
      p.z += points[2][2] * barycentricCoord[2];

      if (zbuffer[Math.round(p.y) + Math.round(p.x) * canvas.width] < p.z) {
        zbuffer[Math.round(p.y) + Math.round(p.x) * canvas.width] = p.z;
        setPixel(canvas, data, p.x, p.y, color);
      }
    }
  }
}

export function bboxTriangleZBuffPerf(
  v0,
  v1,
  v2,
  zbuffer: Float32Array,
  canvas,
  data,
  color
) {
  const points = Int32Array.from([
    ...[v0.x, v0.y, v0.z],
    ...[v1.x, v1.y, v1.z],
    ...[v2.x, v2.y, v2.z],
  ]);

  let bboxMin = [canvas.width - 1, canvas.height - 1];
  let bboxMax = [0, 0];
  let clamp = [canvas.width - 1, canvas.height - 1];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      bboxMin[j] = Math.max(0, Math.min(bboxMin[j], points[i * 3 + j]));
      bboxMax[j] = Math.min(clamp[j], Math.max(bboxMax[j], points[i * 3 + j]));
    }
  }

  let stopper = 0;

  let p = [0, 0, 0];

  let p10 = points[6] - points[0];
  let p11 = points[3] - points[0];
  let p20 = points[7] - points[1];
  let p21 = points[4] - points[1];

  let u2 = p20 * p11 - p21 * p10;

  if (Math.abs(u2) < 1) return;

  let p12, p22;
  let u0, u1;
  let b0, b1, b2;

  for (p[0] = bboxMin[0]; p[0] <= bboxMax[0]; p[0]++) {
    let areWeOnTheOtherSide = false;
    for (p[1] = bboxMin[1]; p[1] <= bboxMax[1]; p[1]++) {
      p12 = points[0] - p[0];
      p22 = points[1] - p[1];

      u0 = p21 * p12 - p22 * p11;
      u1 = p22 * p10 - p20 * p12;

      b0 = 1 - (u0 + u1) / u2;
      b1 = u1 / u2;
      b2 = u0 / u2;

      //console.log(p);
      if (stopper++ > 250000) {
        break;
      }

      if (b0 < 0 || b1 < 0 || b2 < 0) {
        if (areWeOnTheOtherSide) break;
        continue;
      }

      areWeOnTheOtherSide = true;

      p[2] = 0;
      p[2] += points[2] * b0;
      p[2] += points[5] * b1;
      p[2] += points[8] * b2;

      if (zbuffer[p[1] + p[0] * canvas.width] < p[2]) {
        zbuffer[p[1] + p[0] * canvas.width] = p[2];
        setPixel(canvas, data, p[0], p[1], color);
      }
    }
  }
}

export function lineSweepBboxTriangleZBuffPerf(
  v0,
  v1,
  v2,
  zbuffer: Float32Array,
  canvas,
  data,
  color
) {
  const points = Int32Array.from([
    ...[v0.x, v0.y, v0.z],
    ...[v1.x, v1.y, v1.z],
    ...[v2.x, v2.y, v2.z],
  ]);

  let t0 = [points[0], points[1]];
  let t1 = [points[3], points[4]];
  let t2 = [points[6], points[7]];

  if (t0[1] > t1[1]) [t0, t1] = [t1, t0];
  if (t0[1] > t2[1]) [t0, t2] = [t2, t0];
  if (t1[1] > t2[1]) [t2, t1] = [t1, t2];

  let t00 = t0[0];
  let t01 = t0[1];
  let t10 = t1[0];
  let t11 = t1[1];
  let t20 = t2[0];
  let t21 = t2[1];

  let bboxMin = [canvas.width - 1, canvas.height - 1];
  let bboxMax = [0, 0];
  let clamp = [canvas.width - 1, canvas.height - 1];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      bboxMin[j] = Math.max(0, Math.min(bboxMin[j], points[i * 3 + j]));
      bboxMax[j] = Math.min(clamp[j], Math.max(bboxMax[j], points[i * 3 + j]));
    }
  }

  let stopper = 0;

  let p = [0, 0, 0];

  let p10 = points[6] - points[0];
  let p11 = points[3] - points[0];
  let p20 = points[7] - points[1];
  let p21 = points[4] - points[1];

  let u2 = p20 * p11 - p21 * p10;

  if (Math.abs(u2) < 1) return;

  let p12, p22;
  let u0, u1;
  let b0, b1, b2;

  let totalHeight = t21 - t01;

  for (p[1] = t01 - 2; p[1] <= bboxMax[1] + 2; p[1]++) {
    let areWeOnTheOtherSide = false;

    let secondHalf = p[1] > t11;
    let segmentHeight = secondHalf ? t21 - t11 + 1 : t11 - t01 + 1;
    let alpha = (p[1] - t01) / totalHeight;
    let beta = (p[1] - (secondHalf ? t11 : t01)) / segmentHeight;

    let a = t00 + (t20 - t00) * alpha;
    let b = secondHalf ? t10 + (t20 - t10) * beta : t00 + (t10 - t00) * beta;

    let step = secondHalf ? t11 / segmentHeight : t01 / segmentHeight;

    if (a > b) {
      [a, b] = [b, a];
      a = Math.min(a - step, bboxMin[0]);
    }

    for (p[0] = Math.floor(a); p[0] <= bboxMax[0]; p[0]++) {
      p12 = points[0] - p[0];
      p22 = points[1] - p[1];

      u0 = p21 * p12 - p22 * p11;
      u1 = p22 * p10 - p20 * p12;

      b0 = 1 - (u0 + u1) / u2;
      b1 = u1 / u2;
      b2 = u0 / u2;

      //console.log(p);
      if (stopper++ > 250000) {
        break;
      }

      if (b0 < 0 || b1 < 0 || b2 < 0) {
        //if (b0 > 0 && b1 > 0 && b2 > 0) {
        if (areWeOnTheOtherSide) break;
        //setPixel(canvas, data, p[0], p[1], { r: 255, g: 0, b: 255, a: 255 });
        continue;
      }

      areWeOnTheOtherSide = true;

      p[2] = 0;
      p[2] += points[2] * b0;
      p[2] += points[5] * b1;
      p[2] += points[8] * b2;

      if (zbuffer[p[1] + p[0] * canvas.width] < p[2]) {
        zbuffer[p[1] + p[0] * canvas.width] = p[2];
        setPixel(canvas, data, p[0], p[1], color);
      }
    }
  }
}

export default {
  "3: bbox triangle hot": {
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
      const zbuff = new Float32Array(canvas.width * canvas.height).fill(
        -Infinity
      );

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

      //

      lineSweepBboxTriangleZBuffPerf(
        t0[0],
        t0[1],
        t0[2],
        zbuff,
        canvas,
        data,
        red
      );
      lineSweepBboxTriangleZBuffPerf(
        t1[0],
        t1[1],
        t1[2],
        zbuff,
        canvas,
        data,
        white
      );
      lineSweepBboxTriangleZBuffPerf(
        t2[0],
        t2[1],
        t2[2],
        zbuff,
        canvas,
        data,
        green
      );
    },
  },
  "3: render head with z-buffer": {
    params: {
      x: 0,
      y: 1,
      l1: { x: 1, y: 0 },
      l2: { x: -1, y: 0 },
    },
    options(folder, render) {
      const params = this.params;
      const axis = ["x", "y", "z"];

      folder.on("change", () => render(params));

      folder.addInput(params, "x", {
        view: "radiogrid",
        groupName: "x",
        size: [3, 1],
        cells: (x, y) => ({
          title: `${axis[x]}`,
          value: x,
        }),

        label: "x",
      });

      folder.addInput(params, "y", {
        view: "radiogrid",
        groupName: "y",
        size: [3, 1],
        cells: (x, y) => ({
          title: `${axis[x]}`,
          value: x,
        }),

        label: "y",
      });

      folder.addInput(params, "l1", {
        picker: "inline",
        label: "light1",
        x: { min: -1, max: 1 },
        y: { min: -1, max: 1 },
        expanded: true,
      });

      folder.addInput(params, "l2", {
        picker: "inline",
        label: "light2",
        x: { min: -1, max: 1 },
        y: { min: -1, max: 1 },
        expanded: true,
      });

      render(params);
    },
    render(canvas, data, options = this.params) {
      const headObj = parseObj(head);
      const pos = headObj.position;

      const zbuff = new Float32Array(canvas.width * canvas.height).fill(
        -Infinity
      );

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

        /**zooomed*
        let t1_worldCoord = {
          x: pos[i],
          y: pos[i + 1],
          z: pos[i + 2],
        };

        let t1_screenCoord = {
          x: -canvas.halfWidth + (pos[i + options.x] + 1) * canvas.halfWidth * 4,
          y: (pos[i + options.y] - 1) * -canvas.halfHeight * 4,
          z: pos[i + 2],
        };

        let t2_worldCoord = {
          x: pos[i + 3],
          y: pos[i + 3 + 1],
          z: pos[i + 3 + 2],
        };

        let t2_screenCoord = {
          x: -canvas.halfWidth+(pos[i + 3 + options.x] + 1) * canvas.halfWidth * 4,
          y: (pos[i + 3 + options.y] - 1) * -canvas.halfHeight * 4,
          z: pos[i + 3 + 2],
        };

        let t3_worldCoord = {
          x: pos[i + 6],
          y: pos[i + 6 + 1],
          z: pos[i + 6 + 2],
        };

        let t3_screenCoord = {
          x: -canvas.halfWidth+ (pos[i + 6 + options.x] + 1) * canvas.halfWidth * 4,
          y: (pos[i + 6 + options.y] - 1) * -canvas.halfHeight * 4,
          z: pos[i + 6 + 2],
        }; /**/

        /**/
        let t1_worldCoord = {
          x: pos[i],
          y: pos[i + 1],
          z: pos[i + 2],
        };

        let t1_screenCoord = {
          x: (pos[i + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + options.y] - 1) * -canvas.halfHeight,
          z: pos[i + 2],
        };

        let t2_worldCoord = {
          x: pos[i + 3],
          y: pos[i + 3 + 1],
          z: pos[i + 3 + 2],
        };

        let t2_screenCoord = {
          x: (pos[i + 3 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 3 + options.y] - 1) * -canvas.halfHeight,
          z: pos[i + 3 + 2],
        };

        let t3_worldCoord = {
          x: pos[i + 6],
          y: pos[i + 6 + 1],
          z: pos[i + 6 + 2],
        };

        let t3_screenCoord = {
          x: (pos[i + 6 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 6 + options.y] - 1) * -canvas.halfHeight,
          z: pos[i + 6 + 2],
        }; /**/

        const n = cross(
          [
            t3_worldCoord.x - t1_worldCoord.x,
            t3_worldCoord.y - t1_worldCoord.y,
            t3_worldCoord.z - t1_worldCoord.z,
          ],
          [
            t2_worldCoord.x - t1_worldCoord.x,
            t2_worldCoord.y - t1_worldCoord.y,
            t2_worldCoord.z - t1_worldCoord.z,
          ]
        );

        let l = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);

        n[0] = n[0] / l;
        n[1] = n[1] / l;
        n[2] = n[2] / l;

        let intensity = 0;

        if (dot(n, [options.l2.x, 0, options.l2.y]) > 0) {
          intensity += dot(n, [options.l2.x, 0, options.l2.y]);
        }

        if (dot(n, [options.l1.x, 0, options.l1.y]) > 0) {
          intensity += dot(n, [options.l1.x, 0, options.l1.y]);
        }
        let camera = dot(n, [0, 0, 1]);

        let col = Math.floor(intensity * 5) % bluerocolors.length;

        //render triangle
        if (camera > 0) {
          lineSweepBboxTriangleZBuffPerf(
            t1_screenCoord,
            t2_screenCoord,
            t3_screenCoord,
            zbuff,
            canvas,
            data,
            {
              r: intensity * bluerocolors[col].r,
              g: intensity * bluerocolors[col].g,
              b: intensity * bluerocolors[col].b,
              a: 255,
            }
          );
        }
      }

      //markZ(canvas,data,zbuff)
    },
  },
  "3: render head with texture": {
    params: {
      x: 0,
      y: 1,
      l1: { x: 1, y: 0 },
      l2: { x: -1, y: 0 },
    },
    async preload() {
      let textureReq = await fetch(
        new URL("model/african_head_diffuse.tga", import.meta.url).toString()
      );
      this.params.texture = parseTga(await textureReq.arrayBuffer());
    },
    options(folder, render) {
      const params = this.params;
      const axis = ["x", "y", "z"];

      folder.on("change", () => render(params));

      folder.addInput(params, "x", {
        view: "radiogrid",
        groupName: "x",
        size: [3, 1],
        cells: (x, y) => ({
          title: `${axis[x]}`,
          value: x,
        }),

        label: "x",
      });

      folder.addInput(params, "y", {
        view: "radiogrid",
        groupName: "y",
        size: [3, 1],
        cells: (x, y) => ({
          title: `${axis[x]}`,
          value: x,
        }),

        label: "y",
      });

      folder.addInput(params, "l1", {
        picker: "inline",
        label: "light1",
        x: { min: -1, max: 1 },
        y: { min: -1, max: 1 },
        expanded: true,
      });

      folder.addInput(params, "l2", {
        picker: "inline",
        label: "light2",
        x: { min: -1, max: 1 },
        y: { min: -1, max: 1 },
        expanded: true,
      });

      render(params);
    },
    render(canvas, data, options = this.params) {
      const headObj = parseObj(head);
      const pos = headObj.position;

      const zbuff = new Float32Array(canvas.width * canvas.height).fill(
        -Infinity
      );

      console.log(options.texture);
      let posText;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          posText = x * 4 + 4* y * options.texture.width;
          setPixel(canvas, data, x, y, {
            r: options.texture.data[posText + 0],
            g: options.texture.data[posText + 1],
            b: options.texture.data[posText + 2],
            a: 255,
          });
        }
      }
      //

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

        /**zooomed*
        let t1_worldCoord = {
          x: pos[i],
          y: pos[i + 1],
          z: pos[i + 2],
        };

        let t1_screenCoord = {
          x: -canvas.halfWidth + (pos[i + options.x] + 1) * canvas.halfWidth * 4,
          y: (pos[i + options.y] - 1) * -canvas.halfHeight * 4,
          z: pos[i + 2],
        };

        let t2_worldCoord = {
          x: pos[i + 3],
          y: pos[i + 3 + 1],
          z: pos[i + 3 + 2],
        };

        let t2_screenCoord = {
          x: -canvas.halfWidth+(pos[i + 3 + options.x] + 1) * canvas.halfWidth * 4,
          y: (pos[i + 3 + options.y] - 1) * -canvas.halfHeight * 4,
          z: pos[i + 3 + 2],
        };

        let t3_worldCoord = {
          x: pos[i + 6],
          y: pos[i + 6 + 1],
          z: pos[i + 6 + 2],
        };

        let t3_screenCoord = {
          x: -canvas.halfWidth+ (pos[i + 6 + options.x] + 1) * canvas.halfWidth * 4,
          y: (pos[i + 6 + options.y] - 1) * -canvas.halfHeight * 4,
          z: pos[i + 6 + 2],
        }; /**/

        /**/
        let t1_worldCoord = {
          x: pos[i],
          y: pos[i + 1],
          z: pos[i + 2],
        };

        let t1_screenCoord = {
          x: (pos[i + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + options.y] - 1) * -canvas.halfHeight,
          z: pos[i + 2],
        };

        let t2_worldCoord = {
          x: pos[i + 3],
          y: pos[i + 3 + 1],
          z: pos[i + 3 + 2],
        };

        let t2_screenCoord = {
          x: (pos[i + 3 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 3 + options.y] - 1) * -canvas.halfHeight,
          z: pos[i + 3 + 2],
        };

        let t3_worldCoord = {
          x: pos[i + 6],
          y: pos[i + 6 + 1],
          z: pos[i + 6 + 2],
        };

        let t3_screenCoord = {
          x: (pos[i + 6 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 6 + options.y] - 1) * -canvas.halfHeight,
          z: pos[i + 6 + 2],
        }; /**/

        const n = cross(
          [
            t3_worldCoord.x - t1_worldCoord.x,
            t3_worldCoord.y - t1_worldCoord.y,
            t3_worldCoord.z - t1_worldCoord.z,
          ],
          [
            t2_worldCoord.x - t1_worldCoord.x,
            t2_worldCoord.y - t1_worldCoord.y,
            t2_worldCoord.z - t1_worldCoord.z,
          ]
        );

        let l = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);

        n[0] = n[0] / l;
        n[1] = n[1] / l;
        n[2] = n[2] / l;

        let intensity = 0;

        if (dot(n, [options.l2.x, 0, options.l2.y]) > 0) {
          intensity += dot(n, [options.l2.x, 0, options.l2.y]);
        }

        if (dot(n, [options.l1.x, 0, options.l1.y]) > 0) {
          intensity += dot(n, [options.l1.x, 0, options.l1.y]);
        }
        let camera = dot(n, [0, 0, 1]);

        let col = Math.floor(intensity * 5) % bluerocolors.length;

        //render triangle
        if (camera > 0) {
          lineSweepBboxTriangleZBuffPerf(
            t1_screenCoord,
            t2_screenCoord,
            t3_screenCoord,
            zbuff,
            canvas,
            data,
            {
              r: intensity * bluerocolors[col].r,
              g: intensity * bluerocolors[col].g,
              b: intensity * bluerocolors[col].b,
              a: 255,
            }
          );
        }
      }

      //markZ(canvas,data,zbuff)
    },
  },
};
