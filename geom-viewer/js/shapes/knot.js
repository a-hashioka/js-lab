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
  desc: [
    "A torus knot is a special kind of knot that lies on the surface of an unknotted torus in three-dimensional space.",
    "This model shows a (3,2) torus knot, which is topologically equivalent to the trefoil knot.",
  ],
  formulas: [
    {
      label: "Parametric Equations",
      eq: "\\begin{cases} x = (R + r\\cos q\\phi)\\cos p\\phi \\\\ y = (R + r\\cos q\\phi)\\sin p\\phi \\\\ z = r\\sin q\\phi \\end{cases}",
    },
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
