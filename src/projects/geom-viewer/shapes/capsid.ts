/**
 * js/shapes/capsid.js
 * Viral Capsid (Icosahedral T=3)
 */

import type { ShapeDefinition, Vector3 } from "../types";
import {  vec, normalize  } from "../utils/math";
import { ICO_VERTICES, ICO_FACES } from "./icosahedron";

const generateCapsid = (scale: number = 0.8) => {
  const vertices: Vector3[] = [];
  const faces: number[][] = [];
  const faceColors: string[] = [];

  const addCapsomere = (pos: Vector3, r: number, sides: number, color: string) => {
    const base = vertices.length;
    const normal = normalize(pos);
    
    // Find orthogonal basis for the capsomere plane
    let up: Vector3 = { x: 0, y: 1, z: 0 };
    if (Math.abs(normal.y) > 0.9) up = { x: 1, y: 0, z: 0 };
    const sideVec = normalize(vec.cross(normal, up));
    const upVec = vec.cross(sideVec, normal);

    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const cv = Math.cos(a) * r;
      const sv = Math.sin(a) * r;
      const offset = vec.add(vec.mul(sideVec, cv), vec.mul(upVec, sv));
      vertices.push(vec.add(pos, offset));
    }
    
    const face: number[] = [];
    for (let i = 0; i < sides; i++) face.push(base + i);
    faces.push(face);
    faceColors.push(color);
  };

  // 12 Pentamers at vertices
  ICO_VERTICES.forEach((v: Vector3) => {
    addCapsomere(vec.mul(v, scale), 0.12 * scale, 5, "rgba(255, 100, 100, ALPHA)");
  });

  // 20 Hexamers at face centers
  ICO_FACES.forEach((f: number[]) => {
    const v1 = ICO_VERTICES[f[0]];
    const v2 = ICO_VERTICES[f[1]];
    const v3 = ICO_VERTICES[f[2]];
    const center = vec.div(vec.add(vec.add(v1, v2), v3), 3);
    addCapsomere(vec.mul(normalize(center), scale), 0.12 * scale, 6, "rgba(100, 150, 255, ALPHA)");
  });

  return { vertices, faces, faceColors, hideVertices: true };
};

export const capsid: ShapeDefinition = {
  id: "capsid",
  title: "Viral Capsid",
  desc: [
    "A capsid is the protein shell of a virus, enclosing its genetic material. Most viruses have capsids with icosahedral symmetry, which is the most efficient way to form a closed shell from identical protein subunits.",
    "This model represents a T=3 icosahedral capsid, consisting of 12 pentameric capsomeres at the vertices and 20 hexameric capsomeres at the face centers, forming a total of 180 protein subunits.",
  ],
  formulas: [
    { label: "Triangulation Number", eq: "T = 3" },
    { label: "Subunit Count", eq: "N = 60T = 180" },
    { label: "Capsomeres", eq: "12 \\text{ pentamers} + 20 \\text{ hexamers}" },
  ],
  generate: () => generateCapsid(0.85),
};
