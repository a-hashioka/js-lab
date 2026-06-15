/**
 * js/shapes/tesseract.js
 * 構造の説明: 正八胞体
 */

/**
 * 4次元超立方体の頂点と面を生成します。
 * @returns {Object} {vertices4D, faces, vertices}
 */
export const tesseract = {
  title: "Tesseract",
  desc: [
    "The tesseract, also known as an 8-cell or regular octachoron, is the four-dimensional analogue of the 3D cube. It consists of 16 vertices, 32 edges, 24 square faces, and 8 cubic cells. In this viewer, it is represented via a perspective projection from 4D to 3D, allowing for the visualization of its internal structure and rotation in hyperspace.",
    "The concept of higher-dimensional polytopes was pioneered by Ludwig Schläfli in the mid-19th century. The term 'tesseract' was later coined by Charles Howard Hinton in 1888. It has since become a staple of science fiction and mathematical art as a way to contemplate the existence of a fourth spatial dimension.",
  ],
  formulas: [
    { label: "Vertices", eq: "(\\\\pm 1, \\\\pm 1, \\\\pm 1, \\\\pm 1)" },
    { label: "3D Projection", eq: "P(x, y, z, w) = \\\\frac{1}{d - w} (x, y, z)" },
    { label: "Topology", eq: "V=16, \\\\, E=32, \\\\, F=24, \\\\, \\\\text{Cells}=8" },
  ],
  is4D: true,
  generate: () => {
    const v4 = [];
    const s = 0.8;
    for (let i = 0; i < 16; i++)
      v4.push({
        x: (i & 1 ? 1 : -1) * s,
        y: (i & 2 ? 1 : -1) * s,
        z: (i & 4 ? 1 : -1) * s,
        w: (i & 8 ? 1 : -1) * s,
      });

    const faces = [];
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 4; j++) {
        const bit = 1 << j;
        if (!(i & bit)) {
          for (let k = j + 1; k < 4; k++) {
            const bit2 = 1 << k;
            if (!(i & bit2)) faces.push([i, i | bit, i | bit | bit2, i | bit2]);
          }
        }
      }
    }
    return { vertices4D: v4, faces, vertices: [] };
  },
};
