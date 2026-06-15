/**
 * js/shapes/knot.js
 * 構造の説明: トーラス結び目
 */

import { tube } from "../utils.js";

/**
 * トーラス結び目の管状構造の頂点と面を生成します。
 * @returns {Object} {vertices, faces}
 */
export const knot = {
  title: "Torus Knot",
  hideVertices: true,
  desc: [
    "A torus knot is a specific type of knot that lies on the surface of an unknotted torus in R³. It is characterized by two coprime integers p and q, representing the number of times the knot winds around the torus's longitudinal and meridional axes, respectively. These knots are fundamental objects in knot theory, a branch of algebraic topology.",
    "The (3,2) torus knot shown here is topologically equivalent to the trefoil knot, the simplest non-trivial knot. Torus knots are examples of fibered knots and play a significant role in the study of dynamical systems, singularity theory, and the mathematical properties of braided structures.",
  ],
  formulas: [
    {
      label: "Parametric Equations",
      eq: "x = (1 + r \\cos q\\phi) \\cos p\\phi, \\, y = (1 + r \\cos q\\phi) \\sin p\\phi, \\, z = r \\sin q\\phi",
    },
    { label: "Winding Numbers", eq: "p=3, \\, q=2" },
  ],
  generate: () => {
    const p = 3,
      q = 2;

    const pathFunc = (t) => {
      const u = t * Math.PI * 2;
      const rk = 0.7 + 0.2 * Math.cos(q * u);
      return {
        x: rk * Math.cos(p * u),
        y: rk * Math.sin(p * u),
        z: 0.2 * Math.sin(q * u),
      };
    };

    return tube(pathFunc, 150, 8, 0.1, true);
  },
};
