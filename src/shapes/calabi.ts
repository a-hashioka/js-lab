/**
 * js/shapes/calabi.js
 * 構造の説明: カラビ・ヤウ多様体 (Calabi-Yau Manifold)
 */

import type { ShapeDefinition, Vector3 } from "../types";
import {  parametric  } from "../utils/math";

/**
 * カラビ・ヤウ多様体（フェルマー五次曲面）の3次元投影を生成します。
 * パラメータを動的に変化させることで、高次元空間での回転や折り畳みを可視化します。
 * @param {number} counter - アニメーション用のカウンター
 * @returns {Object} {vertices, faces}
 */
export const calabi: ShapeDefinition = {
  id: "calabi",
  title: "Calabi-Yau Manifold",
  isDynamic: true,
  hideVertices: true,
  desc: [
    "A Calabi-Yau manifold is a complex manifold that is Ricci-flat, hypothesized in string theory to form the compactified extra dimensions of our universe. This visualization shows a 3D projection of a quintic threefold—a 6-dimensional object (3 complex dimensions) embedded in a higher-dimensional space.",
    "The animation varies the projection parameters and complex phases over time. This simulates a rotation in 4D (or higher) complex space, revealing how the manifold 'folds' and 'unfolds' from our 3D perspective. Such transformations help visualize the non-trivial topology that determines the physical constants and particle types in multidimensional physics.",
    "Named after Eugenio Calabi and Shing-Tung Yau, these spaces are central to the study of mirror symmetry and algebraic geometry, representing one of the most complex intersections of math and theoretical physics.",
  ],
  formulas: [
    { label: "Fermat Quintic", eq: "\\sum_{i=1}^3 z_i^n = 1" },
    { label: "Projection", eq: "Z = \\text{Im}(z_1) \\cos\\alpha + \\text{Im}(z_2) \\sin\\alpha" },
    { label: "Euler Characteristic", eq: "\\chi = -200 \\text{ (for quintic)}" },
  ],
  generate: (counter: number = 0) => {
    const v: Vector3[] = [],
      f: number[][] = [],
      n = 5,
      steps = 10;
    
    // Animation parameters
    const t = counter * 0.02;
    const alpha = 0.5 + Math.sin(t * 0.5) * 0.5; // Oscillate projection angle
    const phaseShift = t * 0.3; // Rotate complex phases

    for (let k1 = 0; k1 < n; k1++) {
      for (let k2 = 0; k2 < n; k2++) {
        const offset = v.length;
        const res = parametric(
          steps,
          steps,
          (theta: number, phi: number) => {
            const r1 = Math.pow(Math.cos(phi), 2 / n);
            const r2 = Math.pow(Math.sin(phi), 2 / n);
            
            // Add phaseShift to simulate 4D rotation
            const arg1 = (theta + 2 * Math.PI * k1 + phaseShift) / n;
            const arg2 = (theta + 2 * Math.PI * k2 + phaseShift) / n;

            const z1_re = r1 * Math.cos(arg1),
              z1_im = r1 * Math.sin(arg1);
            const z2_re = r2 * Math.cos(arg2),
              z2_im = r2 * Math.sin(arg2);

            // Project to 3D space
            const x = z1_re;
            const y = z2_re;
            const z = z1_im * Math.cos(alpha) + z2_im * Math.sin(alpha);

            const s = 0.8;
            return { x: x * s, y: y * s, z: z * s };
          },
          [0, Math.PI * 2],
          [0, Math.PI / 2],
        );
        res.faces.forEach((face: number[]) => f.push(face.map((i) => i + offset)));
        v.push(...res.vertices);
      }
    }
    return { vertices: v, faces: f };
  },
};

