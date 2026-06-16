/**
 * js/shapes/diamond.js
 * Diamond Structure (Expanded Node-Edge View)
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  vec  } from "../utils/math";

const generateDiamond = (cells = 3, scale = 0.3): Geometry => {
  const vertices: Vector3[] = [];
  const faces: number[][] = [];
  const vertexMap = new Map<string, number>();
  const offset = (cells - 1) / 2;

  const getIdx = (p: Vector3) => {
    const key = `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}`;
    if (vertexMap.has(key)) return vertexMap.get(key)!;
    vertices.push(p);
    const idx = vertices.length - 1;
    vertexMap.set(key, idx);
    return idx;
  };

  // Generate Diamond Lattice: Two interpenetrating FCC lattices
  const baseFCC = [
    { x: 0, y: 0, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
    { x: 0.5, y: 0, z: 0.5 },
    { x: 0, y: 0.5, z: 0.5 }
  ];

  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      for (let k = 0; k < cells; k++) {
        baseFCC.forEach(p => {
          // Lattice 1
          const p1 = { x: i + p.x - offset, y: j + p.y - offset, z: k + p.z - offset };
          getIdx(vec.mul(p1, scale * 2.5));

          // Lattice 2 (Basis offset)
          const p2 = { x: p1.x + 0.25, y: p1.y + 0.25, z: p1.z + 0.25 };
          getIdx(vec.mul(p2, scale * 2.5));
        });
      }
    }
  }

  // Draw bonds between nearest neighbors
  // Ideal bond length in this coordinate system is sqrt(3)/4
  const targetDistSq = Math.pow((Math.sqrt(3) / 4) * scale * 2.5, 2);

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const d = vec.sub(vertices[i], vertices[j]);
      const distSq = vec.dot(d, d);
      if (Math.abs(distSq - targetDistSq) < 0.001) {
        faces.push([i, j]);
      }
    }
  }

  return { vertices, faces, hideVertices: false };
};

export const diamond: ShapeDefinition = {
  id: "diamond",
  title: "Diamond Structure",
  desc: [
    "Diamond is a solid form of the element carbon with its atoms arranged in a crystal structure called diamond cubic. In this structure, each carbon atom is covalently bonded to four other carbon atoms in a perfect tetrahedron.",
    "This visualization shows an extensive 4x4x4 unit cell block, providing a wide-range view of the crystalline lattice. The repeating tetrahedral arrangement across hundreds of atoms illustrates the long-range order that defines diamond's physical properties.",
  ],
  formulas: [
    { label: "Lattice Type", eq: "Diamond Cubic (FCC + Basis)" },
    { label: "Coordination Number", eq: "4 (Tetrahedral)" },
    { label: "Structure", eq: "4x4x4 Unit Cells" },
  ],
  generate: (_counter: number): Geometry => generateDiamond(4, 0.15),
};
