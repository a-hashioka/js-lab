/**
 * js/shapes/enneper.js
 * 構造の説明: エンネパー曲面
 */

import { parametric } from "../utils.js";

export const enneper = {
  title: "Enneper Surface",
  desc: [
    "The Enneper surface is a self-intersecting minimal surface first described by Alfred Enneper in 1864. A minimal surface is a surface that locally minimizes its area, which is equivalent to having zero mean curvature everywhere.",
    "Although defined by mathematically elegant and simple polynomial functions, it cannot exist as a physical model of a soap film beyond local regions because it self-intersects globally.",
  ],
  formulas: [
    { label: "Mean Curvature", eq: "H = 0" },
    {
      label: "Parametric Equations",
      eq: "\\begin{cases} x = u - \\frac{u^3}{3} + uv^2 \\\\ y = v - \\frac{v^3}{3} + vu^2 \\\\ z = u^2 - v^2 \\end{cases}",
    },
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
