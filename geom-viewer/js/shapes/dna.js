/**
 * js/shapes/dna.js
 * 構造の説明: Double Helix (DNA)
 */

/**
 * DNAの二重らせん構造の頂点と面を生成します。
 * @returns {Object} {vertices, faces, faceColors}
 */
export const dna = {
  title: "Double Helix (DNA)",
  desc: [
    "A simplified and symbolic representation of the Deoxyribonucleic Acid (DNA) molecule, highlighting the elegant geometric structure of the double helix.",
    "Two sugar-phosphate backbones spiral in parallel, connected by base pairs that hold the genetic information for all living organisms.",
    "This visualization balances scientific structure with artistic minimalism, using spheres to represent key connection points in the molecular chain.",
  ],
  formulas: [
    { label: "Helix Radius", eq: "r = 0.5" },
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
      const t = (i / pointsPerStrand) * Math.PI * 2 * rotations;
      const y = (i / pointsPerStrand - 0.5) * rotations * pitch * 4;

      for (let strand = 0; strand < 2; strand++) {
        const angle = t + strand * Math.PI;
        v.push({
          x: Math.cos(angle) * radius,
          y: y,
          z: Math.sin(angle) * radius,
        });

        if (i > 0) {
          const current = v.length - 1;
          const prev = current - 2;
          f.push([prev, current, current, prev]);
          const color =
            strand === 0
              ? "rgba(0, 255, 255, ALPHA)"
              : "rgba(0, 100, 255, ALPHA)";
          faceColors.push(color);
        }
      }

      const idx1 = i * 2;
      const idx2 = i * 2 + 1;
      f.push([idx1, idx2, idx2, idx1]);
      faceColors.push("rgba(200, 200, 200, ALPHA)");
    }
    return { vertices: v, faces: f, faceColors };
  },
};
