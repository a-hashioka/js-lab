/**
 * js/shapes/calabi.js
 * 構造の説明: Calabi-Yau
 */

import { parametric } from "../utils.js";

/**
 * カラビ・ヤウ多様体（フェルマー五次曲面）の3次元投影を生成します。
 * @returns {Object} {vertices, faces}
 */
export const calabi = {
  title: "Calabi-Yau Manifold",
  desc: [
    "Calabi-Yau manifolds are special complex manifolds that play a central role in string theory.",
  ],
  formulas: [{ label: "Fermat Quintic", eq: "z_1^5 + z_2^5 = 1" }],
  generate: () => {
    const v = [],
      f = [],
      n = 5,
      steps = 10;
    const alpha = 0.5;

    for (let k1 = 0; k1 < n; k1++) {
      for (let k2 = 0; k2 < n; k2++) {
        const offset = v.length;
        const res = parametric(
          steps,
          steps,
          (theta, phi) => {
            const r1 = Math.pow(Math.cos(phi), 2 / n);
            const r2 = Math.pow(Math.sin(phi), 2 / n);
            const arg1 = (theta + 2 * Math.PI * k1) / n;
            const arg2 = (theta + 2 * Math.PI * k2) / n;

            const z1_re = r1 * Math.cos(arg1),
              z1_im = r1 * Math.sin(arg1);
            const z2_re = r2 * Math.cos(arg2),
              z2_im = r2 * Math.sin(arg2);

            const x = z1_re;
            const y = z2_re;
            const z = z1_im * Math.cos(alpha) + z2_im * Math.sin(alpha);

            const s = 0.8;
            return { x: x * s, y: y * s, z: z * s };
          },
          [0, Math.PI * 2],
          [0, Math.PI / 2],
        );
        res.faces.forEach((face) => f.push(face.map((i) => i + offset)));
        v.push(...res.vertices);
      }
    }
    return { vertices: v, faces: f };
  },
};
