/**
 * js/shapes/klein.js
 * 構造の説明: クラインの壺
 */

import { parametric } from "../utils.js";

export const klein = {
  title: "Klein Bottle",
  desc: [
    "The Klein bottle is a non-orientable closed surface with no boundary. It cannot be embedded in three-dimensional space without self-intersection. It is a 2D manifold where a normal vector cannot be consistently defined.",
    "Mathematically, it can be thought of as two Möbius strips joined along their boundaries. In four-dimensional space, it can be closed without self-intersection, becoming a 'closed' surface like a sphere, but with very different topological properties.",
  ],
  formulas: [
    { label: "Euler Characteristic", eq: "\\chi(M) = 0" },
    { label: "Genus", eq: "g = 2" },
    { label: "Chromatic Number", eq: "\\gamma(M) = 6" },
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
