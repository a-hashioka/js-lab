/**
 * js/shapes/graphite.js
 * 構造の説明: グラファイト (Graphite)
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";

export const graphite: ShapeDefinition = {
  id: "graphite",
  title: "Graphite Structure",
  desc: [
    "A crystalline form of carbon with its atoms arranged in a hexagonal structure. It is the most stable form of carbon under standard conditions.",
    "Graphite consists of layers of graphene. While the bonds within the layers are very strong (covalent), the bonds between layers are weak (van der Waals), allowing them to slide over each other easily.",
  ],
  formulas: [
    { label: "Structure", eq: "\\text{Hexagonal planar sheets}" },
    { label: "Inter-layer distance", eq: "3.35 \\text{\\AA}" },
  ],
  generate: (_counter: number): Geometry => {
    const vertices: Vector3[] = [];
    const faces: number[][] = [];
    const layers = 3;
    const rows = 5;
    const cols = 5;
    const a = 0.2; // bond length (side of hexagon)
    const h = Math.sqrt(3) * a; // hexagon height

    for (let l = 0; l < layers; l++) {
      const z = (l - (layers - 1) / 2) * 0.6;
      // AB stacking shift: shift by one bond length 'a' in layer 1
      const offsetLX = (l % 2) * a;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Flat-top hexagonal tiling coordinates
          const x = c * 1.5 * a + offsetLX;
          const y = (r + (c % 2) * 0.5) * h;

          // Six points of a hexagon (Flat-top: 0, 60, 120...)
          const vIdx = vertices.length;
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            vertices.push({
              x: x + a * Math.cos(ang),
              y: y + a * Math.sin(ang),
              z: z
            });
          }
          faces.push([vIdx, vIdx + 1, vIdx + 2, vIdx + 3, vIdx + 4, vIdx + 5]);
        }
      }
    }

    // Centering
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    vertices.forEach(v => {
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
      minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z);
    });

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const cz = (minZ + maxZ) / 2;

    const centeredVertices: Vector3[] = vertices.map(v => ({
      x: v.x - cx,
      y: v.y - cy,
      z: v.z - cz
    }));

    return { vertices: centeredVertices, faces };
  }
};
