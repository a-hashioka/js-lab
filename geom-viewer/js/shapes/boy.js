/**
 * js/shapes/boy.js
 * 構造の説明: ボーイ曲面
 */

import { parametric } from "../utils.js";

export const boy = {
  title: "Boy's Surface",
  hideVertices: true,
  desc: [
    "Boy's surface is an immersion of the real projective plane (RP²) in three-dimensional space. It is a non-orientable surface with a single triple point and no other singularities, possessing a continuous tangent plane at every point. It is a critical object in differential geometry and topology, representing a smooth mapping of a compact, non-orientable surface into R³.",
    "Discovered by Werner Boy in 1901 under the direction of David Hilbert, the surface settled the question of whether a smooth immersion of the real projective plane into R³ was possible. Unlike the Roman and Cross-cap surfaces, Boy's surface has no pinch point singularities, making it a masterpiece of topological construction.",
  ],
  formulas: [
    {
      label: "Parametric (x, y)",
      eq: "\\frac{\\sqrt{2}\\cos 2u \\cos^2 v + \\cos u \\sin 2v}{2 - \\sqrt{2}\\sin 3u \\sin 2v}, \\dots",
    },
    {
      label: "Properties",
      eq: "\\chi = 1, \\, \\text{Projective Plane Immersion}",
    },
  ],
  /**
   * ボーイ曲面の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () =>
    parametric(
      40,
      40,
      (u, v) => {
        const cu = Math.cos(u),
          su = Math.sin(u),
          cv = Math.cos(v);
        const d = 2 - Math.sqrt(2) * Math.sin(3 * u) * Math.sin(2 * v);
        const x =
          (Math.sqrt(2) * Math.cos(2 * u) * cv * cv + cu * Math.sin(2 * v)) / d;
        const y =
          (Math.sqrt(2) * Math.sin(2 * u) * cv * cv - su * Math.sin(2 * v)) / d;
        const z = (3 * cv * cv) / d - 1.25;
        const s = 0.5;
        return { x: x * s, y: y * s, z: z * s };
      },
      [0, Math.PI],
      [0, Math.PI],
    ),
};
