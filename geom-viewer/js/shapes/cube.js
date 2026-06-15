/**
 * js/shapes/cube.js
 * 構造の説明: 立方体
 */

export const cube = {
  title: "Cube",
  desc: [
    "A cube is a three-dimensional solid object bounded by six square faces. It is the only regular hexahedron and is one of the five Platonic solids.",
    "It has 12 edges and 8 vertices. It is a highly stable shape with octahedral symmetry.",
  ],
  formulas: [
    { label: "Volume", eq: "V = a^3" },
    { label: "Surface Area", eq: "S = 6a^2" },
  ],
  /**
   * 立方体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => {
    const v = [];
    const s = 1 / Math.sqrt(3);
    for (let i = 0; i < 8; i++)
      v.push({
        x: (i & 1 ? 1 : -1) * s,
        y: (i & 2 ? 1 : -1) * s,
        z: (i & 4 ? 1 : -1) * s,
      });
    return {
      vertices: v,
      faces: [
        [0, 1, 3, 2],
        [4, 5, 7, 6],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [0, 2, 6, 4],
        [1, 3, 7, 5],
      ],
    };
  },
};
