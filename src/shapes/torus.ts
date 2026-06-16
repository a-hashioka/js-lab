/**
 * js/shapes/torus.js
 * 構造の説明: トーラス
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  parametric  } from "../utils/math";

export const torus: ShapeDefinition = {
  id: "torus",
  title: "Torus",
  desc: [
    "A torus is a surface of revolution formed by rotating a circle in 3D space about an axis that is coplanar with the circle but does not intersect it. Topologically, it is an orientable surface of genus 1, equivalent to the Cartesian product of two circles S^1 \\times S^1. It is a key example of a manifold that is compact but has zero Gaussian curvature when viewed as a flat torus.",
    "The study of the torus dates back to ancient Greek mathematics, specifically Archytas of Tarentum. In modern physics, it is the standard shape for Tokamak nuclear fusion reactors and appears in string theory as the shape of compactified extra dimensions.",
  ],
  formulas: [
    {
      label: "Parametric",
      eq: "\\begin{cases} x = (R + r\\cos v)\\cos u \\\\ y = (R + r\\cos v)\\sin u \\\\ z = r\\sin v \\end{cases}",
    },
    { label: "Topology", eq: "S^1 \\times S^1" },
  ],
  generate: (_counter: number): Geometry =>
    parametric(32, 16, (u: number, v: number): Vector3 => {
      const R = 0.6,
        r = 0.22;
      return {
        x: (R + r * Math.cos(v)) * Math.cos(u),
        y: (R + r * Math.cos(v)) * Math.sin(u),
        z: r * Math.sin(v),
      };
    }),
};
