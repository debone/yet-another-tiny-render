import { BladeController, View } from "@tweakpane/core";
import { BladeApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { bg } from "./drawing";

import lesson0 from "./lesson0";
import lesson1 from "./lesson1";
import lesson2 from "./lesson2";
import lesson3 from "./lesson3";
import lesson4 from "./lesson4";
import pixelArt from "./pixelArt";

function addValue(lesson) {
  return { text: lesson, value: lesson };
}

const allLessons = {
  ...lesson0,
  ...lesson1,
  ...lesson2,
  ...lesson3,
  ...lesson4,
  ...pixelArt,
};

const allLessonsKeys = Object.keys(allLessons).map(addValue);

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
  options: [{ text: "none", value: "" }, ...allLessonsKeys],
  value: "5: pixel art loading",
});

const canvas = document.getElementById("tiny-render-canvas") as HTMLCanvasElement;
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

  if (ev.target.label === "Scene") {
    const lesson = allLessons[ev.value];
    if (typeof lesson === "function") {
      console.log(lesson);
      drawWith(lesson);
    } else {
      console.log(lesson);

      sceneFolder = pane.addFolder({
        title: "Scene params",
      });

      if (lesson.preload) {
        lesson.preload().then(() => lesson.options(sceneFolder, drawWith.bind(null, lesson.render)));
      } else {
        lesson.options(sceneFolder, drawWith.bind(null, lesson.render));
      }

      //drawWith(lesson.render);
    }
  }
};

handleNewScene({ target: { label: "Scene" }, value: selector.value });
selector.on("change", handleNewScene);
