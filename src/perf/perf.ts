import { benchmark, measure } from "kelonio";
import lesson1, { setLine } from "../lesson1";
import lesson2 from "../lesson2";
import lesson3 from "../lesson3";
import {
  black,
  milByMilCanvas,
  milByMilDataWhite,
  sceneCanvas,
  sceneDataWhite,
  stoByStoCanvas,
  stoByStoDataWhite,
  tenByTenCanvas,
  tenByTenDataWhite,
} from "./stubs";

// full page reload
if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}

const testsEl = document.querySelector(".tests") as HTMLPreElement;

(async () => {
  await benchmark.record(
    ["Lesson 1", '"mvp line" 10x10'],
    () => setLine(tenByTenCanvas, tenByTenDataWhite, 9, 0, 0, 9, black),
    { iterations: 10000 }
  );

  await benchmark.record(
    ["Lesson 1", '"mvp line" 100x100'],
    () => setLine(stoByStoCanvas, stoByStoDataWhite, 99, 0, 0, 99, black),
    { iterations: 10000 }
  );

  await benchmark.record(
    ["Lesson 1", '"mvp line" 1000x1000'],
    () => setLine(milByMilCanvas, milByMilDataWhite, 99, 0, 0, 99, black),
    { iterations: 10000 }
  );

  await benchmark.record(
    ["Lesson 1", '"mvp line" lesson third attempt'],
    () => lesson1["1: line mvp"](sceneCanvas, sceneDataWhite),
    { iterations: 100000 }
  );

  await benchmark.record(
    ["Lesson 1", '"mvp line" lesson fourth attempt'],
    () => lesson1["1: fourth attempt"](sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  await benchmark.record(
    ["Lesson 1", '"mvp line" lesson fifth attempt'],
    () => lesson1["1: fifth attempt"](sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  await benchmark.record(
    ["Lesson 1", '"mvp line" lesson unbranched attempt'],
    () => lesson1["1: unbranched attempt"](sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  await benchmark.record(
    ["Lesson 1", 'render head'],
    () => lesson1["1: render head"].render(sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  await benchmark.record(
    ["Lesson 2", 'horrible line sweeping'],
    () => lesson2["2: my horrible line-sweeping triangle"].render(sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  await benchmark.record(
    ["Lesson 2", 'bbox triangle'],
    () => lesson2["2: bbox triangle"].render(sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  await benchmark.record(
    ["Lesson 3", 'bbox triangle hot'],
    () => lesson3["3: bbox triangle hot"].render(sceneCanvas, sceneDataWhite),
    { iterations: 1000 }
  );

  testsEl.innerText = benchmark.report();
})();
