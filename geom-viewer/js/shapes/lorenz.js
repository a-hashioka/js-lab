/**
 * js/shapes/lorenz.js
 * 構造の説明: ローレンツ・アトラクタ
 */

/**
 * 数値積分を用いてローレンツ・アトラクタの軌跡を生成します。
 * @param {number} limit - 生成するポイントの数。
 * @returns {Object} {vertices, faces, hideVertices}
 */
export const lorenz = {
  title: "Lorenz Attractor",
  hideVertices: true,
  desc: [
    "The Lorenz attractor is a set of chaotic solutions of the Lorenz system. It is one of the most famous examples of a strange attractor.",
  ],
  generate: (limit = 3000) => {
    const v = [];
    let x = 0.1,
      y = 0,
      z = 0;
    const dt = 0.01,
      sigma = 10,
      rho = 28,
      beta = 8 / 3;

    for (let i = 0; i < limit; i++) {
      const dx = sigma * (y - x) * dt,
        dy = (x * (rho - z) - y) * dt,
        dz = (x * y - beta * z) * dt;
      x += dx;
      y += dy;
      z += dz;
      v.push({ x: x * 0.025, y: y * 0.025, z: (z - 25) * 0.025 });
    }

    return {
      vertices: v,
      faces: v.slice(0, -1).map((_, i) => [i, i + 1, i + 1, i]),
      hideVertices: true,
    };
  },
};
