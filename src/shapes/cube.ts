import type { ShapeDefinition, Vector3, Geometry } from "../types";
/**
 * js/shapes/cube.js
 * 構造の説明: 立方体
 */

export const cube: ShapeDefinition = {
  id: "cube",
  title: "Cube",
  desc: [
    "The cube, or regular hexahedron, is a Platonic solid with six square faces, eight vertices, and twelve edges. It is a highly symmetric object belonging to the octahedral point group, where every face, edge, and vertex is geometrically equivalent, making it the most fundamental shape in Euclidean geometry and spatial tiling.",
    "In Plato's Timaeus, the cube was associated with the element of 'Earth' due to its stability and ability to tile space (tessellation). It is the dual of the regular octahedron; connecting the centers of its six faces yields a regular octahedron. It serves as the basis for the Cartesian coordinate system, representing the volume of three-dimensional space in its simplest form.",
  ],
  formulas: [
    { label: "Schläfli Symbol", eq: "\\{4, 3\\}" },
    { label: "Topology", eq: "V=8, E=12, F=6" },
    { label: "Euler Characteristic", eq: "\\chi = V - E + F = 2" },
    { label: "Dual", eq: "\\text{Octahedron}" },
    { label: "Symmetry", eq: "O_h" },
  ],
  /**
   * 立方体の頂点と面を生成します。
   * @returns {Geometry} {vertices, faces}
   */
  generate: (_counter: number): Geometry => {
    const v: Vector3[] = [];
    const s = 0.65;
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
