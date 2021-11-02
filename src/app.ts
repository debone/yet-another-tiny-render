// import {Pane} from 'tweakpane';

const canvas = document.getElementById("tiny-render-canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const imageData = context.createImageData(width, height);
const data = imageData.data;

function setPixel(x,y,r,g,b,a = 255) {
    x = x * 4
    y = y * 4 * width
    data[0 + x + y] = r;
    data[1 + x + y] = g;
    data[2 + x + y] = b;
    data[3 + x + y] = a;
}

for(let i = 0; i < height; i++) {
    for(let j = 0; j < width; j++) {
        data[j * 4 + i * 4 * width] = 0;
        data[1 + j * 4 + i * 4 * width] = 153;
        data[2 + j * 4 + i * 4 * width] = 204;
        data[3 + j * 4 + i * 4 * width] = 255;
    }
}

for (let k = 0; k < 100; k++) {
    setPixel(100+ k, 100 + k, 0, 82, 162)
}

context.putImageData(imageData, 0, 0);