/**
 * js/shapes/icosahedron.js
 * 構造の説明: 正二十面体
 */

import { normalize } from "../utils.js";
import { PHI } from "../constants.js";

export const ICO_VERTICES = [
  { x: -1, y: PHI, z: 0 },
  { x: 1, y: PHI, z: 0 },
  { x: -1, y: -PHI, z: 0 },
  { x: 1, y: -PHI, z: 0 },
  { x: 0, y: -1, z: PHI },
  { x: 0, y: 1, z: PHI },
  { x: 0, y: -1, z: -PHI },
  { x: 0, y: 1, z: -PHI },
  { x: PHI, y: 0, z: -1 },
  { x: PHI, y: 0, z: 1 },
  { x: -PHI, y: 0, z: -1 },
  { x: -PHI, y: 0, z: 1 },
].map(normalize);

export const ICO_FACES = [
  [0, 11, 5],
  [0, 5, 1],
  [0, 1, 7],
  [0, 7, 10],
  [0, 10, 11],
  [1, 5, 9],
  [5, 11, 4],
  [11, 10, 2],
  [10, 7, 6],
  [7, 1, 8],
  [3, 9, 4],
  [3, 4, 2],
  [3, 2, 6],
  [3, 6, 8],
  [3, 8, 9],
  [4, 9, 5],
  [2, 4, 11],
  [6, 2, 10],
  [8, 6, 7],
  [9, 8, 1],
];

export const icosahedron = {
  title: "Icosahedron",
  desc: [
    "An icosahedron is a polyhedron with 20 faces, which are equilateral triangles. It has the most faces of all Platonic solids.",
    "It is often used as a model for viral capsids and geodesic domes due to its efficiency in approximating a sphere.",
  ],
  formulas: [
    { label: "Volume", eq: "V = \\frac{5(3 + \\sqrt{5})}{12}a^3" },
    { label: "Surface Area", eq: "S = 5\\sqrt{3}a^2" },
  ],
  /**
   * 正二十面体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => ({ vertices: ICO_VERTICES, faces: ICO_FACES }),
};
