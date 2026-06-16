/**
 * js/shapes/sierpinski.js
 * Sierpinski Tetrahedron with gradual subdivision animation.
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  vec  } from "../utils/math";
import { TETRA_VERTICES } from "./tetrahedron.js";

/**
 * 線形補間
 */
const lerp = (a: Vector3, b: Vector3, s: number): Vector3 => ({
  x: a.x + (b.x - a.x) * s,
  y: a.y + (b.y - a.y) * s,
  z: a.z + (b.z - a.z) * s,
});

/**
 * フラクタルの特定の進行度における幾何学的データを生成します。
 * @param {number} t - 連続的な進行度 (0.0 から 5.0)。
 * @param {number} scale - 全体のスケーリング。
 * @returns {Geometry} {vertices, faces, faceColors, hideVertices}
 */
const generateSierpinski = (t: number, scale = 1.0): Geometry => {
  const maxT = 6.0;
  const t_capped = Math.min(t, maxT);

  const vertices: Vector3[] = [];
  const faces: number[][] = [];
  const faceColors: (string | null)[] = [];

  // 線形補間用の関数を外部に出すか、内部で定義
  const addLine = (p1: Vector3, p2: Vector3, p = 1.0) => {
    const mid = vec.midpoint(p1, p2);
    const end1 = lerp(p1, mid, p);
    const end2 = lerp(p2, mid, p);
    const base = vertices.length;
    vertices.push(p1, end1, p2, end2);
    faces.push([base, base + 1], [base + 2, base + 3]);
    faceColors.push("rgba(0, 0, 0, ALPHA)", "rgba(0, 0, 0, ALPHA)");
  };

  const addTetra = (v: Vector3[]) => {
    const base = vertices.length;
    vertices.push(...v);
    [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]].forEach((f) => {
      faces.push(f.map((i) => i + base));
      faceColors.push(null);
    });
  };

  // フェーズ0: 最初の正四面体の出現 (t: 0.0 - 1.0)
  if (t_capped < 1.0) {
    const tetra = TETRA_VERTICES.map((v) => vec.mul(v, scale));
    if (t_capped > 0.2 && t_capped < 0.8) {
      const lineP = (t_capped - 0.2) / 0.6;
      const [v1, v2, v3, v4] = tetra;
      const edges = [[v1, v2], [v1, v3], [v1, v4], [v2, v3], [v2, v4], [v3, v4]];
      edges.forEach(([p1, p2]) => addLine(p1, p2, lineP));
    } else if (t_capped >= 0.8) {
      addTetra(tetra);
    }
    return { vertices, faces, faceColors, hideVertices: true };
  }

  // 以降のフェーズ: 分割 (t: 1.0 - 6.0)
  const sub_t = t_capped - 1.0;
  const level = Math.floor(sub_t);
  const progress = sub_t % 1;
  const maxLevel = 5;

  // 現在の安定したレベルの四面体リストを取得
  let currentTetras = [TETRA_VERTICES.map((v) => vec.mul(v, scale))];
  for (let i = 0; i < level; i++) {
    const nextTetras: Vector3[][] = [];
    currentTetras.forEach((tetra) => {
      const [v1, v2, v3, v4] = tetra;
      const m12 = vec.midpoint(v1, v2);
      const m13 = vec.midpoint(v1, v3);
      const m14 = vec.midpoint(v1, v4);
      const m23 = vec.midpoint(v2, v3);
      const m24 = vec.midpoint(v2, v4);
      const m34 = vec.midpoint(v3, v4);
      nextTetras.push([v1, m12, m13, m14]);
      nextTetras.push([m12, v2, m23, m24]);
      nextTetras.push([m13, m23, v3, m34]);
      nextTetras.push([m14, m24, m34, v4]);
    });
    currentTetras = nextTetras;
  }

  // 安定状態、または最大レベル到達時
  if (level >= maxLevel || progress < 0.001) {
    currentTetras.forEach((tetra) => addTetra(tetra));
    return { vertices, faces, faceColors, hideVertices: true };
  } else {
    // 次のレベルへのアニメーション遷移
    currentTetras.forEach((tetra) => {
      const [v1, v2, v3, v4] = tetra;
      const m12 = vec.midpoint(v1, v2);
      const m13 = vec.midpoint(v1, v3);
      const m14 = vec.midpoint(v1, v4);
      const m23 = vec.midpoint(v2, v3);
      const m24 = vec.midpoint(v2, v4);
      const m34 = vec.midpoint(v3, v4);
      const allMids = [m12, m13, m14, m23, m24, m34];

      if (progress < 0.8) {
        addTetra(tetra); // 親の面を維持

        // 線分の伸長 (0.2 - 0.8)
        if (progress > 0.2) {
          const lineP = (progress - 0.2) / 0.6;
          const opposites = [[0, 5], [1, 4], [2, 3]]; 
          for (let i = 0; i < 6; i++) {
            for (let j = i + 1; j < 6; j++) {
              if (!opposites.some((pair) => (pair[0] === i && pair[1] === j) || (pair[0] === j && pair[1] === i))) {
                addLine(allMids[i], allMids[j], lineP);
              }
            }
          }
        }
      } else {
        // フェーズ3: 分割完了
        addTetra([v1, m12, m13, m14]);
        addTetra([m12, v2, m23, m24]);
        addTetra([m13, m23, v3, m34]);
        addTetra([m14, m24, m34, v4]);
      }
    });
    
    return { vertices, faces, faceColors, hideVertices: true };
  }
};

export const sierpinski: ShapeDefinition = {
  id: "sierpinski",
  title: "Sierpinski Tetrahedron",
  isDynamic: true,
  desc: [
    "The Sierpinski tetrahedron (or tetrix) is the 3D analogue of the Sierpinski triangle. It is formed by repeatedly replacing a tetrahedron with four smaller tetrahedra, each with half the side length of the original.",
    "In the limit as iterations approach infinity, the volume of the structure converges to zero, while its Hausdorff dimension is exactly 2. This mathematical object exists in 3D space but possesses the scaling properties of a 2D surface, serving as a classic example of a self-similar fractal limit set.",
  ],
  formulas: [
    { label: "Hausdorff Dimension", eq: "D = \\log_2(4) = 2" },
    { label: "Volume Limit", eq: "\\lim_{n \\to \\infty} V_n = 0" },
  ],
  generate: (counter: number = 0): Geometry => {
    const cycle = 600;
    const phase = (counter % cycle) / cycle;
    const t = phase < 0.5 ? phase * 2 * 5.0 : (1 - phase) * 2 * 5.0;
    return generateSierpinski(t, 1.0);
  },
};
