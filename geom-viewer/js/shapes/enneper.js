/**
 * js/shapes/enneper.js
 * 構造の説明: エンネパー曲面
 */

import { parametric } from "../utils.js";

export const enneper = {
  title: "Enneper Surface",
  hideVertices: true,
  desc: [
    "The Enneper surface is a self-intersecting minimal surface first described by Alfred Enneper in 1864. In differential geometry, a minimal surface is defined as a surface where the mean curvature is zero at every point, which physically corresponds to a state of localized area minimization, such as that seen in stable soap films.",
    "While defined by simple polynomial equations in its Weierstrass representation, the surface exhibits complex topological properties, including winding and self-intersection as its domain increases. It is frequently used as an introductory example in the study of minimal surfaces due to its algebraic simplicity and elegant symmetry.",
  ],
  formulas: [
    {
      label: "Parametric Equations",
      eq: "\\\\begin{cases} x = u - \\\\frac{u^3}{3} + uv^2 \\\\\\\\ y = v - \\\\frac{v^3}{3} + vu^2 \\\\\\\\ z = u^2 - v^2 \\\\end{cases}",
    },
    { label: "Mean Curvature", eq: "H = 0" },
    {
      label: "Symbols",
      eq: "u, v: \\\\text{parameters}, \\\\quad x, y, z: \\\\text{coordinates}",
    },
    { label: "Parameters", eq: "s = 0.18" },
  ],
  /**
   * エンネパー曲面の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () =>
    parametric(
      30,
      30,
      (u, v) => {
        const x = u - (u * u * u) / 3 + u * v * v;
        const y = v - (v * v * v) / 3 + v * u * u;
        const z = u * u - v * v;
        const s = 0.18;
        return { x: x * s, y: y * s, z: z * s };
      },
      [-2, 2],
      [-2, 2],
    ),
};
