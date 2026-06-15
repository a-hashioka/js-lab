/**
 * js/shapes/tetrahedron.js
 * 構造の説明: 正四面体
 */

import { normalize } from "../utils.js";

export const tetrahedron = {
  title: "Tetrahedron",
  desc: [
    "The regular tetrahedron is a Platonic solid composed of four equilateral triangular faces, six edges, and four vertices. It is the 3D case of a n-simplex. It is unique among Platonic solids as it is its own dual and lacks parallel faces. Its symmetry group is the tetrahedral group T_d.",
    "Described by Plato as the geometric representation of the element Fire due to its sharp points and simplicity. It is a fundamental building block in chemistry and structural engineering, forming the basis for the silicon-oxygen tetrahedron in silicates and the molecular geometry of sp^3 hybridized carbon.",
  ],
  formulas: [
    {
      label: "Unit Vertices",
      eq: "(1,1,1), (1,-1,-1), (-1,1,-1), (-1,-1,1)",
    },
    { label: "Volume", eq: "V = \\\\frac{a^3}{6\\\\sqrt{2}}" },
    { label: "Surface Area", eq: "S = \\\\sqrt{3} a^2" },
    {
      label: "Dihedral Angle",
      eq: "\\\\theta = \\\\arccos(1/3) \\\\approx 70.53^\\\\circ",
    },
    { label: "Symbols", eq: "a \\\\text{ is the edge length}" },
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
