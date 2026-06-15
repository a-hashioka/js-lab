/**
 * js/shapes/mobius.js
 * 構造の説明: メビウスの帯
 */

import { parametric } from "../utils.js";

export const mobius = {
  title: "Möbius Strip",
  hideVertices: true,
  desc: [
    "A Möbius strip is a surface with only one side and only one boundary. It is the simplest non-orientable surface. If you travel along the length of the strip, you will return to your starting point but on the 'other' side.",
    "It was discovered independently by August Ferdinand Möbius and Johann Benedict Listing in 1858. It is a classic example in topology, showing how a simple twist can change the fundamental properties of a manifold.",
  ],
  formulas: [
    { label: "Euler Characteristic", eq: "\\chi = 0" },
    { label: "Boundary", eq: "\\partial M \\cong S^1" },
    {
      label: "Parametric (Centerline)",
      eq: "\\begin{cases} x = r\\cos\\theta \\\\ y = r\\sin\\theta \\\\ z = 0 \\end{cases}",
    },
  ],
  generate: () =>
    parametric(64, 10, (u, v) => {
      const t = v / (Math.PI * 2) - 0.5;
      const s = 0.6;
      return {
        x: (1 + t * Math.cos(u / 2)) * Math.cos(u) * s,
        y: (1 + t * Math.cos(u / 2)) * Math.sin(u) * s,
        z: t * Math.sin(u / 2) * s,
      };
    }),
};
