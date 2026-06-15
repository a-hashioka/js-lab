/**
 * js/shapes/honeycomb.js
 * Honeycomb Structure (Hexagonal Tiling)
 */

import { vec } from "../utils.js";

const generateHoneycomb = (rows = 3, cols = 3, height = 0.2, scale = 0.2) => {
  const allVerts = [];
  const allFaces = [];

  const addHexPrism = (cx, cy, r, h) => {
    const base = allVerts.length;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dx = Math.cos(angle) * r;
      const dy = Math.sin(angle) * r;
      allVerts.push({ x: cx + dx, y: cy + dy, z: -h / 2 });
      allVerts.push({ x: cx + dx, y: cy + dy, z: h / 2 });
    }

    // Side faces
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      allFaces.push([base + i * 2, base + next * 2, base + next * 2 + 1, base + i * 2 + 1]);
    }
    // Top and bottom
    const top = [], bot = [];
    for (let i = 0; i < 6; i++) {
      bot.push(base + i * 2);
      top.push(base + (5 - i) * 2 + 1);
    }
    allFaces.push(top, bot);
  };

  const dx = scale * 1.5;
  const dy = scale * Math.sqrt(3);

  for (let r = -rows; r <= rows; r++) {
    for (let c = -cols; c <= cols; c++) {
      let x = c * dx;
      let y = r * dy;
      if (c % 2 !== 0) y += dy / 2;
      addHexPrism(x, y, scale * 0.95, height);
    }
  }

  return { vertices: allVerts, faces: allFaces };
};

export const honeycomb = {
  title: "Honeycomb",
  hideVertices: true,
  desc: [
    "A honeycomb is a mass of hexagonal wax cells built by honeybees. In geometry, this is a hexagonal tiling or tessellation of the Euclidean plane, which provides the most efficient way to divide a surface into regions of equal area with minimum total perimeter.",
    "This structure is widely used in engineering and materials science due to its high strength-to-weight ratio and excellent crushing strength.",
  ],
  formulas: [
    { label: "Hexagon Area", eq: "A = \\frac{3\\sqrt{3}}{2} s^2" },
    { label: "Optimal Tiling", eq: "P/A \\text{ is minimized}" },
  ],
  generate: () => generateHoneycomb(3, 3, 0.2, 0.2),
};
