/**
 * js/shapes/dodecahedron.js
 * 構造の説明: 正十二面体
 */

import { normalize } from "../utils.js";
import { PHI } from "../constants.js";

export const dodecahedron = {
  title: "Dodecahedron",
  desc: [
    "A dodecahedron is a polyhedron with 12 regular pentagonal faces.",
    "It has many connections to the golden ratio and features 20 vertices and 30 edges.",
  ],
  formulas: [
    { label: "Golden Ratio", eq: "\\phi = \\frac{1 + \\sqrt{5}}{2}" },
    { label: "Volume", eq: "V = \\frac{15 + 7\\sqrt{5}}{4}a^3" },
  ],
  /**
   * 正十二面体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => {
    const v = [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: -1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: -1, y: 1, z: 1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: -1, y: -1, z: -1 },
      { x: 0, y: 1 / PHI, z: PHI },
      { x: 0, y: 1 / PHI, z: -PHI },
      { x: 0, y: -1 / PHI, z: PHI },
      { x: 0, y: -1 / PHI, z: -PHI },
      { x: 1 / PHI, y: PHI, z: 0 },
      { x: 1 / PHI, y: -PHI, z: 0 },
      { x: -1 / PHI, y: PHI, z: 0 },
      { x: -1 / PHI, y: -PHI, z: 0 },
      { x: PHI, y: 0, z: 1 / PHI },
      { x: PHI, y: 0, z: -1 / PHI },
      { x: -PHI, y: 0, z: 1 / PHI },
      { x: -PHI, y: 0, z: -1 / PHI },
    ].map(normalize);
    const faces = [
      [0, 8, 10, 2, 16],
      [0, 16, 17, 1, 12],
      [0, 12, 14, 4, 8],
      [8, 4, 18, 6, 10],
      [10, 6, 15, 13, 2],
      [2, 13, 3, 17, 16],
      [1, 17, 3, 11, 9],
      [1, 9, 5, 14, 12],
      [4, 14, 5, 19, 18],
      [6, 18, 19, 7, 15],
      [15, 7, 11, 3, 13],
      [7, 19, 5, 9, 11],
    ];
    return { vertices: v, faces };
  },
};
