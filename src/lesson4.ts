import { bluerocolors, markZ, setLine, setPixel } from "./drawing";
import { setLineUnbranched } from "./lesson1";
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
import { Color, TGA } from "./types";




export default {
  "4: transform lines": {
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
      let blue1: Color = { r: 0, g: 82, b: 162, a: 255 };
      let white1: Color = { r: 255, g: 255, b: 255, a: 255 };
      let green1: Color = { r: 40, g: 240, b: 77, a: 255 };
      let red1: Color = { r: 174, g: 74, b: 77, a: 255 };

      setLineUnbranched(canvas, data, 300,300, 300, 200, green1);
      setLineUnbranched(canvas, data, 300,300, 400, 300, red1);

      setLineUnbranched(canvas, data, 150,150, 300, 150, blue1);
      setLineUnbranched(canvas, data, 300,150, 450, 300, blue1);
      setLineUnbranched(canvas, data, 450, 300, 450, 450, blue1);
      setLineUnbranched(canvas, data, 450, 450, 150, 450, blue1);
      setLineUnbranched(canvas, data, 150, 450, 150, 150, blue1);

      setLineUnbranched(canvas, data, 200,200, 300, 200, white1);
      setLineUnbranched(canvas, data, 300,200, 400, 300, white1);
      setLineUnbranched(canvas, data, 400, 300, 400, 400, white1);
      setLineUnbranched(canvas, data, 400, 400, 200, 400, white1);
      setLineUnbranched(canvas, data, 200, 400, 200, 200, white1);
    //markZ(canvas,data,zbuff)
    //markZ(canvas,data,zbuff)
    },
  },
};
