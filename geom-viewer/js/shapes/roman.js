/**
 * js/shapes/roman.js
 * 構造の説明: ローマン曲面
 */

import { parametric } from "../utils.js";

export const roman = {
  title: "Roman Surface",
  hideVertices: true,
  desc: [
    "The Roman surface, also known as the Steiner surface, is a non-orientable quartic surface that represents a self-intersecting mapping of the real projective plane RP^2 into 3D space. It possesses tetrahedral symmetry and contains three double-line segments and six 'pinch points' (Whitney singularities) where the surface is locally homeomorphically equivalent to a cross-cap.",
    "It was discovered by the Swiss mathematician Jakob Steiner in 1844 while he was visiting Rome, hence its name. Unlike Boy's surface, which is an immersion without singularities, the Roman surface is an easier-to-parameterize but singular representation of the projective plane.",
  ],
  formulas: [
    { label: "Implicit Equation", eq: "x^2 y^2 + y^2 z^2 + z^2 x^2 + xyz = 0" },
    {
      label: "Parametric Equations",
      eq: "x = \\\\sin 2u \\\\cos^2 v, \\\\, y = \\\\sin u \\\\sin 2v, \\\\, z = \\\\cos u \\\\sin 2v",
    },
  ],
  generate: () =>
    parametric(
      40,
      40,
      (u, v) => {
        const x = Math.sin(u) * Math.cos(u) * Math.sin(v) * Math.sin(v);
        const y = Math.sin(u) * Math.cos(v) * Math.sin(v);
        const z = Math.cos(u) * Math.cos(v) * Math.sin(v);
        const s = 1.8;
        return { x: x * s, y: y * s, z: z * s };
      },
      [0, Math.PI],
      [0, Math.PI],
    ),
};
