/**
 * js/shapes/dodecahedron.js
 * 構造の説明: 正十二面体
 */

import { normalize } from "../utils.js";
import { PHI } from "../constants.js";

export const dodecahedron = {
  title: "Dodecahedron",
  desc: [
    "The regular dodecahedron is a Platonic solid composed of twelve regular pentagonal faces, twenty vertices, and thirty edges. It possesses icosahedral symmetry and is deeply connected to the golden ratio (phi), which governs its spatial coordinates and dihedral angles. It is one of the five convex regular polyhedra known since antiquity.",
    "In Plato's cosmology, the dodecahedron was associated with the 'Aether' or the universe as a whole, representing the divine quintessence. Its geometry appears in various natural contexts, from the structure of certain viruses to the proposed models of the shape of the universe, such as the Poincaré dodecahedral space.",
  ],
  formulas: [
    { label: "Topology", eq: "V=20, E=30, F=12" },
    { label: "Euler Characteristic", eq: "\\chi = V - E + F = 2" },
    { label: "Dual", eq: "\\text{Icosahedron}" },
    { label: "Symmetry", eq: "I_h" },
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
