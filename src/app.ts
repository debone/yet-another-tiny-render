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

const pane = new Pane({
  title: "Scenes",
});


const selector: any = pane.addBlade({
  view: "list",
  presetKey: "scene",
  label: "scene",
  options: {
    none: "",
    ...lesson0,
    ...lesson1,
  },
  value: lesson1["1: render head"],
});

const canvas = document.getElementById(
  "tiny-render-canvas"
) as HTMLCanvasElement;
const context = canvas.getContext("2d");

canvas.halfWidth = canvas.width / 2;
canvas.halfHeight = canvas.height / 2;

function drawWith(drawingFunction) {
  const imageData = context.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  bg(canvas, data);
  drawingFunction(canvas, data);

  context.putImageData(imageData, 0, 0);
}

const handleDraw = (ev) => {
  console.log(ev);
  
  if (ev.target.label === "scene") {
    drawWith(ev.value);
  }
};

handleDraw({ target: { label: "scene" }, value: selector.value });
selector.on("change", handleDraw);
