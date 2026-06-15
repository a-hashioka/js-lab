/**
 * js/shapes/nanotube.js
 * Carbon Nanotube
 */

import { parametric } from "../utils.js";

export const nanotube = {
  title: "Carbon Nanotube",
  desc: [
    "Carbon nanotubes (CNTs) are tubes made of carbon with diameters typically measured in nanometers. They are members of the fullerene structural family and consist of rolled-up sheets of single-layer carbon atoms (graphene).",
    "CNTs exhibit extraordinary mechanical strength and electrical properties. They can be either metallic or semiconducting depending on the 'chirality' or the angle at which the graphene sheet is rolled.",
  ],
  formulas: [
    { label: "Chiral Vector", eq: "\\mathbf{C}_h = n\\mathbf{a}_1 + m\\mathbf{a}_2" },
    { label: "Diameter", eq: "d = \\frac{a}{\\pi} \\sqrt{n^2 + nm + m^2}" },
  ],
  generate: () => {
    const radius = 0.5;
    const height = 2.0;
    return parametric(
      20, 40,
      (u, v) => {
        // Simple cylinder with a hexagonal-like perturbation to represent atoms
        const r = radius + 0.03 * Math.cos(10 * u) * Math.cos(10 * v);
        return {
          x: r * Math.cos(u),
          y: v - height / 2,
          z: r * Math.sin(u),
        };
      },
      [0, Math.PI * 2],
      [0, height]
    );
  },
};
