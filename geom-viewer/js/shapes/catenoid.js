/**
 * js/shapes/catenoid.js
 * 構造の説明: カテノイド（懸垂面）
 */

import { parametric } from "../utils.js";

export const catenoid = {
  title: "Catenoid",
  hideVertices: true,
  desc: [
    "The catenoid is the only minimal surface of revolution other than the plane. It is formed by rotating a catenary curve—the shape assumed by a hanging chain—around a central axis. Its mean curvature is zero at every point, which corresponds to the physical shape of a soap film stretched between two parallel circular frames.",
    "Discovered by Leonhard Euler in 1744, the catenoid is a fundamental object in differential geometry. It is locally isometric to the helicoid, meaning it can be continuously deformed into a spiral surface without stretching or tearing, a transformation that preserves the surface's minimal property.",
  ],
  formulas: [
    { label: "Implicit Equation", eq: "\\\\sqrt{x^2 + y^2} = \\\\cosh z" },
    { label: "Curvatures", eq: "H = 0, \\\\, K = -\\\\text{sech}^4 z" },
  ],
  /**
   * カテノイドの頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () =>
    parametric(
      40,
      40,
      (u, v) => {
        const c = 0.5;
        const x = c * Math.cosh(v / c) * Math.cos(u);
        const y = c * Math.cosh(v / c) * Math.sin(u);
        const z = v;
        const s = 0.55;
        return { x: x * s, y: y * s, z: z * s };
      },
      [0, Math.PI * 2],
      [-1.2, 1.2],
    ),
};
