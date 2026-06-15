/**
 * js/utils.js
 * Shared mathematical utilities for geometric generation.
 */

/**
 * Normalizes a 3D vector to unit length.
 */
export const normalize = (v) => {
  const l = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/**
 * Helper to generate a parametric surface.
 * Maps (u, v) domain to (x, y, z) coordinates and generates faces.
 *
 * @param {number} segU - Number of segments along U-axis.
 * @param {number} segV - Number of segments along V-axis.
 * @param {Function} func - Mapping function (u, v) => {x, y, z}.
 * @param {Array} uRange - [min, max] for U.
 * @param {Array} vRange - [min, max] for V.
 * @returns {Object} {vertices, faces}
 */
export const parametric = (
  segU,
  segV,
  func,
  uRange = [0, Math.PI * 2],
  vRange = [0, Math.PI * 2],
) => {
  const vertices = [];
  const faces = [];

  for (let i = 0; i <= segU; i++) {
    const u = uRange[0] + (i / segU) * (uRange[1] - uRange[0]);
    for (let j = 0; j <= segV; j++) {
      const v = vRange[0] + (j / segV) * (vRange[1] - vRange[0]);
      vertices.push(func(u, v));

      if (i < segU && j < segV) {
        const a = i * (segV + 1) + j;
        const b = (i + 1) * (segV + 1) + j;
        const c = (i + 1) * (segV + 1) + j + 1;
        const d = i * (segV + 1) + j + 1;
        faces.push([a, b, c, d]);
      }
    }
  }
  return { vertices, faces };
};
