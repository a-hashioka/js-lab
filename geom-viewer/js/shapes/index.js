/**
 * js/shapes/index.js
 * 階層的なカテゴリ分けを持つ、すべての幾何学的形状の中央レジストリ。
 */

import { tetrahedron } from "./tetrahedron.js";
import { cube } from "./cube.js";
import { octahedron } from "./octahedron.js";
import { dodecahedron } from "./dodecahedron.js";
import { icosahedron } from "./icosahedron.js";
import { bucky } from "./bucky.js";
import { sphere } from "./sphere.js";
import { torus } from "./torus.js";
import { mobius } from "./mobius.js";
import { klein } from "./klein.js";
import { boy } from "./boy.js";
import { hyper } from "./hyper.js";
import { dini } from "./dini.js";
import { enneper } from "./enneper.js";
import { roman } from "./roman.js";
import { kuen } from "./kuen.js";
import { catenoid } from "./catenoid.js";
import { dna } from "./dna.js";
import { knot } from "./knot.js";
import { superShape } from "./super.js";
import { calabi } from "./calabi.js";
import { lorenz } from "./lorenz.js";
import { tesseract } from "./tesseract.js";

// ギャラリー用の階層的なカテゴリを定義
export const disciplines = [
  {
    name: "Mathematics",
    theme: "math",
    desc: "The study of numbers, shapes, and patterns that form the foundation of logic.",
    groups: [
      {
        name: "Platonic Solids",
        desc: "Regular, convex polyhedra with identical faces made of regular polygons.",
        shapes: [
          "tetrahedron",
          "cube",
          "octahedron",
          "dodecahedron",
          "icosahedron",
        ],
      },
      {
        name: "Geometric Surfaces",
        desc: "Fundamental shapes and smooth surfaces found in classical geometry.",
        shapes: [
          "sphere",
          "torus",
          "hyper",
          "catenoid",
          "enneper",
          "dini",
          "kuen",
        ],
      },
      {
        name: "Topology and Higher Dimensions",
        desc: "Shapes that explore connectivity and dimensions beyond our everyday experience.",
        shapes: ["mobius", "klein", "boy", "roman", "knot", "tesseract"],
      },
    ],
  },
  {
    name: "Physics",
    theme: "physics",
    desc: "The science of matter, energy, and the fundamental forces of the universe.",
    groups: [
      {
        name: "Chaos Theory",
        desc: "Complex systems where small changes can lead to vastly different outcomes.",
        shapes: ["lorenz"],
      },
      {
        name: "Theoretical Physics",
        desc: "Mathematical models that attempt to explain the fundamental nature of reality.",
        shapes: ["calabi"],
      },
    ],
  },
  {
    name: "Chemistry",
    theme: "chemistry",
    desc: "The study of substances, their properties, and how they interact and change.",
    groups: [
      {
        name: "Molecular Structures",
        desc: "The arrangement of atoms in molecules and solids.",
        shapes: ["bucky"],
      },
    ],
  },
  {
    name: "Biology",
    theme: "biology",
    desc: "The study of living organisms and the vital processes that sustain life.",
    groups: [
      {
        name: "Genetics and Biological Forms",
        desc: "The geometric patterns found in DNA and organic growth.",
        shapes: ["dna", "super"],
      },
    ],
  },
];

// Flat registry for the viewer
export const shapes = {
  tetrahedron,
  cube,
  octahedron,
  dodecahedron,
  icosahedron,
  bucky,
  sphere,
  torus,
  mobius,
  klein,
  boy,
  hyper,
  dini,
  enneper,
  roman,
  kuen,
  catenoid,
  dna,
  knot,
  super: superShape,
  calabi,
  lorenz,
  tesseract,
};
