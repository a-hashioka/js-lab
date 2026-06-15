/**
 * js/shapes/tetrahedron.js
 * 構造の説明: 正四面体
 */

import { normalize } from "../utils.js";

export const tetrahedron = {
  title: "Tetrahedron",
  desc: [
    "The tetrahedron is the simplest of all the convex polyhedra and the only one that has four faces. It is the three-dimensional case of a simplex in Euclidean geometry.",
    "In nature, it is found in the covalent bonds of molecules like methane (CH4) and the crystal structure of diamond.",
  ],
  formulas: [
    { label: "Volume", eq: "V = \\frac{a^3}{6\\sqrt{2}}" },
    { label: "Surface Area", eq: "S = \\sqrt{3}a^2" },
  ],
  /**
   * 正四面体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => ({
    vertices: [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
    ].map(normalize),
    faces: [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ],
  }),
};
