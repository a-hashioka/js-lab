/**
 * js/shapes/sphere.js
 * 構造の説明: 球面
 */

import { subdivide, vec } from "../utils.js";
import { ICO_VERTICES, ICO_FACES } from "./icosahedron.js";

/**
 * 正二十面体を細分化して、アイコスフィア（正二十面体近似球）を生成します。
 * UV球よりも頂点分布が均一になります。
 *
 * @param {number} iterations - 細分化の回数。
 * @param {number} scale - 球の半径。
 * @returns {Object} 生成された {vertices, faces}。
 */
const icosphere = (iterations = 2, scale = 0.8) => {
  let geo = { vertices: ICO_VERTICES, faces: ICO_FACES };

  for (let i = 0; i < iterations; i++) {
    geo = subdivide(geo, true);
  }

  return {
    vertices: geo.vertices.map((v) => vec.mul(v, scale)),
    faces: geo.faces,
  };
};

export const sphere = {
  title: "Sphere",
  desc: [
    "A sphere is a set of all points in three-dimensional space that are at a given distance (the radius) from a center point. It is the most symmetrical 3D object and has constant positive Gaussian curvature.",
    "While a simple UV sphere concentrates resolution at the poles, this 'icosphere' is constructed by recursively subdividing an icosahedron. This yields a very uniform distribution of vertices and true 3D structural symmetry.",
  ],
  formulas: [
    { label: "Cartesian Equation", eq: "x^2 + y^2 + z^2 = r^2" },
    { label: "Volume", eq: "V = \\frac{4}{3}\\pi r^3" },
    { label: "Surface Area", eq: "A = 4\\pi r^2" },
    { label: "Gaussian Curvature", eq: "K = \\frac{1}{r^2}" },
  ],
  generate: () => icosphere(2, 0.8),
};
