/**
 * js/shapes/super.js
 * 構造の説明: スーパーシェイプ
 */

import { parametric } from "../utils.js";

/**
 * スーパーシェイプ（超公式）に基づいた頂点と面を生成します。
 * @returns {Object} {vertices, faces}
 */
export const superShape = {
  title: "Supershape",
  hideVertices: true,
  desc: [
    "The supershape equation is a generalization of the superellipse, capable of describing a vast range of complex symmetrical shapes found in nature.",
  ],
  formulas: [
    {
      label: "Gielis Formula",
      eq: "r(\\theta) = \\left[ \\left| \\frac{\\cos(\\frac{m\\theta}{4})}{a} \\right|^{n_2} + \\left| \\frac{\\sin(\\frac{m\\theta}{4})}{b} \\right|^{n_3} \\right]^{-\\frac{1}{n_1}}",
    },
  ],
  generate: () => {
    const m = 5,
      n1 = 1,
      n2 = 1,
      n3 = 1;

    const sf = (t) =>
      Math.pow(
        Math.pow(Math.abs(Math.cos((m * t) / 4)), n2) +
          Math.pow(Math.abs(Math.sin((m * t) / 4)), n3),
        -1 / n1,
      );

    return parametric(
      40,
      20,
      (lon, lat) => {
        const r1 = sf(lon),
          r2 = sf(lat);
        const s = 0.8;
        return {
          x: r1 * Math.cos(lon) * r2 * Math.cos(lat) * s,
          y: r1 * Math.sin(lon) * r2 * Math.cos(lat) * s,
          z: r2 * Math.sin(lat) * s,
        };
      },
      [-Math.PI / 2, Math.PI / 2],
      [-Math.PI, Math.PI],
    );
  },
};
