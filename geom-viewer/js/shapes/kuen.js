/**
 * js/shapes/kuen.js
 * 構造の説明: クエン曲面
 */

import { parametric } from "../utils.js";

export const kuen = {
  title: "Kuen Surface",
  hideVertices: true,
  desc: [
    "The Kuen surface is a non-compact surface with a constant negative Gaussian curvature of -1. It is a pseudospherical surface that features intricate self-intersections and a singular set. Mathematically, it is an immersion of the pseudosphere (Tractroid) into 3D space, preserving the constant negative curvature property.",
    "It is named after the German mathematician Alfred Kuen, who first described it in 1884. The surface is significant in the study of differential geometry and solitons, as it relates to solutions of the Sine-Gordon equation, a key equation in non-linear physics and geometry.",
  ],
  formulas: [
    {
      label: "Parametric Equations",
      eq: "\\\\begin{cases} x = \\\\frac{2(\\\\cos u + u \\\\sin u) \\\\sin v}{1 + u^2 \\\\sin^2 v} \\\\\\\\ y = \\\\frac{2(\\\\sin u - u \\\\cos u) \\\\sin v}{1 + u^2 \\\\sin^2 v} \\\\\\\\ z = \\\\ln(\\\\tan \\\\frac{v}{2}) + \\\\frac{2 \\\\cos v}{1 + u^2 \\\\sin^2 v} \\\\end{cases}",
    },
    { label: "Gaussian Curvature", eq: "K = -1" },
    { label: "Symbols", eq: "u, v \\\\text{ are parameters}" },
    {
      label: "Parameters",
      eq: "u \\\\in [-4.5, 4.5], v \\\\in (0, \\\\pi)",
    },
  ],
  generate: () =>
    parametric(
      50,
      30,
      (u, v) => {
        const d = 1 + u * u * Math.sin(v) * Math.sin(v);
        const x = (2 * (Math.cos(u) + u * Math.sin(u)) * Math.sin(v)) / d;
        const y = (2 * (Math.sin(u) - u * Math.cos(u)) * Math.sin(v)) / d;
        const z = Math.log(Math.tan(v / 2)) + (2 * Math.cos(v)) / d;
        const s = 0.25;
        return { x: x * s, y: y * s, z: z * s };
      },
      [-4.5, 4.5],
      [0.03, Math.PI * 0.98 + 0.03],
    ),
};
