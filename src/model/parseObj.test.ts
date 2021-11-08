import { parseObj } from "./parseObj";
import cube from './cube'


test("adds 1 + 2 to equal 3", () => {
  expect(() => {
    parseObj(cube);
  }).toBe(3);
});