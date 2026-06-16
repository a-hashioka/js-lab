/**
 * js/shapes/bucky.js
 * 構造の説明: バッキーボール (C60)
 */

import type { ShapeDefinition, Vector3 } from "../types";
import {  normalize, vec  } from "../utils/math";
import { ICO_VERTICES, ICO_FACES } from "./icosahedron";

export const bucky: ShapeDefinition = {
  id: "bucky",
  title: "Buckyball (C60)",
  desc: [
    "Buckminsterfullerene (C60) is the most iconic member of the fullerene family, discovered in 1985 by Harold Kroto, Robert Curl, and Richard Smalley—a feat for which they were awarded the 1996 Nobel Prize in Chemistry. It consists of 60 carbon atoms arranged in a truncated icosahedron, creating a highly symmetrical, cage-like molecule often referred to as a 'buckyball'.",
    "Chemically, the C60 molecule features carbon atoms with $sp^2$-like hybridization, though the curvature of the sphere introduces significant pyramidalization and ring strain. This strain makes the molecule more reactive than planar graphite, often acting as an electron-deficient alkene. The structure is composed of two distinct bond types: [6,6]-junctions (shorter double bonds between two hexagons) and [5,6]-junctions (longer single bonds between a pentagon and a hexagon).",
    "C60 represents a bridge between bulk materials and discrete molecules, showing extraordinary properties such as superconductivity when doped with alkali metals and the ability to trap smaller atoms or molecules inside its interior cavity (endohedral fullerenes). It remains a cornerstone of nanotechnology, medicinal chemistry, and material science.",
  ],
  formulas: [
    { label: "Chemical Formula", eq: "C_{60}" },
    { label: "Hybridization", eq: "sp^{2.27} \\text{ (curved } sp^2)" },
    { label: "Bond Lengths", eq: "d_{6,6} \\approx 1.40\\text{Å}, \\, d_{5,6} \\approx 1.45\\text{Å}" },
    { label: "Molecular Point Group", eq: "I_h \\text{ (Icosahedral)}" },
    { label: "Topology", eq: "F = n/2 + 2 \\implies 12 \\text{ pentagons mandatory}" },
  ],
  /**
   * バッキーボール（切頂二十面体）の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => {
    const v: Vector3[] = [];
    const edgeMap = new Map<string, Record<number, number>>();

    ICO_FACES.forEach((face: number[]) => {
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

    const f: number[][] = [];
    ICO_FACES.forEach((face: number[]) => {
      const hex: number[] = [];
      for (let i = 0; i < 3; i++) {
        const i1 = face[i],
          i2 = face[(i + 1) % 3];
        const map = edgeMap.get([i1, i2].sort().join("-"))!;
        hex.push(map[i1], map[i2]);
      }
      f.push(hex);
    });

    for (let i = 0; i < 12; i++) {
      const pent: number[] = [];
      const sharedFaces = ICO_FACES.filter((face: number[]) => face.includes(i));
      let currentFace: number[] | undefined = sharedFaces[0];
      for (let k = 0; k < 5; k++) {
        if (!currentFace) break;
        const nextV: number = currentFace[(currentFace.indexOf(i) + 1) % 3];
        const map = edgeMap.get([i, nextV].sort().join("-"))!;
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
