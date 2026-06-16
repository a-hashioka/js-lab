/**
 * js/shapes/mobius.js
 * 構造の説明: メビウスの帯
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  parametric  } from "../utils/math";

export const mobius: ShapeDefinition = {
  id: "mobius",
  title: "Möbius Strip",
  hideVertices: true,
  desc: [
    "The Möbius strip is a surface with only one side and one boundary component. It is the most basic example of a non-orientable surface in topology. A normal vector moved along the strip will return to its starting position pointing in the opposite direction. It is a fiber bundle over the circle S^1 with the fiber being an interval.",
    "It was discovered independently by German mathematicians August Ferdinand Möbius and Johann Benedict Listing in 1858. It has become a cultural icon for infinity and recursion, while mathematically serving as a gateway to understanding more complex non-orientable manifolds like the Klein bottle and projective planes.",
  ],
  formulas: [
    {
      label: "Parametric",
      eq: "\\begin{cases} x = (1 + \\frac{v}{2}\\cos\\frac{u}{2})\\cos u \\\\ y = (1 + \\frac{v}{2}\\cos\\frac{u}{2})\\sin u \\\\ z = \\frac{v}{2}\\sin\\frac{u}{2} \\end{cases}",
    },
    { label: "Properties", eq: "\\chi = 0 \\\\ \\text{Non-orientable}" },
  ],
  generate: (_counter: number): Geometry =>
    parametric(64, 10, (u: number, v: number): Vector3 => {
      const t = v / (Math.PI * 2) - 0.5;
      const s = 0.6;
      return {
        x: (1 + t * Math.cos(u / 2)) * Math.cos(u) * s,
        y: (1 + t * Math.cos(u / 2)) * Math.sin(u) * s,
        z: t * Math.sin(u / 2) * s,
      };
    }),
};
