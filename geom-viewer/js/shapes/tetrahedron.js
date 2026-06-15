/**
 * js/shapes/tetrahedron.js
 * 構造の説明: 正四面体
 */

import { normalize } from "../utils.js";

export const TETRA_VERTICES = [
  { x: 1, y: 1, z: 1 },
  { x: 1, y: -1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
].map(normalize);

export const tetrahedron = {
  title: "Tetrahedron",
  desc: [
    "The regular tetrahedron is a Platonic solid composed of four equilateral triangular faces, six edges, and four vertices. It is the 3D case of a n-simplex. It is unique among Platonic solids as it is its own dual (self-dual); connecting the centers of its four faces yields another regular tetrahedron. It lacks parallel faces, and its symmetry group is the tetrahedral group T_d.",
    "Described by Plato as the geometric representation of the element Fire due to its sharp points and simplicity. It is a fundamental building block in chemistry and structural engineering, forming the basis for the silicon-oxygen tetrahedron in silicates and the molecular geometry of sp^3 hybridized carbon.",
  ],
  formulas: [
    { label: "Schläfli Symbol", eq: "\\{3, 3\\}" },
    { label: "Topology", eq: "V=4, E=6, F=4" },
    { label: "Euler Characteristic", eq: "\\chi = V - E + F = 2" },
    { label: "Dihedral Angle", eq: "\\arccos(1/3) \\approx 70.53^\\circ" },
    { label: "Dual", eq: "\\text{Self-dual (Tetrahedron)}" },
    { label: "Symmetry", eq: "T_d" },
  ],
  /**
   * 正四面体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => ({
    vertices: TETRA_VERTICES.map(v => ({ x: v.x * 0.75, y: v.y * 0.75, z: v.z * 0.75 })),
    faces: [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ],
  }),
};
