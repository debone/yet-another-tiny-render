import { parseObj } from "./parseObj";
import cube from "./cube";

/*
const expected= ["a", ""]

test("Given ", (assert) => {
	const should = "should ";
	
	expect().toBe()
  assert.deepEqual(actual(), expected, should);
*/

/*
describe("Given ", () => {
  test("should ", () => {
    expect(parseObj(cube)).toBe(expect);
  });
})
*/

const oneFace = `
o oneFace
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000

f 1 2 3
`;

describe("Given one face", () => {
  test("should return streamlined array of positions", () => {
    expect(parseObj(oneFace)).toStrictEqual({
      normal: [],
      position: [1, 1, -1, 1, -1, -1, 1, 1, 1],
      texcoord: [],
    });
  });
});


const twoFace = `
o twoFace
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000

f 1 2 3
f 3 2 1
`;

describe("Given two faces", () => {
  test("should return streamlined array of positions", () => {
    expect(parseObj(twoFace)).toStrictEqual({
      normal: [],
      position: [1, 1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1],
      texcoord: [],
    });
  });
});

const twoFaceWithTexture = `
o twoFaceWithTexture
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000

vt -1 -1
vt 0 0
vt 1 1

f 1/3 2/2 3/1
f 3/1 2/3 1/2
`;

describe("Given two faces with texture", () => {
  test("should return streamlined array of positions", () => {
    expect(parseObj(twoFaceWithTexture)).toStrictEqual({
      normal: [],
      position: [1, 1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1],
      texcoord: [1, 1, 0, 0, -1, -1, -1, -1, 1, 1, 0, 0],
    });
  });
});

const twoFaceWithTextureAndNormals = `
o twoFaceWithTextureAndNormals
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000

vt -1 -1 
vt 0 0 
vt 1 1

vn -1 -1 -1
vn 0 0 0
vn 1 1 1

f 1/3/2 2/2/3 3/1/2
f 3/1/2 2/3/1 1/2/3
`;

describe("Given two faces with texture and normals", () => {
  test("should return streamlined array of positions", () => {
    expect(parseObj(twoFaceWithTextureAndNormals)).toStrictEqual({
      normal:   [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, -1, -1, -1, 1, 1, 1],
      position: [1, 1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1],
      texcoord: [1, 1, 0, 0, -1, -1, -1, -1, 1, 1, 0, 0],
    });
  });
});

const twoFaceWithNormals = `
o twoFaceWithNormals
v 1.000000 1.000000 -1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 1.000000

vn -1 -1 -1
vn 0 0 0
vn 1 1 1

vt -1 -1 
vt 0 0 
vt 1 1

f 1//2 2//3 3//2
f 3//2 2//1 1//3
`;

describe("Given two faces with normals", () => {
  test("should return streamlined array of positions", () => {
    expect(parseObj(twoFaceWithNormals)).toStrictEqual({
      normal:   [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, -1, -1, -1, 1, 1, 1],
      position: [1, 1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1],
      texcoord: []
    });
  });
});