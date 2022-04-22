import { bluerocolors, markZ, setBigPixel, setLine, setPixel } from "./drawing";
import { setLineUnbranched } from "./lesson1";
import { bboxTriangleHot, cross, dot, getBarycentric, getBarycentricHot } from "./lesson2";
import head from "./model/head";
import headLowPoly from "./model/headLowPoly";
import { parseObj } from "./model/parseObj";
import parseTga from "./model/parseTga";
import { Color, TGA } from "./types";

export default {
  "5: pixel art loading": {
    params: {
      x: 0,
      y: 1,
      images: {},
    },
    async preload() {
      this.params.images["brick-wall"] = parseTga(
        await fetch(new URL("pixelart/brick-wall.tga", import.meta.url).toString()).then((result) =>
          result.arrayBuffer()
        )
      ) as TGA;
    },
    options(folder, render) {
      const params = this.params;
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
    render(canvas, data, options = this.params) {
      let image = options.images["brick-wall"];
      let posText;
      let normal = 0;

      for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
          posText = x * 4 + 4 * y * image.width;
          let r = image.data[posText + 0];
          let g = image.data[posText + 1];
          let b = image.data[posText + 2];
          let a = image.data[posText + 3];

          if (a === 0) continue;

          setBigPixel(canvas, data, x + 5, y, {
            r,
            g,
            b,
            a,
          });
        }
      }

      for (let x = 0; x < image.width; x++) {
        if (x < image.width / 2) {
          normal++;
        } else {
          normal--;
        }

        for (let y = 0; y < image.height; y++) {
          posText = x * 4 + 4 * y * image.width;
          let r = image.data[posText + 0];
          let g = image.data[posText + 1];
          let b = image.data[posText + 2];
          let a = image.data[posText + 3];

          if (a === 0) continue;

          setBigPixel(canvas, data, x + 50, y + normal, {
            r,
            g,
            b,
            a,
          });
        }
      }
      /*
      normal = 0;
      let normaly = 0;

      for (let x = 0; x < image.width; x++) {
        if (x < image.width / 2) {
          normal++;
        } else {
          normal--;
        }

        for (let y = 0; y < image.height; y++) {
          normaly = -y;
          posText = x * 4 + 4 * y * image.width;
          let r = image.data[posText + 0];
          let g = image.data[posText + 1];
          let b = image.data[posText + 2];
          let a = image.data[posText + 3];

          if (a === 0) continue;

          setBigPixel(canvas, data, x + 150 + normaly, y + normal, {
            r,
            g,
            b,
            a,
          });
        }
      }*/

      normal = 0;

      let h = 0;
      let tx = -70;
      let ty = -65;

      function drawWall(tx, ty) {
        let theta = -Math.PI / 4; //699999;
        for (let x = 0; x < image.width; x++) {
          if (x < image.width / 2) {
            h--;
          } else {
            normal--;
          }
          for (let y = 0; y < image.height; y++) {
            posText = x * 4 + 4 * y * image.width;
            let r = image.data[posText + 0];
            let g = image.data[posText + 1];
            let b = image.data[posText + 2];
            let a = image.data[posText + 3];

            if (a === 0) continue;

            //let xrot = (tx + x) * Math.cos(theta) - (y + ty + normal) * Math.sin(theta);
            let xrot = (tx + x) * Math.round(Math.cos(theta)) - (y + ty + normal) * Math.round(Math.sin(theta));
            //let xrot = (tx + x) * Math.cos(theta) - (y + ty) * Math.sin(theta);
            //let yrot = (tx + x) * Math.sin(theta) + (y + ty + normal) * Math.cos(theta);
            let yrot = (tx + x) * Math.round(Math.sin(theta)) + (y + ty) * Math.round(Math.cos(theta));
            //let yrot = (tx + x) * Math.sin(theta) + (y + ty) * Math.cos(theta);

            setBigPixel(canvas, data, xrot, yrot - h, {
              r: image.data[posText + 0],
              g: image.data[posText + 1],
              b: image.data[posText + 2],
              a: 255,
            });
          }
        }
    }
    drawWall(tx, ty);
    drawWall(tx-30, ty+22);
    drawWall(tx-6, ty+30);
    drawWall(tx+18, ty+38);

      //markZ(canvas,data,zbuff)
      //markZ(canvas,data,zbuff)
    },
  },
};
