import { Pane } from "tweakpane";
import { bg } from "./drawing";

import lesson0 from "./lesson0";
import lesson1 from "./lesson1";

const PARAMS = {
  scene: "",
};

const pane = new Pane();

const selector = pane.addBlade({
  view: 'list',
  presetKey: 'scene',
  label: 'scene',
  options: {
    none: "",
    none2: "222",
    ...lesson0,
    ...lesson1,
  },
  value: lesson1.something,
});

const canvas = document.getElementById(
  "tiny-render-canvas"
) as HTMLCanvasElement;
const context = canvas.getContext("2d");

function drawWith(drawingFunction) {
  const imageData = context.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  bg(canvas, data);
  drawingFunction(canvas, data);

  context.putImageData(imageData, 0, 0);
}

drawWith(selector.value);

selector.on("change", (ev) => {
  console.log(ev);
  
  if (ev.target.label === "scene") {
    drawWith(ev.value);
  }
});