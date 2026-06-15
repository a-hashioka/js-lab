/**
 * js/shapes/dini.js
 * 構造の説明: ディニ曲面
 */

import { parametric } from "../utils.js";

export const dini = {
  title: "Dini's Surface",
  hideVertices: true,
  desc: [
    "Dini's surface is a surface of constant negative Gaussian curvature, making it a model for hyperbolic geometry. It is constructed by twisting a pseudosphere into a helicoid-like shape, resulting in a complex spiral that extends infinitely while maintaining its geometric properties. It is a critical example in the study of non-Euclidean surfaces.",
    "Named after the Italian mathematician Ulisse Dini, the surface is a specific type of pseudospherical surface. It is mathematically unique for its combination of logarithmic and trigonometric functions in its parametrization, providing a bridge between the geometry of spheres and the topology of helicoids.",
  ],
  formulas: [
    {
      label: "Parametric Equations",
      eq: "x = \\cos u \\sin v, \\, y = \\sin u \\sin v, \\, z = \\cos v + \\ln \\tan \\frac{v}{2} + bu",
    },
    { label: "Properties", eq: "K = -1, \\, b = 0.15, \\, u \\in [0, 4\\pi]" },
  ],
  /**
   * ディニ曲面の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () =>
    parametric(
      60,
      20,
      (u, v) => {
        const x = Math.cos(u) * Math.sin(v);
        const y = Math.sin(u) * Math.sin(v);
        const z = Math.cos(v) + Math.log(Math.tan(v / 2)) + 0.15 * u;
        const s = 0.3;
        return { x: x * s, y: y * s, z: (z - 1.2) * s };
      },
      [0, Math.PI * 4],
      [0.01, 2.01],
    ),
};
