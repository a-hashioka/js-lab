/**
 * js/shapes/graphite.js
 * 構造の説明: グラファイト (Graphite)
 */

import { vec } from "../utils.js";

export const graphite = {
  title: "Graphite Structure",
  desc: [
    "A crystalline form of carbon with its atoms arranged in a hexagonal structure. It is the most stable form of carbon under standard conditions.",
    "Graphite consists of layers of graphene. While the bonds within the layers are very strong (covalent), the bonds between layers are weak (van der Waals), allowing them to slide over each other easily.",
  ],
  formulas: [
    { label: "Structure", eq: "\\text{Hexagonal planar sheets}" },
    { label: "Inter-layer distance", eq: "3.35 \\text{\\AA}" },
  ],
  generate: () => {
    const vertices = [];
    const faces = [];
    const layers = 3;
    const rows = 4;
    const cols = 4;
    const a = 0.2; // side length

    for (let l = 0; l < layers; l++) {
      const z = (l - (layers - 1) / 2) * 0.4;
      const offsetL = (l % 2) * (a * Math.cos(Math.PI / 6)); // AB stacking

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * 3 * a + (r % 2) * 1.5 * a + offsetL;
          const y = r * Math.sin(Math.PI / 3) * a;

          const cx = x - 1.5 * a * cols / 2;
          const cy = y - Math.sin(Math.PI / 3) * a * rows / 2;

          // Six points of a hexagon
          const vIdx = vertices.length;
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            vertices.push({
              x: cx + a * Math.cos(ang),
              y: cy + a * Math.sin(ang),
              z: z
            });
          }
          faces.push([vIdx, vIdx + 1, vIdx + 2, vIdx + 3, vIdx + 4, vIdx + 5]);
        }
      }
    }

    return { vertices, faces };
  }
};
