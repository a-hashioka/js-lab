/**
 * js/shapes/octahedron.js
 * 構造の説明: 正八面体
 */

export const octahedron = {
  title: "Octahedron",
  desc: [
    "The octahedron is a polyhedron with 8 faces, 12 edges, and 6 vertices. A regular octahedron is composed of 8 equilateral triangles.",
    "It is the dual polyhedron of a cube and can be thought of as two square pyramids joined at their bases.",
  ],
  formulas: [
    { label: "Volume", eq: "V = \\frac{\\sqrt{2}}{3}a^3" },
    { label: "Surface Area", eq: "S = 2\\sqrt{3}a^2" },
  ],
  /**
   * 正八面体の頂点と面を生成します。
   * @returns {Object} {vertices, faces}
   */
  generate: () => ({
    vertices: [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ],
    faces: [
      [0, 2, 4],
      [0, 4, 3],
      [0, 3, 5],
      [0, 5, 2],
      [1, 2, 5],
      [1, 5, 3],
      [1, 3, 4],
      [1, 4, 2],
    ],
  }),
};
