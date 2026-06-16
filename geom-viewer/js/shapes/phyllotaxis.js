/**
 * js/shapes/phyllotaxis.js
 * 構造の説明: 葉序螺旋 (Phyllotaxis Spiral)
 */

import { vec } from "../utils.js";

export const phyllotaxis = {
  title: "Phyllotaxis Spiral",
  isDynamic: true,
  desc: [
    "Phyllotaxis describes the arrangement of leaves, seeds, or florets in plants, a phenomenon that has fascinated mathematicians since the 19th century. The most common pattern is the spiral phyllotaxis, which follows Fermat's spiral and is governed by the golden angle (~137.5°).",
    "This arrangement, formalized in Vogel's model (1979), ensures the most efficient packing of organs, minimizing overlap and maximizing exposure to sunlight or nutrient distribution. The resulting spirals (parastichies) appearing in the pattern are almost always consecutive Fibonacci numbers, such as 21, 34, 55, or 89.",
    "The golden angle (360° / φ²) is an irrational number derived from the golden ratio. Because it never completes a simple fractional turn, it prevents seeds from aligning in radial lines, creating a perfectly distributed, self-similar fractal structure found in sunflowers, pinecones, and succulents.",
  ],
  formulas: [
    { label: "Golden Angle", eq: "\\psi = 2\\pi(1 - 1/\\phi) \\approx 137.508^\\circ" },
    { label: "Vogel's Model", eq: "r = c\\sqrt{n}, \\theta = n\\psi" },
    { label: "Fibonacci Limit", eq: "\\lim_{k \\to \\infty} \\frac{F_k}{F_{k-1}} = \\phi" },
  ],
  generate: (counter = 0) => {
    const vertices = [];
    const faces = [];
    const faceColors = [];

    const maxN = 500;
    const cycle = 600;
    const phase = (counter % cycle) / cycle;
    
    // Growth animation: 
    // 0.0 - 0.7: Growing count and radius
    // 0.7 - 0.9: Stationary
    // 0.9 - 1.0: Reset (fade/shrink not implemented but handled by loop)
    let currentN, scale;
    if (phase < 0.7) {
      const t = phase / 0.7;
      currentN = Math.floor(t * maxN);
      scale = 1.0;
    } else {
      currentN = maxN;
      scale = 1.0;
    }

    const c = 0.04;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < currentN; i++) {
      const r = c * Math.sqrt(i) * scale;
      const theta = i * goldenAngle;
      const cx = r * Math.cos(theta);
      const cy = r * Math.sin(theta);
      // Slight dome shape (like a sunflower)
      const cz = - (r * r) * 0.2 + (i / maxN) * 0.05;

      const vIdx = vertices.length;
      const s = 0.012;
      
      // Each seed is a small pyramid
      vertices.push({ x: cx, y: cy, z: cz + s });
      vertices.push({ x: cx + s, y: cy + s, z: cz });
      vertices.push({ x: cx - s, y: cy + s, z: cz });
      vertices.push({ x: cx - s, y: cy - s, z: cz });
      vertices.push({ x: cx + s, y: cy - s, z: cz });

      // 4 faces for the pyramid
      faces.push(
        [vIdx, vIdx + 1, vIdx + 2], 
        [vIdx, vIdx + 2, vIdx + 3], 
        [vIdx, vIdx + 3, vIdx + 4], 
        [vIdx, vIdx + 4, vIdx + 1]
      );

      // Color coding: use HSL to highlight the spiral patterns
      // The angle-based hue naturally makes the parastichies visible
      const hue = (i * 137.508) % 360;
      const color = `hsl(${hue}, 70%, 60%)`;
      for(let j = 0; j < 4; j++) faceColors.push(color);
    }

    return { 
      vertices, 
      faces, 
      faceColors,
      hideVertices: true 
    };
  }
};

