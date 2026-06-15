/**
 * js/shapes/kuen.js
 * 構造の説明: クエン曲面
 */

import { parametric } from "../utils.js";

export const kuen = {
  title: "Kuen Surface",
  desc: [
    "The Kuen surface is a famous example of a surface with constant negative Gaussian curvature. It is characterized by complex and very beautiful self-intersections.",
    "It belongs to the family of pseudospherical surfaces. Unlike a sphere, which has constant positive curvature, the Kuen surface illustrates properties of hyperbolic geometry in a visual 3D context.",
  ],
  formulas: [
    { label: "Gaussian Curvature", eq: "K = -1" },
    { label: "Euler Characteristic", eq: "\\chi = -2" },
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
