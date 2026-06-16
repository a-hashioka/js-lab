import type { Vector3, Vector4, ProjectedPoint, Geometry } from '../types';

export const project4D = (vertices4D: Vector4[], angle: number): Vector3[] => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return vertices4D.map((v) => {
    const x = v.x * cos - v.w * sin;
    const w = v.w * cos + v.x * sin;
    const d = 2 / (3 + w);
    return { x: x * d, y: v.y * d, z: v.z * d };
  });
};

export const project = (
  v: Vector3,
  scale: number,
  rotX: number,
  rotY: number,
  rotZ: number,
  fov: number,
  viewDist: number,
  w: number,
  h: number
): ProjectedPoint => {
  if (!v) return { x: 0, y: 0, scale: 0 };

  const cosY = Math.cos(rotY),
    sinY = Math.sin(rotY);
  const y1 = v.y * cosY - v.z * sinY;
  const z1 = v.z * cosY + v.y * sinY;

  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX);
  const x2 = v.x * cosX - z1 * sinX;
  const z2 = z1 * cosX + v.x * sinX;

  const cosZ = Math.cos(rotZ),
    sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = y1 * cosZ + x2 * sinZ;

  const s = fov / (fov + z2 * scale + viewDist);

  return {
    x: w / 2 + x3 * scale * s,
    y: h / 2 + y3 * scale * s,
    scale: s,
  };
};

export const draw = (
  ctx: CanvasRenderingContext2D,
  data: Geometry,
  projected: ProjectedPoint[],
  w: number,
  h: number
) => {
  if (!ctx || !data || !projected) return;

  ctx.clearRect(0, 0, w, h);

  const faces = data.faces.map((face, index) => {
    let sumScale = 0;
    let validPoints = 0;

    face.forEach((idx) => {
      if (projected[idx]) {
        sumScale += projected[idx].scale;
        validPoints++;
      }
    });

    return {
      face,
      index,
      avgScale: validPoints > 0 ? sumScale / validPoints : 0,
      color: data.faceColors ? data.faceColors[index] : null,
      edgeColor: data.edgeColors ? data.edgeColors[index] : null,
      style: data.faceStyles ? data.faceStyles[index] : null,
    };
  });

  faces.sort((a, b) => a.avgScale - b.avgScale);

  faces.forEach(({ face, avgScale, color, edgeColor, style }) => {
    const alpha = Math.min(Math.max((avgScale - 0.25) * 2.5, 0.2), 0.9);

    if (style && style.composite) {
      ctx.globalCompositeOperation = style.composite;
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    if (color) {
      ctx.fillStyle = color.replace('ALPHA', (alpha * 0.9).toFixed(2));
    } else {
      ctx.fillStyle = `rgba(242, 242, 242, ${(alpha * 0.8).toFixed(2)})`;
    }

    if (edgeColor) {
      ctx.strokeStyle = edgeColor.replace('ALPHA', alpha.toFixed(2));
    } else {
      ctx.strokeStyle = `rgba(0, 0, 0, ${(alpha * 1.1).toFixed(2)})`;
    }

    ctx.lineWidth = Math.max(0.5, 1.0 * avgScale);

    let started = false;
    ctx.beginPath();
    for (let i = 0; i < face.length; i++) {
      const p = projected[face[i]];
      if (p) {
        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
    }

    if (started) {
      if (face.length > 2) {
        ctx.closePath();
        ctx.fill();
        if (!data.hideEdges) ctx.stroke();
      } else if (!data.hideEdges) {
        ctx.stroke();
      }
    }
  });

  ctx.globalCompositeOperation = 'source-over';

  if (data.glows) {
    data.glows.forEach((glow) => {
      const p = projected[glow.vertexIdx];
      if (!p || p.scale <= 0) return;

      const gradRadius = glow.radius * p.scale;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gradRadius);

      glow.stops.forEach((stop) => {
        gradient.addColorStop(stop.offset, stop.color);
      });

      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(p.x, p.y, gradRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  if (!data.hideVertices && projected.length < 1500) {
    const indices = data.nodeIndices || projected.map((_, i) => i);
    indices.forEach((idx) => {
      const p = projected[idx];
      if (!p) return;
      const a = Math.min(Math.max((p.scale - 0.25) * 2.5, 0), 0.95);
      if (a <= 0) return;
      ctx.fillStyle = `rgba(0, 0, 0, ${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }
};
