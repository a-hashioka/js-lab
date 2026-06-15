/**
 * js/shapes/roman.js
 * 構造の説明: ローマン曲面
 */

import { parametric } from "../utils.js";

export const roman = {
  title: "Roman Surface",
  desc: [
    "The Roman surface (also known as the Steiner surface) is a self-intersecting immersion of the real projective plane into three-dimensional space. It features high symmetry including six pinch points (Whitney singularities).",
    "It is named after Jakob Steiner, who discovered it during a stay in Rome. It is related to Boy's surface but differs in that it possesses specific singularities. It provides a visual means to understand the complex topology of the projective plane.",
  ],
  formulas: [
    { label: "Algebraic Equation", eq: "x^2y^2 + y^2z^2 + z^2x^2 + xyz = 0" },
    { label: "Genus", eq: "g = 1" },
  ],
  generate: () =>
    parametric(
      40,
      40,
      (u, v) => {
        const x = Math.sin(u) * Math.cos(u) * Math.sin(v) * Math.sin(v);
        const y = Math.sin(u) * Math.cos(v) * Math.sin(v);
        const z = Math.cos(u) * Math.cos(v) * Math.sin(v);
        const s = 1.8;
        return { x: x * s, y: y * s, z: z * s };
      },
      [0, Math.PI],
      [0, Math.PI],
    ),
};
