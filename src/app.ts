import { BladeController, View } from "@tweakpane/core";
import { BladeApi, Pane } from "tweakpane";
import { bg } from "./drawing";

import lesson0 from "./lesson0";
import lesson1 from "./lesson1";


// full page reload
if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}

const PARAMS = {
  scene: "",
};

const pane = new Pane();

const selector:any = pane.addBlade({
  view: 'list',
  presetKey: 'scene',
  label: 'scene',
  options: {
    none: "",
    ...lesson0,
    ...lesson1,
  },
  value: lesson1["1: line mvp"],
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