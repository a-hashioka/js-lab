/**
 * js/shapes/bucky.js
 * 構造の説明: バッキーボール (C60)
 */

import { normalize, vec } from "../utils.js";
import { ICO_VERTICES, ICO_FACES } from "./icosahedron.js";

export const bucky = {
  title: "Buckyball (C60)",
  desc: [
    "The Buckyball, or truncated icosahedron, is an Archimedean solid consisting of 12 pentagonal and 20 hexagonal faces. It gained worldwide fame as the molecular structure of Buckminsterfullerene (C60), where carbon atoms occupy the 60 vertices of the polyhedron, forming a stable, cage-like architecture.",
    "This geometry is named after R. Buckminster Fuller, whose geodesic domes share similar structural principles. It is the standard shape of a soccer ball and is central to the field of nanotechnology and carbon science, where it represents a bridge between discrete mathematics and physical chemistry.",
  ],
  formulas: [
    { label: "Topology", eq: "V=60, \\, E=90, \\, F=32 \\text{ (12 pentagons, 20 hexagons)}" },
    { label: "Euler Characteristic", eq: "\\chi = V - E + F = 2" },
  ],
  /**
   * バッキーボール（切頂二十面体）の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => {
    const v = [];
    const edgeMap = new Map();

    ICO_FACES.forEach((face) => {
      for (let i = 0; i < 3; i++) {
        const i1 = face[i],
          i2 = face[(i + 1) % 3];
        const key = [i1, i2].sort().join("-");
        if (!edgeMap.has(key)) {
          const v1 = ICO_VERTICES[i1],
            v2 = ICO_VERTICES[i2];

          // 頂点を1/3と2/3の地点に配置（切頂）
          v.push(vec.add(vec.mul(v1, 2 / 3), vec.mul(v2, 1 / 3)));
          v.push(vec.add(vec.mul(v1, 1 / 3), vec.mul(v2, 2 / 3)));

          edgeMap.set(key, { [i1]: v.length - 2, [i2]: v.length - 1 });
        }
      }
    });

    const f = [];
    ICO_FACES.forEach((face) => {
      const hex = [];
      for (let i = 0; i < 3; i++) {
        const i1 = face[i],
          i2 = face[(i + 1) % 3];
        const map = edgeMap.get([i1, i2].sort().join("-"));
        hex.push(map[i1], map[i2]);
      }
      f.push(hex);
    });

    for (let i = 0; i < 12; i++) {
      const pent = [];
      const sharedFaces = ICO_FACES.filter((face) => face.includes(i));
      let currentFace = sharedFaces[0];
      for (let k = 0; k < 5; k++) {
        const nextV = currentFace[(currentFace.indexOf(i) + 1) % 3];
        const map = edgeMap.get([i, nextV].sort().join("-"));
        pent.push(map[i]);
        currentFace = sharedFaces.find(
          (f) => f !== currentFace && f.includes(i) && f.includes(nextV),
        );
      }
      f.push(pent);
    }
    return { vertices: v.map(normalize), faces: f };
  },
};
