import { bluerocolors, setLine, setPixel } from "./drawing";
import head from "./model/head";
import { parseObj } from "./model/parseObj";
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

export function cross(p1, p2) {
  return [
    p2[1] * p1[2] - p2[2] * p1[1],
    p2[2] * p1[0] - p2[0] * p1[2],
    p2[0] * p1[1] - p2[1] * p1[0],
  ];
}

export function crossHot(p10, p11, p12, p20, p21, p22) {
  return [p21 * p12 - p22 * p11, p22 * p10 - p20 * p12, p20 * p11 - p21 * p10];
}

export function dot(p1, p2) {
  return p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2];
}

export function getBarycentric(points, p) {
  /*
   Vec3f u = cross(Vec3f(pts[2][0]-pts[0][0], pts[1][0]-pts[0][0], pts[0][0]-P[0]), Vec3f(pts[2][1]-pts[0][1], pts[1][1]-pts[0][1], pts[0][1]-P[1]));
  /* 
  `pts` and `P` has integer value as coordinates
    so `abs(u[2])` < 1 means `u[2]` is 0, that means
    triangle is degenerate, in this case return something with negative coordinates 
  if (std::abs(u[2])<1) return Vec3f(-1,1,1);
  return Vec3f(1.f-(u.x+u.y)/u.z, u.y/u.z, u.x/u.z); 
   */
  const u = cross(
    [
      points[2][0] - points[0][0],
      points[1][0] - points[0][0],
      points[0][0] - p[0],
    ],
    [
      points[2][1] - points[0][1],
      points[1][1] - points[0][1],
      points[0][1] - p[1],
    ]
  );

  if (Math.abs(u[2]) < 1) return [-1, 1, 1];

  return [1 - (u[0] + u[1]) / u[2], u[1] / u[2], u[0] / u[2]];
}

export function getBarycentricHot(p0, p1, p2, p3, p4, p5, p00, p11) {
  /*
   Vec3f u = cross(Vec3f(pts[2][0]-pts[0][0], pts[1][0]-pts[0][0], pts[0][0]-P[0]), Vec3f(pts[2][1]-pts[0][1], pts[1][1]-pts[0][1], pts[0][1]-P[1]));
  /* 
  `pts` and `P` has integer value as coordinates
    so `abs(u[2])` < 1 means `u[2]` is 0, that means
    triangle is degenerate, in this case return something with negative coordinates 
  if (std::abs(u[2])<1) return Vec3f(-1,1,1);
  return Vec3f(1.f-(u.x+u.y)/u.z, u.y/u.z, u.x/u.z); 
   */
  const u = crossHot(p4 - p0, p2 - p0, p0 - p00, p5 - p1, p3 - p1, p1 - p11);

  if (Math.abs(u[2]) < 1) return [-1, 1, 1];

  return [1 - (u[0] + u[1]) / u[2], u[1] / u[2], u[0] / u[2]];
}

export function bboxTriangle(
  v0,
  v1,
  v2,
  canvas,
  data,
  color,
  lines = true,
  pinkLines = false
) {
  const points = [
    [v0.x, v0.y],
    [v1.x, v1.y],
    [v2.x, v2.y],
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

  if (lines) {
    if (pinkLines) {
      setLine(canvas, data, v0.x, v0.y, v1.x, v1.y, {
        r: 255,
        g: 0,
        b: 255,
        a: 255,
      });
      setLine(canvas, data, v0.x, v0.y, v2.x, v2.y, {
        r: 255,
        g: 0,
        b: 255,
        a: 255,
      });
      setLine(canvas, data, v2.x, v2.y, v1.x, v1.y, {
        r: 255,
        g: 0,
        b: 255,
        a: 255,
      });
    } else {
      setLine(canvas, data, v0.x, v0.y, v1.x, v1.y, color);
      setLine(canvas, data, v0.x, v0.y, v2.x, v2.y, color);
      setLine(canvas, data, v2.x, v2.y, v1.x, v1.y, color);
    }
  }
  let stopper = 0;

  let p = { x: 0, y: 0 };
  for (p.x = bboxMin[0]; p.x <= bboxMax[0]; p.x++) {
    for (p.y = bboxMin[1]; p.y <= bboxMax[1]; p.y++) {
      const barycentricCoord = getBarycentric(points, [p.x, p.y]);
      //console.log(p);
      if (stopper++ > 250000) {
        break;
      }

      /**/
      if (
        barycentricCoord[0] < -0.02 ||
        barycentricCoord[1] < -0.02 ||
        barycentricCoord[2] < -0.02
      ) {
        continue;
      } /**/
      /** *
      if (
        barycentricCoord[0] < 0 ||
        barycentricCoord[1] < 0 ||
        barycentricCoord[2] < 0
      ) {
        continue;
      }/**/

      setPixel(canvas, data, p.x, p.y, color);
    }
  }
}

export function bboxTriangleHot(v0, v1, v2, canvas, data, color) {
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

  let t00 = t0[0]
  let t01 = t0[1]
  let t10 = t1[0]
  let t11 = t1[1]
  let t20 = t2[0]
  let t21 = t2[1]

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
  let u0,u1;
  let b0,b1,b2;

  let totalHeight = t21 - t01;

  for (p[1] = t01 - 2; p[1] <= bboxMax[1] + 2; p[1]++) {
    let secondHalf = p[1] > t11;
    let segmentHeight = secondHalf ? t21 - t11 + 1 : t11 - t01 + 1;
    let alpha = (p[1] - t01) / totalHeight;
    let beta = (p[1] - (secondHalf ? t11 : t01)) / segmentHeight;

    let a = t00 + (t20 - t00) * alpha;
    let b = secondHalf
      ? t10 + (t20 - t10) * beta
      : t00 + (t10 - t00) * beta;

    let step = secondHalf
      ? (t11 / segmentHeight)
      : (t01 / segmentHeight);

    if (a > b) {
      [a, b] = [b, a];
      a = Math.min(a-step,bboxMin[0]);
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
        continue;
      }

      setPixel(canvas, data, p[0], p[1], color);
    }
  }
}

export default {
  "2: my horrible line-sweeping triangle": {
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
  "2: bbox triangle": {
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

      bboxTriangleHot(t0[0], t0[1], t0[2], canvas, data, red);
      bboxTriangleHot(t1[0], t1[1], t1[2], canvas, data, white);
      bboxTriangleHot(t2[0], t2[1], t2[2], canvas, data, green);
    },
  },
  "2: bbox triangle tests": {
    options(folder, render) {
      const params = {
        p1: { x: 388, y: 9 },
        p2: { x: 397.06, y: 176.47 },
        p3: { x: 165.9, y: 87.95 },
        p4: { x: 388, y: 43 },
        p5: { x: 397.06, y: 333.57 },
        t0: true,
        t1: false,
        lines: true,
        pinkLines: true,
      };

      folder.addInput(params, "t0");
      folder.addInput(params, "t1");
      folder.addInput(params, "lines");
      folder.addInput(params, "pinkLines");

      folder.on("change", () => render(params));

      folder.addInput(params, "p1", {
        picker: "inline",
      });

      folder.addInput(params, "p2", {
        picker: "inline",
      });

      folder.addInput(params, "p3", {
        picker: "inline",
      });

      folder.addInput(params, "p4", {
        picker: "inline",
      });

      folder.addInput(params, "p5", {
        picker: "inline",
      });

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
    render(
      canvas,
      data,
      options = {
        p1: { x: 388, y: 9 },
        p2: { x: 397.06, y: 176.47 },
        p3: { x: 165.9, y: 87.95 },
        p4: { x: 388, y: 43 },
        p5: { x: 397.06, y: 333.57 },
        t0: true,
        t1: false,
        lines: true,
        pinkLines: true,
      }
    ) {
      let t0 = [options.p5, options.p3, options.p4];
      let t1 = [options.p2, options.p3, options.p1];

      let red: Color = { r: 255, g: 99, b: 121, a: 255 };
      let green: Color = { r: 13, g: 123, b: 17, a: 255 };
      let white: Color = { r: 255, g: 255, b: 255, a: 255 };

      if (options.t0) {
        bboxTriangle(
          t0[0],
          t0[1],
          t0[2],
          canvas,
          data,
          white,
          options.lines,
          options.pinkLines
        );
      }
      if (options.t1) {
        bboxTriangle(
          t1[0],
          t1[1],
          t1[2],
          canvas,
          data,
          white,
          options.lines,
          options.pinkLines
        );
      }
      //bboxTriangle(t1[0], t1[1], t1[2], canvas, data, white);
    },
  },
  "2: render colorful head": {
    options(folder, render) {
      const params = {
        x: 0,
        y: 1,
      };
      const axis = ["x", "y", "z"];

      folder
        .addInput(params, "x", {
          view: "radiogrid",
          groupName: "x",
          size: [3, 1],
          cells: (x, y) => ({
            title: `${axis[x]}`,
            value: x,
          }),

          label: "x",
        })
        .on("change", (ev) => {
          render(params);
        });

      folder
        .addInput(params, "y", {
          view: "radiogrid",
          groupName: "y",
          size: [3, 1],
          cells: (x, y) => ({
            title: `${axis[x]}`,
            value: x,
          }),

          label: "y",
        })
        .on("change", (ev) => {
          render(params);
        });

      render(params);
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

        let t1 = {
          x: (pos[i + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + options.y] - 1) * -canvas.halfHeight,
        };

        let t2 = {
          x: (pos[i + 3 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 3 + options.y] - 1) * -canvas.halfHeight,
        };

        let t3 = {
          x: (pos[i + 6 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 6 + options.y] - 1) * -canvas.halfHeight,
        };

        //render triangle
        bboxTriangle(t1, t2, t3, canvas, data, {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255),
          a: 255,
        });
      }
    },
  },
  "2: render head with light": {
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

        let t1_worldCoord = {
          x: pos[i],
          y: pos[i + 1],
          z: pos[i + 2],
        };

        let t1_screenCoord = {
          x: (pos[i + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + options.y] - 1) * -canvas.halfHeight,
        };

        let t2_worldCoord = {
          x: pos[i + 3],
          y: pos[i + 3 + 1],
          z: pos[i + 3 + 2],
        };

        let t2_screenCoord = {
          x: (pos[i + 3 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 3 + options.y] - 1) * -canvas.halfHeight,
        };

        let t3_worldCoord = {
          x: pos[i + 6],
          y: pos[i + 6 + 1],
          z: pos[i + 6 + 2],
        };

        let t3_screenCoord = {
          x: (pos[i + 6 + options.x] + 1) * canvas.halfWidth,
          y: (pos[i + 6 + options.y] - 1) * -canvas.halfHeight,
        };

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

        let col = Math.floor(Math.random() * bluerocolors.length);
        //render triangle
        if (camera > 0) {
          bboxTriangle(
            t1_screenCoord,
            t2_screenCoord,
            t3_screenCoord,
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
    },
  },
};
