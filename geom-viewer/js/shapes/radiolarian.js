/**
 * js/shapes/radiolarian.js
 * Radiolarian Skeleton
 */

import { vec, normalize } from "../utils.js";
import { ICO_VERTICES, ICO_FACES } from "./icosahedron.js";

const generateRadiolarian = (subdivisions = 2, scale = 0.8) => {
  let geo = { vertices: ICO_VERTICES, faces: ICO_FACES };
  
  const subdivideWithHoles = (geometry) => {
    const { vertices, faces } = geometry;
    const nextFaces = [];
    const nextVertices = [...vertices];
    const cache = new Map();

    const getMid = (p1, p2) => {
      const key = p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`;
      if (cache.has(key)) return cache.get(key);
      const mid = normalize(vec.midpoint(nextVertices[p1], nextVertices[p2]));
      nextVertices.push(mid);
      cache.set(key, nextVertices.length - 1);
      return nextVertices.length - 1;
    };

    faces.forEach(([a, b, c]) => {
      const ab = getMid(a, b);
      const bc = getMid(b, c);
      const ca = getMid(c, a);
      // Create a "frame" by leaving out the center triangle
      nextFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc]);
    });
    return { vertices: nextVertices, faces: nextFaces };
  };

  for(let i=0; i<subdivisions; i++) {
    geo = subdivideWithHoles(geo);
  }

  return {
    vertices: geo.vertices.map(v => vec.mul(v, scale)),
    faces: geo.faces
  };
};

export const radiolarian = {
  title: "Radiolarian Skeleton",
  hideVertices: true,
  desc: [
    "Radiolaria are protozoa of 0.1–0.2 mm in size that produce intricate mineral skeletons, typically made of silica. Their skeletons exhibit a stunning variety of geometric forms, often resembling geodesic domes or polyhedral lattices.",
    "The structure is an evolutionary adaptation for a high strength-to-weight ratio and buoyancy. Ernst Haeckel's detailed illustrations of radiolarians in 'Kunstformen der Natur' (1904) influenced both art and architecture.",
  ],
  formulas: [
    { label: "Euler Characteristic", eq: "V - E + F = 2" },
    { label: "Geodesic Subdivision", eq: "f = n^2" },
  ],
  generate: () => generateRadiolarian(3, 0.8),
};
