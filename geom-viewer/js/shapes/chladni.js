/**
 * js/shapes/chladni.js
 * Chladni Figure
 */

import { parametric } from "../utils.js";

export const chladni = {
  title: "Chladni Figure",
  isDynamic: true,
  hideVertices: true,
  desc: [
    "Chladni figures are patterns formed by particles of sand on a vibrating plate. When the plate vibrates at a resonant frequency, the sand migrates to the nodal lines—where the plate is stationary.",
    "The patterns are solutions to the biharmonic equation for a vibrating plate. This visualization represents the displacement of the plate surface, where the zero-crossing lines correspond to the observed sand patterns.",
  ],
  formulas: [
    { label: "Displacement Function", eq: "w(x, y, t) = A \\sin(\\omega t) [\\sin(n\\pi x) \\sin(m\\pi y) + \\sin(m\\pi x) \\sin(n\\pi y)]" },
    { label: "Nodal Condition", eq: "w(x, y, t) = 0" },
  ],
  generate: (time = 0) => {
    const n = 3, m = 2;
    const s = 0.3; // Scaling factor
    const amp = Math.sin(time * 0.05);
    return parametric(
      30, 30,
      (u, v) => {
        const x = u * s;
        const y = v * s;
        const z = 0.2 * (Math.sin(n * u) * Math.sin(m * v) + Math.sin(m * u) * Math.sin(n * v)) * s * amp;
        return { x, y: z, z: y };
      },
      [-Math.PI, Math.PI],
      [-Math.PI, Math.PI]
    );
  },
};
