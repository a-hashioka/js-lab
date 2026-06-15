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
    "The regular icosahedron is a Platonic solid consisting of twenty equilateral triangular faces, twelve vertices, and thirty edges. It exhibits icosahedral symmetry, the highest symmetry of any convex regular polyhedron, and is the dual of the regular dodecahedron; connecting the centers of its twenty faces yields a regular dodecahedron. Its geometry is defined by the golden ratio, which determines the spatial distribution of its vertices.",
    "In the Platonic tradition, the icosahedron was associated with the element of 'Water' due to its fluid-like, nearly spherical appearance. In modern science, its structure is a fundamental model for viral capsids (the protein shells of viruses) and geodesic domes, providing a highly efficient way to enclose a volume with minimal surface area.",
  ],
  formulas: [
    { label: "Schläfli Symbol", eq: "\\{3, 5\\}" },
    { label: "Topology", eq: "V=12, E=30, F=20" },
    { label: "Euler Characteristic", eq: "\\chi = V - E + F = 2" },
    { label: "Dual", eq: "\\text{Dodecahedron}" },
    { label: "Symmetry", eq: "I_h" },
  ],
  /**
   * 正二十面体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => ({ vertices: ICO_VERTICES, faces: ICO_FACES }),
};
