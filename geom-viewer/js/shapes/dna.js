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
    "The double helix is the geometric representation of Deoxyribonucleic acid (DNA), the molecule that carries genetic instructions for life. This structure consists of two congruent helices with the same axis, differing by a translation along the axis. It is a masterpiece of biological efficiency, allowing for dense packing and stable replication of genetic data.",
    "The structural model was famously elucidated by James Watson and Francis Crick in 1953, based on X-ray diffraction data from Rosalind Franklin and Maurice Wilkins. Geometrically, it represents a right-handed spiral where two sugar-phosphate backbones are connected by base-pair rungs (Adenine-Thymine and Cytosine-Guanine), illustrating the principle of complementarity.",
  ],
  formulas: [
    { label: "Parametric Helix", eq: "x = r\\\\cos t, \\\\, y = ht, \\\\, z = r\\\\sin t" },
    { label: "Parameters", eq: "r=0.15, \\\\, h \\\\approx 0.03, \\\\, \\\\text{rotations}=3.0" },
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
