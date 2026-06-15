/**
 * js/shapes/boy.js
 * 構造の説明: ボーイ曲面
 */

import { parametric } from "../utils.js";

export const boy = {
  title: "Boy's Surface",
  desc: [
    "Boy's surface is an immersion of the real projective plane in 3-dimensional space. It was discovered by Werner Boy in 1901, solving the problem of finding an immersion of the projective plane without singularities (no sharp points).",
    "Unlike the Roman surface, Boy's surface has no sharp edges or singularities, only self-intersections. It is a highly complex topological object and remains a subject of study in differential geometry.",
  ],
  formulas: [
    { label: "Topology", eq: "\\text{Immersion of } \\mathbb{RP}^2" },
    { label: "Euler Characteristic", eq: "\\chi = 1" },
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
