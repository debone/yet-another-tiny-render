import { cross, getBarycentric } from "./lesson2";

describe("Given two vectors cross product", () => {
    test("should return the correct value", () => {
      expect(cross(
          [1,2,2],
          [2,1,1]
      )).toStrictEqual([0,-3,3]);
    });
  });

  describe("Given a triangle and a point", () => {
    test("should point out if point is inside", () => {
      expect(getBarycentric([
       [ 0, 0 ],
        [100,  0 ],
        [0,  100 ],
      ],[0,100]
      )).toStrictEqual([0,-0,1]);

      expect(getBarycentric([
        [ 0, 0 ],
         [100,  0 ],
         [0,  100 ],
       ],[100,0]
       )).toStrictEqual([0,1,-0]);

       expect(getBarycentric([
        [ 0, 0 ],
         [100,  0 ],
         [0,  100 ],
       ],[50,50]
       )).toStrictEqual([0,0.5,0.5]);

       expect(getBarycentric([
        [0,  100 ],
        [ 0, 0 ],
        [100,  0 ],
       ],[50,50]
       )).toStrictEqual([0.5,0,0.5]);
    });
  });