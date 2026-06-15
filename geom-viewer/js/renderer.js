/**
 * js/renderer.js
 * Optimized 3D to 2D projection and Canvas rendering engine.
 */

/**
 * Projects a 3D vertex to 2D screen coordinates using perspective projection.
 *
 * @param {Object} v - The 3D vertex {x, y, z}.
 * @param {number} scale - Global scaling factor.
 * @param {number} rotX - Rotation around X-axis (radians).
 * @param {number} rotY - Rotation around Y-axis (radians).
 * @param {number} rotZ - Rotation around Z-axis (radians).
 * @param {number} fov - Field of view (focal length).
 * @param {number} viewDist - Distance from the viewer to the object.
 * @param {number} w - Canvas width.
 * @param {number} h - Canvas height.
 * @returns {Object} {x, y, scale} Screen coordinates and depth-based scale factor.
 */
export const project = (v, scale, rotX, rotY, rotZ, fov, viewDist, w, h) => {
  // Rotate around Y-axis
  const cosY = Math.cos(rotY),
    sinY = Math.sin(rotY);
  const y1 = v.y * cosY - v.z * sinY;
  const z1 = v.z * cosY + v.y * sinY;

  // Rotate around X-axis
  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX);
  const x2 = v.x * cosX - z1 * sinX;
  const z2 = z1 * cosX + v.x * sinX;

  // Rotate around Z-axis
  const cosZ = Math.cos(rotZ),
    sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = y1 * cosZ + x2 * sinZ;

  // Perspective projection
  const s = fov / (fov + z2 * scale + viewDist);

  return {
    x: w / 2 + x3 * scale * s,
    y: h / 2 + y3 * scale * s,
    scale: s,
  };
};

/**
 * Renders the projected geometric data onto the canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Object} data - The shape data (vertices, faces, etc.).
 * @param {Array} projected - Array of projected screen coordinates.
 * @param {number} w - Canvas width.
 * @param {number} h - Canvas height.
 */
export const draw = (ctx, data, projected, w, h) => {
  ctx.clearRect(0, 0, w, h);

  // 1. Prepare and sort faces by depth (Z-sorting for painter's algorithm)
  const faces = data.faces.map((face, index) => {
    let sumScale = 0;
    face.forEach(
      (idx) => (sumScale += projected[idx] ? projected[idx].scale : 0),
    );

    return {
      face,
      avgScale: sumScale / face.length,
      color: data.faceColors ? data.faceColors[index] : null,
    };
  });

  // Sort back-to-front
  faces.sort((a, b) => a.avgScale - b.avgScale);

  // 2. Render faces
  faces.forEach(({ face, avgScale, color }) => {
    // Calculate adaptive alpha based on distance/scale
    const alpha = Math.min(Math.max((avgScale - 0.3) * 2.0, 0.1), 0.85);

    if (color) {
      ctx.fillStyle = color.replace("ALPHA", (alpha * 0.9).toFixed(2));
    } else {
      ctx.fillStyle = `rgba(248, 248, 248, ${(alpha * 0.8).toFixed(2)})`;
    }

    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.0 * avgScale;

    // Draw path
    if (projected[face[0]]) {
      ctx.beginPath();
      ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
      for (let i = 1; i < face.length; i++) {
        const p = projected[face[i]];
        if (p) ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  });

  // 3. Render vertices (Nodes) as small dots
  if (!data.hideVertices && projected.length < 1500) {
    projected.forEach((p) => {
      const a = Math.min(Math.max((p.scale - 0.3) * 2.0, 0), 0.9);
      if (a <= 0) return;

      ctx.fillStyle = `rgba(0, 0, 0, ${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.0 * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }
};
