import { BladeController, View } from "@tweakpane/core";
import { BladeApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { bg } from "./drawing";

import lesson0 from "./lesson0";
import lesson1 from "./lesson1";
import lesson2 from "./lesson2";

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

pane.registerPlugin(EssentialsPlugin);

const selector: any = pane.addBlade({
  view: "list",
  presetKey: "scene",
  label: "Scene",
  options: {
    none: "",
    ...lesson0,
    ...lesson1,
    ...lesson2
  },
  value: lesson2["2: line-sweeping triangle"],
});

const canvas = document.getElementById(
  "tiny-render-canvas"
) as HTMLCanvasElement;
const context = canvas.getContext("2d");

canvas.halfWidth = canvas.width / 2;
canvas.halfHeight = canvas.height / 2;

function drawWith(drawingFunction, params) {
  const imageData = context.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  bg(canvas, data);
  drawingFunction(canvas, data, params);

  context.putImageData(imageData, 0, 0);
}

let sceneFolder;

const handleNewScene = (ev) => {
  console.log(ev);

  sceneFolder?.dispose();

  if (ev.target.label === "scene") {
    if (typeof ev.value === "function") {
      console.log(ev.value);
      drawWith(ev.value);
    } else {
      console.log(ev.value);
      
      sceneFolder = pane.addFolder({
        title: "Scene params",
      });

      ev.value.options(sceneFolder, drawWith.bind(null, ev.value.render));
      //drawWith(ev.value.render);
    }
  }
};

handleNewScene({ target: { label: "scene" }, value: selector.value });
selector.on("change", handleNewScene);
