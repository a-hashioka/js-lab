/**
 * js/shapes/diatom.js
 * 構造の説明: 珪藻 (Diatom)
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  parametric  } from "../utils/math";

export const diatom: ShapeDefinition = {
  id: "diatom",
  title: "Diatom Shell",
  desc: [
    "Diatoms are single-celled algae that create intricate, symmetrical shells made of silica (glass). These shells, called frustules, exhibit diverse geometric patterns.",
    "This model approximates a centric diatom shell with radial symmetry and a porous surface structure.",
  ],
  formulas: [
    { label: "Symmetry", eq: "\\text{Radial / Centric}" },
  ],
  generate: (_counter: number): Geometry => {
    return parametric(50, 50, (u: number, v: number): Vector3 => {
      const r = 0.6 + 0.05 * Math.sin(12 * v) * Math.sin(u);
      return {
        x: r * Math.sin(u) * Math.cos(v),
        y: 0.2 * Math.cos(u) + 0.05 * Math.cos(12 * v),
        z: r * Math.sin(u) * Math.sin(v)
      };
    }, [0, Math.PI], [0, Math.PI * 2]);
  }
};
