/**
 * js/shapes/hyper.js
 * 構造の説明: 一葉双曲面
 */

import { parametric } from "../utils.js";

export const hyper = {
  title: "Hyperboloid of One Sheet",
  desc: [
    "A hyperboloid of one sheet is a doubly ruled surface, meaning that through every point on the surface, there are two distinct lines that lie entirely on the surface.",
    "This structural property is widely used in architecture and engineering (e.g., cooling towers) as it allows for the construction of curved structures using entirely straight beams. It is a quadric surface defined by an indefinite quadratic form.",
  ],
  formulas: [
    {
      label: "Cartesian Equation",
      eq: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1",
    },
    { label: "Gaussian Curvature", eq: "K < 0 \\text (everywhere)" },
  ],
  generate: () =>
    parametric(
      30,
      30,
      (vIdx, u) => {
        const z = (vIdx / 30 - 0.5) * 2;
        const r = Math.sqrt(1 + z * z * 0.5);
        const s = 0.45;
        return { x: Math.cos(u) * r * s, y: Math.sin(u) * r * s, z: z * s };
      },
      [0, 30],
      [0, Math.PI * 2],
    ),
};
