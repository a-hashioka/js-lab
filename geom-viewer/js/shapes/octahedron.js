/**
 * js/shapes/octahedron.js
 * 構造の説明: 正八面体
 */

export const octahedron = {
  title: "Octahedron",
  desc: [
    "The regular octahedron is a Platonic solid with 8 equilateral triangular faces, 12 edges, and 6 vertices. It exhibits octahedral symmetry (O_h) and is the dual polyhedron of the cube. It can be viewed as a rectified tetrahedron or a square bipyramid. Its vertices are located at the permutations of (\pm 1, 0, 0).",
    "Known since antiquity, it was described by Plato in the 'Timaeus' as representing the element of Air. In crystallography, it is a common form for various minerals, such as diamond and fluorite, due to their cubic crystal systems.",
  ],
  formulas: [
    { label: "Topology", eq: "V=6, E=12, F=8" },
    { label: "Implicit", eq: "|x| + |y| + |z| = 1" },
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
