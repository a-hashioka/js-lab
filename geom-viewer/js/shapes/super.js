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
    "The supershape is a geometric object defined by the Gielis formula, which generalizes the superellipse and Lamé curves. By varying a small set of parameters, it can produce an extraordinary variety of shapes, from circles and polygons to starfish and floral patterns. It utilizes trigonometric functions raised to varying powers to control symmetry and curvature.",
    "The formula was proposed by the Belgian biologist Johan Gielis in 2003. He suggested that many complex biological forms in nature, such as the cross-sections of plant stems or the shells of mollusks, could be described mathematically using this single unified equation.",
  ],
  formulas: [
    {
      label: "Gielis Formula",
      eq: "r(\\\\theta) = \\\\left[ \\\\left| \\\\frac{\\\\cos(\\\\frac{m\\\\theta}{4})}{a} \\\\right|^{n_2} + \\\\left| \\\\frac{\\\\sin(\\\\frac{m\\\\theta}{4})}{b} \\\\right|^{n_3} \\\\right]^{-\\\\frac{1}{n_1}}",
    },
    {
      label: "3D Parametric Mapping",
      eq: "\\\\begin{cases} x = r_1(\\\\theta) \\\\cos \\\\theta \\\\cdot r_2(\\\\phi) \\\\cos \\\\phi \\\\\\\\ y = r_1(\\\\theta) \\\\sin \\\\theta \\\\cdot r_2(\\\\phi) \\\\cos \\\\phi \\\\\\\\ z = r_2(\\\\phi) \\\\sin \\\\phi \\\\end{cases}",
    },
    {
      label: "Symbols",
      eq: "\\\\theta, \\\\phi \\\\text{ (angles)}; m, n_1, n_2, n_3 \\\\text{ (shape)}; a, b \\\\text{ (scale)}",
    },
    { label: "Parameters", eq: "m=5, n_1=1, n_2=1, n_3=1" },
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
