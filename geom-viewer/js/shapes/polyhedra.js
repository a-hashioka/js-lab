/**
 * js/shapes/polyhedra.js
 * Regular and semi-regular polyhedra with rich descriptions and formulas.
 */

import { normalize } from "../utils.js";

const phi = (1 + Math.sqrt(5)) / 2;

export const polyhedra = {
  tetrahedron: {
    title: "Tetrahedron",
    desc: [
      "The tetrahedron is the simplest of all the ordinary convex polyhedra and the only one that has four faces. It is the three-dimensional case of the concept of a Euclidean simplex.",
      "In nature, the tetrahedron is found in covalent bonds of molecules such as methane (CH4) and in the crystal structure of diamond.",
    ],
    formulas: [
      { label: "Volume", eq: "V = \\frac{a^3}{6\\sqrt{2}}" },
      { label: "Surface Area", eq: "S = \\sqrt{3}a^2" },
    ],
    generate: () => ({
      vertices: [
        { x: 1, y: 1, z: 1 },
        { x: 1, y: -1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
      ].map(normalize),
      faces: [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 1],
        [1, 3, 2],
      ],
    }),
  },
  cube: {
    title: "Cube",
    desc: [
      "A cube is a three-dimensional solid object bounded by six square faces. It is the only regular hexahedron and is one of the five Platonic solids.",
      "The cube has 6 faces, 12 edges, and 8 vertices. It is a highly symmetrical object, with octahedral symmetry.",
    ],
    formulas: [
      { label: "Volume", eq: "V = a^3" },
      { label: "Surface Area", eq: "S = 6a^2" },
    ],
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
  },
  octahedron: {
    title: "Octahedron",
    desc: [
      "An octahedron is a polyhedron with eight faces, twelve edges, and six vertices. A regular octahedron is composed of eight equilateral triangles.",
      "It is the dual polyhedron of the cube. It can be thought of as a square bipyramid.",
    ],
    formulas: [
      { label: "Volume", eq: "V = \\frac{\\sqrt{2}}{3}a^3" },
      { label: "Surface Area", eq: "S = 2\\sqrt{3}a^2" },
    ],
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
  },
  dodecahedron: {
    title: "Dodecahedron",
    desc: [
      "A dodecahedron is any polyhedron with twelve flat faces. The regular dodecahedron is composed of twelve regular pentagons.",
      "It is related to the golden ratio in many of its proportions and has 20 vertices and 30 edges.",
    ],
    formulas: [
      { label: "Golden Ratio", eq: "\\phi = \\frac{1 + \\sqrt{5}}{2}" },
      { label: "Volume", eq: "V = \\frac{15 + 7\\sqrt{5}}{4}a^3" },
    ],
    generate: () => {
      const v = [
        { x: 1, y: 1, z: 1 },
        { x: 1, y: 1, z: -1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: -1, z: -1 },
        { x: -1, y: 1, z: 1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: -1, y: -1, z: -1 },
        { x: 0, y: 1 / phi, z: phi },
        { x: 0, y: 1 / phi, z: -phi },
        { x: 0, y: -1 / phi, z: phi },
        { x: 0, y: -1 / phi, z: -phi },
        { x: 1 / phi, y: phi, z: 0 },
        { x: 1 / phi, y: -phi, z: 0 },
        { x: -1 / phi, y: phi, z: 0 },
        { x: -1 / phi, y: -phi, z: 0 },
        { x: phi, y: 0, z: 1 / phi },
        { x: phi, y: 0, z: -1 / phi },
        { x: -phi, y: 0, z: 1 / phi },
        { x: -phi, y: 0, z: -1 / phi },
      ].map(normalize);
      const faces = [
        [0, 8, 10, 2, 16],
        [0, 16, 17, 1, 12],
        [0, 12, 14, 4, 8],
        [8, 4, 18, 6, 10],
        [10, 6, 15, 13, 2],
        [2, 13, 3, 17, 16],
        [1, 17, 3, 11, 9],
        [1, 9, 5, 14, 12],
        [4, 14, 5, 19, 18],
        [6, 18, 19, 7, 15],
        [15, 7, 11, 3, 13],
        [7, 19, 5, 9, 11],
      ];
      return { vertices: v, faces };
    },
  },
  icosahedron: {
    title: "Icosahedron",
    desc: [
      "An icosahedron is a polyhedron with 20 triangular faces. It is the Platonic solid with the largest number of faces.",
      "It is commonly used to model viral capsids and in geodesic domes due to its high efficiency in covering a sphere.",
    ],
    formulas: [
      { label: "Volume", eq: "V = \\frac{5(3 + \\sqrt{5})}{12}a^3" },
      { label: "Surface Area", eq: "S = 5\\sqrt{3}a^2" },
    ],
    generate: () => {
      const v = [
        { x: -1, y: phi, z: 0 },
        { x: 1, y: phi, z: 0 },
        { x: -1, y: -phi, z: 0 },
        { x: 1, y: -phi, z: 0 },
        { x: 0, y: -1, z: phi },
        { x: 0, y: 1, z: phi },
        { x: 0, y: -1, z: -phi },
        { x: 0, y: 1, z: -phi },
        { x: phi, y: 0, z: -1 },
        { x: phi, y: 0, z: 1 },
        { x: -phi, y: 0, z: -1 },
        { x: -phi, y: 0, z: 1 },
      ].map(normalize);
      const faces = [
        [0, 11, 5],
        [0, 5, 1],
        [0, 1, 7],
        [0, 7, 10],
        [0, 10, 11],
        [1, 5, 9],
        [5, 11, 4],
        [11, 10, 2],
        [10, 7, 6],
        [7, 1, 8],
        [3, 9, 4],
        [3, 4, 2],
        [3, 2, 6],
        [3, 6, 8],
        [3, 8, 9],
        [4, 9, 5],
        [2, 4, 11],
        [6, 2, 10],
        [8, 6, 7],
        [9, 8, 1],
      ];
      return { vertices: v, faces };
    },
  },
  bucky: {
    title: "Buckyball (C60)",
    desc: [
      "Buckminsterfullerene (C60) is a molecule where 60 carbon atoms are arranged in a truncated icosahedron structure—the same geometry as a standard soccer ball.",
      "This shape is composed of 12 pentagonal and 20 hexagonal faces. Every vertex is identical, connecting two hexagons and one pentagon. It was the first fullerene molecule discovered, leading to the 1996 Nobel Prize in Chemistry.",
    ],
    formulas: [
      { label: "Vertices", eq: "V = 60" },
      { label: "Edges", eq: "E = 90" },
      { label: "Faces", eq: "F = 32" },
    ],
    generate: () => {
      const p = (1 + Math.sqrt(5)) / 2;
      const icoV = [
        { x: -1, y: p, z: 0 },
        { x: 1, y: p, z: 0 },
        { x: -1, y: -p, z: 0 },
        { x: 1, y: -p, z: 0 },
        { x: 0, y: -1, z: p },
        { x: 0, y: 1, z: p },
        { x: 0, y: -1, z: -p },
        { x: 0, y: 1, z: -p },
        { x: p, y: 0, z: -1 },
        { x: p, y: 0, z: 1 },
        { x: -p, y: 0, z: -1 },
        { x: -p, y: 0, z: 1 },
      ].map(normalize);
      const icoF = [
        [0, 11, 5],
        [0, 5, 1],
        [0, 1, 7],
        [0, 7, 10],
        [0, 10, 11],
        [1, 5, 9],
        [5, 11, 4],
        [11, 10, 2],
        [10, 7, 6],
        [7, 1, 8],
        [3, 9, 4],
        [3, 4, 2],
        [3, 2, 6],
        [3, 6, 8],
        [3, 8, 9],
        [4, 9, 5],
        [2, 4, 11],
        [6, 2, 10],
        [8, 6, 7],
        [9, 8, 1],
      ];

      const v = [];
      const edgeMap = new Map();
      icoF.forEach((face) => {
        for (let i = 0; i < 3; i++) {
          const i1 = face[i],
            i2 = face[(i + 1) % 3];
          const key = [i1, i2].sort().join("-");
          if (!edgeMap.has(key)) {
            const v1 = icoV[i1],
              v2 = icoV[i2];
            v.push({
              x: (2 * v1.x + v2.x) / 3,
              y: (2 * v1.y + v2.y) / 3,
              z: (2 * v1.z + v2.z) / 3,
            });
            v.push({
              x: (v1.x + 2 * v2.x) / 3,
              y: (v1.y + 2 * v2.y) / 3,
              z: (v1.z + 2 * v2.z) / 3,
            });
            edgeMap.set(key, { [i1]: v.length - 2, [i2]: v.length - 1 });
          }
        }
      });

      const f = [];
      icoF.forEach((face) => {
        const hex = [];
        for (let i = 0; i < 3; i++) {
          const i1 = face[i],
            i2 = face[(i + 1) % 3];
          const map = edgeMap.get([i1, i2].sort().join("-"));
          hex.push(map[i1], map[i2]);
        }
        f.push(hex);
      });

      for (let i = 0; i < 12; i++) {
        const pent = [];
        const sharedFaces = icoF.filter((face) => face.includes(i));
        let currentFace = sharedFaces[0];
        for (let k = 0; k < 5; k++) {
          const nextV = currentFace[(currentFace.indexOf(i) + 1) % 3];
          const map = edgeMap.get([i, nextV].sort().join("-"));
          pent.push(map[i]);
          currentFace = sharedFaces.find(
            (f) => f !== currentFace && f.includes(i) && f.includes(nextV),
          );
        }
        f.push(pent);
      }
      return { vertices: v.map(normalize), faces: f };
    },
  },
};
