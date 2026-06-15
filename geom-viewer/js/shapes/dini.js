/**
 * js/shapes/dini.js
 * 構造の説明: ディニ曲面
 */

import { parametric } from "../utils.js";

export const dini = {
  title: "Dini's Surface",
  hideVertices: true,
  desc: [
    "Dini's surface is a surface with constant negative Gaussian curvature. It is constructed by twisting a pseudosphere and is a rare example of a helicoid with constant curvature.",
    "It is named after the Italian mathematician Ulisse Dini. It is an important object in the study of differential geometry. Its complex spiral appearance arises from a combination of vertical linear motion and circular motion.",
  ],
  formulas: [
    { label: "Gaussian Curvature", eq: "K = -1" },
    {
      label: "Parametric Representation",
      eq: "\\begin{cases} x = a\\cos u\\sin v \\\\ y = a\\sin u\\sin v \\\\ z = a(\\cos v + \\ln(\\tan\\frac{v}{2})) + bu \\end{cases}",
    },
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
