/**
 * js/shapes/index.js
 * Central registry for all geometric shapes with hierarchical categorization.
 */

import { polyhedra } from "./polyhedra.js";
import { surfaces } from "./surfaces.js";
import { complex } from "./complex.js";

// Define hierarchical categories for the gallery
export const disciplines = [
  {
    name: "I. Discrete Geometry & Polyhedral Theory",
    theme: "geometry",
    desc: "Study of discrete structures, convex polytopes, and their combinatorial properties.",
    groups: [
      {
        name: "Convex Regular Polyhedra",
        desc: "The fundamental Platonic solids defined by identical regular polygonal faces.",
        shapes: [
          "tetrahedron",
          "cube",
          "octahedron",
          "dodecahedron",
          "icosahedron",
        ],
      },
      {
        name: "Semi-regular & Discrete Structures",
        desc: "Archimedean solids and molecular geometries based on truncated structures.",
        shapes: ["bucky"],
      },
    ],
  },
  {
    name: "II. Differential Geometry & Variational Calculus",
    theme: "calculus",
    desc: "Analysis of smooth manifolds, curvature tensors, and area-minimizing surfaces.",
    groups: [
      {
        name: "Classical Surfaces of Revolution",
        desc: "Fundamental quadric surfaces and geometries with rotational symmetry.",
        shapes: ["sphere", "torus", "hyper"],
      },
      {
        name: "Minimal Surfaces",
        desc: "Surfaces with vanishing mean curvature, locally minimizing surface area.",
        shapes: ["catenoid", "enneper"],
      },
      {
        name: "Surfaces of Constant Curvature",
        desc: "Geometries exhibiting constant negative Gaussian curvature (pseudospherical surfaces).",
        shapes: ["dini", "kuen"],
      },
    ],
  },
  {
    name: "III. Topology & Knot Theory",
    theme: "topology",
    desc: "Investigation of properties preserved under continuous deformations and non-orientable manifolds.",
    groups: [
      {
        name: "Non-orientable Manifolds",
        desc: "Surfaces where a consistent normal vector cannot be globally defined.",
        shapes: ["mobius", "klein", "boy", "roman"],
      },
      {
        name: "Low-dimensional Topology",
        desc: "Study of embeddings, invariants, and entangled topological structures.",
        shapes: ["knot"],
      },
    ],
  },
  {
    name: "IV. Algebraic & Higher-Dimensional Geometry",
    theme: "algebraic",
    desc: "Exploration of complex manifolds and polytopes in higher-dimensional Euclidean space.",
    groups: [
      {
        name: "Higher-Dimensional Polytopes",
        desc: "Projections of 4D convex regular polychora into three-dimensional space.",
        shapes: ["tesseract"],
      },
      {
        name: "Complex Algebraic Manifolds",
        desc: "Ricci-flat manifolds and Fermat varieties arising in theoretical physics.",
        shapes: ["calabi"],
      },
    ],
  },
  {
    name: "V. Nonlinear Dynamics & Mathematical Biology",
    theme: "science",
    desc: "Geometric patterns emerging from chaotic systems and biological morphogenesis.",
    groups: [
      {
        name: "Chaotic Systems & Attractors",
        desc: "Non-linear dynamical systems exhibiting sensitive dependence on initial conditions.",
        shapes: ["lorenz"],
      },
      {
        name: "Geometric Morphogenesis",
        desc: "Mathematical models of organic structures and biological growth laws.",
        shapes: ["dna", "super"],
      },
    ],
  },
];

// Flat registry for the viewer
export const shapes = {
  ...polyhedra,
  ...surfaces,
  ...complex,
};
