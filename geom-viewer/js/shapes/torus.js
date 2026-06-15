/**
 * js/shapes/torus.js
 * 構造の説明: トーラス
 */

import { parametric } from "../utils.js";

export const torus = {
  title: "Torus",
  desc: [
    "A torus is a surface of revolution formed by rotating a circle in 3D space about an axis that is coplanar with the circle but does not intersect it. Topologically, it is an orientable surface of genus 1, equivalent to the Cartesian product of two circles S^1 \\times S^1. It is a key example of a manifold that is compact but has zero Gaussian curvature when viewed as a flat torus.",
    "The study of the torus dates back to ancient Greek mathematics, specifically Archytas of Tarentum. In modern physics, it is the standard shape for Tokamak nuclear fusion reactors and appears in string theory as the shape of compactified extra dimensions.",
  ],
  formulas: [
    {
      label: "Parametric Equations",
      eq: "\\\\begin{cases} x = (R + r \\\\cos v) \\\\cos u \\\\\\\\ y = (R + r \\\\cos v) \\\\sin u \\\\\\\\ z = r \\\\sin v \\\\end{cases}",
    },
    {
      label: "Implicit Equation",
      eq: "(\\\\sqrt{x^2 + y^2} - R)^2 + z^2 = r^2",
    },
    { label: "Volume", eq: "V = 2 \\\\pi^2 R r^2" },
    { label: "Surface Area", eq: "S = 4 \\\\pi^2 R r" },
    {
      label: "Symbols",
      eq: "R \\\\text{ (major radius)}, r \\\\text{ (minor radius)}",
    },
    { label: "Parameters", eq: "u, v \\\\in [0, 2\\\\pi]" },
  ],
  generate: () =>
    parametric(32, 16, (u, v) => {
      const R = 0.6,
        r = 0.25;
      const s = 0.9;
      return {
        x: (R + r * Math.cos(v)) * Math.cos(u) * s,
        y: (R + r * Math.cos(v)) * Math.sin(u) * s,
        z: r * Math.sin(v) * s,
      };
    }),
};
