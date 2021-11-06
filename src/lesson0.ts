import { setPixel } from "./drawing";

export default {
  lesson0(canvas, data) {
    for (let k = 0; k < 100; k++) {
      setPixel(canvas, data, 100 + k, 100 + k, 0, 82, 162);
    }
  },
};
