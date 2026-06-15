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
  desc: ["A tesseract is the four-dimensional analogue of a cube."],
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
