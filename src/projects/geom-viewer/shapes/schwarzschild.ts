/**
 * js/shapes/schwarzschild.js
 * Schwarzschild Metric (Flamm's Paraboloid)
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  parametric  } from "../utils/math";

export const schwarzschild: ShapeDefinition = {
  id: "schwarzschild",
  title: "Schwarzschild Spacetime",
  desc: [
    "This shape, known as Flamm's paraboloid, is a 2D visualization of the Schwarzschild metric's spatial curvature. It represents the warping of space around a non-rotating, spherically symmetric massive object like a black hole.",
    "The 'throat' of the paraboloid represents the event horizon. In this projection, the vertical dimension represents the excess radial distance due to the curvature of spacetime as predicted by General Relativity.",
  ],
  formulas: [
    { label: "Schwarzschild Radius", eq: "r_s = \\frac{2GM}{c^2}" },
    { label: "Radial Displacement", eq: "w(r) = 2\\sqrt{r_s(r - r_s)}" },
  ],
  generate: (_counter: number): Geometry => {
    const rs = 0.4;
    const s = 0.35; // Scaling factor
    return parametric(
      40, 60,
      (r: number, theta: number): Vector3 => {
        const w = 2 * Math.sqrt(rs * (r - rs));
        return {
          x: r * Math.cos(theta) * s,
          y: (w - 1.0) * s,
          z: r * Math.sin(theta) * s,
        };
      },
      [rs, 3.0],
      [0, Math.PI * 2]
    );
  },
};
