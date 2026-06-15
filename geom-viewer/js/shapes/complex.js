/**
 * js/shapes/complex.js
 * Complex mathematical objects, fractals, and 4D projections.
 */

import { normalize, parametric } from "../utils.js";

export const complex = {
  dna: {
    title: "Double Helix (DNA)",
    desc: [
      "A simplified, iconic representation of the Deoxyribonucleic acid (DNA) molecule. This model emphasizes the elegant geometry of the double helix.",
      "The two sugar-phosphate backbones spiral in parallel, connected by nitrogenous base pairs that store the genetic code of all living organisms.",
      "This visualization balances scientific structure with artistic minimalism, using spheres to represent the critical junctions of the molecular chain.",
    ],
    formulas: [
      { label: "Helical Radius", eq: "r = 0.5" },
      { label: "Vertical Pitch", eq: "P = 2.0" },
      { label: "Base Pairs", eq: "\\text{A-T, C-G}" },
    ],
    generate: () => {
      const v = [],
        f = [],
        faceColors = [];
      const pointsPerStrand = 60;
      const radius = 0.15;
      const pitch = 0.2;
      const rotations = 3.0;

      for (let i = 0; i < pointsPerStrand; i++) {
        // t is the vertical progression and rotation angle
        const t = (i / pointsPerStrand) * Math.PI * 2 * rotations;
        const y = (i / pointsPerStrand - 0.5) * rotations * pitch * 4;

        for (let strand = 0; strand < 2; strand++) {
          const angle = t + strand * Math.PI; // Offset second strand by 180 degrees
          v.push({
            x: Math.cos(angle) * radius,
            y: y,
            z: Math.sin(angle) * radius,
          });

          if (i > 0) {
            const current = v.length - 1;
            const prev = current - 2;
            // Draw backbone segment as a "face" (technically a thick edge here)
            f.push([prev, current, current, prev]);
            const color =
              strand === 0
                ? "rgba(0, 255, 255, ALPHA)"
                : "rgba(0, 100, 255, ALPHA)";
            faceColors.push(color);
          }
        }

        // Rungs (Base pairs) connecting the two strands
        const idx1 = i * 2;
        const idx2 = i * 2 + 1;
        f.push([idx1, idx2, idx2, idx1]);
        faceColors.push("rgba(200, 200, 200, ALPHA)");
      }
      return { vertices: v, faces: f, faceColors };
    },
  },
  knot: {
    title: "Torus Knot",
    desc: [
      "A torus knot is a special kind of knot that lies on the surface of an unknotted torus in three-dimensional space.",
      "This model shows a (3,2) torus knot, which is topologically equivalent to the trefoil knot.",
    ],
    formulas: [
      {
        label: "Parametric Equations",
        eq: "\\begin{cases} x = (R + r\\cos q\\phi)\\cos p\\phi \\\\ y = (R + r\\cos q\\phi)\\sin p\\phi \\\\ z = r\\sin q\\phi \\end{cases}",
      },
    ],
    generate: () => {
      const v = [],
        f = [],
        segU = 150,
        segV = 8,
        rt = 0.1,
        p = 3,
        q = 2;

      for (let i = 0; i <= segU; i++) {
        const u = (i / segU) * Math.PI * 2;

        // Core curve of the knot
        const rk = 0.7 + 0.2 * Math.cos(q * u);
        const xk = rk * Math.cos(p * u),
          yk = rk * Math.sin(p * u),
          zk = 0.2 * Math.sin(q * u);

        // Frenet-Serret-like frame for tube extrusion
        const du = 0.01;
        const rN = 0.7 + 0.2 * Math.cos(q * (u + du));
        const T = normalize({
          x: rN * Math.cos(p * (u + du)) - xk,
          y: rN * Math.sin(p * (u + du)) - yk,
          z: 0.2 * Math.sin(q * (u + du)) - zk,
        });

        let N = normalize({ x: -T.y, y: T.x, z: 0 });
        if (!N.x && !N.y) N = { x: 0, y: 0, z: 1 };
        const B = {
          x: T.y * N.z - T.z * N.y,
          y: T.z * N.x - T.x * N.z,
          z: T.x * N.y - T.y * N.x,
        };

        // Create a ring (circle) perpendicular to the curve tangent
        for (let j = 0; j <= segV; j++) {
          const av = (j / segV) * Math.PI * 2;
          const cv = Math.cos(av),
            sv = Math.sin(av);
          v.push({
            x: xk + rt * (cv * N.x + sv * B.x),
            y: yk + rt * (cv * N.y + sv * B.y),
            z: zk + rt * (cv * N.z + sv * B.z),
          });

          if (i < segU && j < segV) {
            const a = i * (segV + 1) + j;
            const b = (i + 1) * (segV + 1) + j;
            const c = (i + 1) * (segV + 1) + j + 1;
            const d = i * (segV + 1) + j + 1;
            f.push([a, b, c, d]);
          }
        }
      }
      return { vertices: v, faces: f };
    },
  },
  super: {
    title: "Supershape",
    desc: [
      "The supershape equation is a generalization of the superellipse, capable of describing a vast range of complex symmetrical shapes found in nature.",
    ],
    formulas: [
      {
        label: "Gielis Formula",
        eq: "r(\\theta) = \\left[ \\left| \\frac{\\cos(\\frac{m\\theta}{4})}{a} \\right|^{n_2} + \\left| \\frac{\\sin(\\frac{m\\theta}{4})}{b} \\right|^{n_3} \\right]^{-\\frac{1}{n_1}}",
      },
    ],
    generate: () => {
      const m = 5,
        n1 = 1,
        n2 = 1,
        n3 = 1;

      // Superformula mapping
      const sf = (t) =>
        Math.pow(
          Math.pow(Math.abs(Math.cos((m * t) / 4)), n2) +
            Math.pow(Math.abs(Math.sin((m * t) / 4)), n3),
          -1 / n1,
        );

      return parametric(
        40,
        20,
        (lon, lat) => {
          const r1 = sf(lon),
            r2 = sf(lat);
          const s = 0.8;
          return {
            x: r1 * Math.cos(lon) * r2 * Math.cos(lat) * s,
            y: r1 * Math.sin(lon) * r2 * Math.cos(lat) * s,
            z: r2 * Math.sin(lat) * s,
          };
        },
        [-Math.PI / 2, Math.PI / 2],
        [-Math.PI, Math.PI],
      );
    },
  },
  calabi: {
    title: "Calabi-Yau",
    desc: [
      "A Calabi-Yau manifold is a special type of complex manifold that plays a central role in string theory.",
    ],
    formulas: [{ label: "Fermat Quintic", eq: "z_1^5 + z_2^5 = 1" }],
    generate: () => {
      const v = [],
        f = [],
        n = 5,
        steps = 10;
      const alpha = 0.5;

      // Fermat Quintic Surface Projection
      for (let k1 = 0; k1 < n; k1++) {
        for (let k2 = 0; k2 < n; k2++) {
          const offset = v.length;
          const res = parametric(
            steps,
            steps,
            (theta, phi) => {
              const r1 = Math.pow(Math.cos(phi), 2 / n);
              const r2 = Math.pow(Math.sin(phi), 2 / n);
              const arg1 = (theta + 2 * Math.PI * k1) / n;
              const arg2 = (theta + 2 * Math.PI * k2) / n;

              const z1_re = r1 * Math.cos(arg1),
                z1_im = r1 * Math.sin(arg1);
              const z2_re = r2 * Math.cos(arg2),
                z2_im = r2 * Math.sin(arg2);

              // Project 4 real dimensions to 3D
              const x = z1_re;
              const y = z2_re;
              const z = z1_im * Math.cos(alpha) + z2_im * Math.sin(alpha);

              const s = 0.8;
              return { x: x * s, y: y * s, z: z * s };
            },
            [0, Math.PI * 2],
            [0, Math.PI / 2],
          );
          res.faces.forEach((face) => f.push(face.map((i) => i + offset)));
          v.push(...res.vertices);
        }
      }
      return { vertices: v, faces: f };
    },
  },
  lorenz: {
    title: "Lorenz Attractor",
    desc: [
      "The Lorenz attractor is a set of chaotic solutions of the Lorenz system. It is one of the most famous examples of a strange attractor.",
    ],
    generate: (limit = 3000) => {
      const v = [];
      let x = 0.1,
        y = 0,
        z = 0;
      const dt = 0.01,
        sigma = 10,
        rho = 28,
        beta = 8 / 3;

      // Numerical integration (Runge-Kutta 1st order / Euler method)
      for (let i = 0; i < limit; i++) {
        const dx = sigma * (y - x) * dt,
          dy = (x * (rho - z) - y) * dt,
          dz = (x * y - beta * z) * dt;
        x += dx;
        y += dy;
        z += dz;
        v.push({ x: x * 0.025, y: y * 0.025, z: (z - 25) * 0.025 });
      }

      return {
        vertices: v,
        // Represent the path as connected segments
        faces: v.slice(0, -1).map((_, i) => [i, i + 1, i + 1, i]),
        hideVertices: true,
      };
    },
  },
  tesseract: {
    title: "Tesseract",
    desc: ["A tesseract is the four-dimensional analogue of a cube."],
    is4D: true,
    generate: () => {
      const v4 = [];
      const s = 0.8;
      // Generate 16 vertices of a 4D hypercube
      for (let i = 0; i < 16; i++)
        v4.push({
          x: (i & 1 ? 1 : -1) * s,
          y: (i & 2 ? 1 : -1) * s,
          z: (i & 4 ? 1 : -1) * s,
          w: (i & 8 ? 1 : -1) * s,
        });

      const faces = [];
      // Generate 2D square faces by connecting vertices differing in exactly 2 bits
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 4; j++) {
          const bit = 1 << j;
          if (!(i & bit)) {
            for (let k = j + 1; k < 4; k++) {
              const bit2 = 1 << k;
              if (!(i & bit2))
                faces.push([i, i | bit, i | bit | bit2, i | bit2]);
            }
          }
        }
      }
      return { vertices4D: v4, faces, vertices: [] };
    },
  },
};
