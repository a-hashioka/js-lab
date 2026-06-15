/**
 * js/shapes/interference.js
 * Interference Pattern
 */

import { parametric } from "../utils.js";

export const interference = {
  title: "Interference Pattern",
  isDynamic: true,
  hideVertices: true,
  desc: [
    "Interference is a phenomenon in which two waves superpose to form a resultant wave of greater, lower, or the same amplitude. This visualization shows the constructive and destructive interference of two point sources on a 2D plane.",
    "The peaks (constructive) and troughs (destructive) create a hyperbolic pattern of intensity, which is a fundamental principle in wave mechanics and optics.",
  ],
  formulas: [
    { label: "Superposition Principle", eq: "\\Psi(r, t) = A_1 \\cos(k r_1 - \\omega t) + A_2 \\cos(k r_2 - \\omega t)" },
    { label: "Phase Difference", eq: "\\Delta \\phi = k(r_1 - r_2)" },
  ],
  generate: (time = 0) => {
    const s = 0.3; // Scaling factor
    const omega = 0.1;
    return parametric(
      40, 40,
      (u, v) => {
        const x = u;
        const y = v;
        const d = 1.5; // distance between sources
        const r1 = Math.sqrt((x - d) ** 2 + y ** 2);
        const r2 = Math.sqrt((x + d) ** 2 + y ** 2);
        const k = 5.0; // wave number
        const z = 0.2 * (Math.cos(k * r1 - time * omega) + Math.cos(k * r2 - time * omega));
        return { x: x * s, y: z * s, z: y * s };
      },
      [-3, 3],
      [-3, 3]
    );
  },
};
