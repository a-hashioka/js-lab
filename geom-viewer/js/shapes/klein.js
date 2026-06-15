/**
 * js/shapes/klein.js
 * 構造の説明: クラインの壺
 */

import { parametric } from "../utils.js";

export const klein = {
  title: "Klein Bottle",
  hideVertices: true,
  desc: [
    "The Klein bottle is a non-orientable closed surface with no boundary, representing a topological space where a consistent notion of 'inside' and 'outside' does not exist. It is a two-dimensional manifold that cannot be embedded in three-dimensional Euclidean space without self-intersection, though it can be perfectly realized in four or more dimensions.",
    "First described by Felix Klein in 1882, the bottle can be conceptualized as two Möbius strips joined along their boundaries or as a rectangle where opposite sides are glued with a specific twist. Its properties, such as its vanishing Euler characteristic, make it a cornerstone of algebraic topology and the study of non-orientable manifolds.",
  ],
  formulas: [
    { label: "Euler Characteristic", eq: "\\\\chi = 0" },
    {
      label: "Fundamental Group",
      eq: "\\\\pi_1(K) = \\\\langle a, b \\\\mid abab^{-1} = 1 \\\\rangle",
    },
    {
      label: "Symbols",
      eq: "u, v: \\\\text{parameters}, \\\\quad x, y, z: \\\\text{coordinates}",
    },
    { label: "Parameters", eq: "s = 0.4" },
  ],
  generate: () =>
    parametric(
      40,
      40,
      (u, v) => {
        const cu = Math.cos(u),
          su = Math.sin(u),
          cv = Math.cos(v),
          sv = Math.sin(v);
        const x =
          (-2 / 15) *
          cu *
          (3 * cv -
            30 * su +
            90 * Math.pow(cu, 4) * su -
            60 * Math.pow(cu, 6) * su +
            5 * cu * cv * su);
        const y =
          (-1 / 15) *
          su *
          (3 * cv -
            3 * cu * cu * cv -
            48 * Math.pow(cu, 4) * cv +
            48 * Math.pow(cu, 6) * cv -
            60 * su +
            5 * cu * cv * su -
            5 * Math.pow(cu, 3) * cv * su -
            80 * Math.pow(cu, 5) * cv * su +
            80 * Math.pow(cu, 7) * cv * su);
        const z = (2 / 15) * (3 + 5 * cu * su) * sv;
        const s = 0.4;
        return { x: x * s, y: y * s, z: z * s };
      },
      [0, Math.PI],
      [0, Math.PI * 2],
    ),
};
