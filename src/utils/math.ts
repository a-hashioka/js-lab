import type { Vector3, Geometry } from '../types';

export const normalize = (v: Vector3): Vector3 => {
  const l = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  if (l < 0.000001) return { x: 1, y: 0, z: 0 };
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

export const vec = {
  add: (v1: Vector3, v2: Vector3): Vector3 => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z }),
  sub: (v1: Vector3, v2: Vector3): Vector3 => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
  mul: (v: Vector3, s: number): Vector3 => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
  div: (v: Vector3, s: number): Vector3 => ({ x: v.x / s, y: v.y / s, z: v.z / s }),
  dot: (v1: Vector3, v2: Vector3): number => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z,
  cross: (v1: Vector3, v2: Vector3): Vector3 => ({
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  }),
  midpoint: (v1: Vector3, v2: Vector3): Vector3 => ({
    x: (v1.x + v2.x) / 2,
    y: (v1.y + v2.y) / 2,
    z: (v1.z + v2.z) / 2,
  }),
};

export const subdivide = (geometry: Geometry, shouldNormalize = false): Geometry => {
  const { vertices, faces } = geometry;
  const nextFaces: number[][] = [];
  const cache = new Map<string, number>();
  const nextVertices = [...vertices];

  const getMidpoint = (p1Idx: number, p2Idx: number): number => {
    const key = p1Idx < p2Idx ? `${p1Idx}-${p2Idx}` : `${p2Idx}-${p1Idx}`;
    if (cache.has(key)) return cache.get(key)!;

    let mid = vec.midpoint(nextVertices[p1Idx], nextVertices[p2Idx]);
    if (shouldNormalize) mid = normalize(mid);

    nextVertices.push(mid);
    const idx = nextVertices.length - 1;
    cache.set(key, idx);
    return idx;
  };

  faces.forEach((face) => {
    if (face.length !== 3) {
      nextFaces.push(face);
      return;
    }
    const [a, b, c] = face;
    const ab = getMidpoint(a, b);
    const bc = getMidpoint(b, c);
    const ca = getMidpoint(c, a);
    nextFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  });

  return { ...geometry, vertices: nextVertices, faces: nextFaces };
};

export const tube = (
  pathFunc: (t: number) => Vector3,
  segU: number,
  segV: number,
  radius: number,
  closed = false
): Geometry => {
  const vertices: Vector3[] = [];
  const faces: number[][] = [];
  const frames: { T: Vector3; B: Vector3; N: Vector3 }[] = [];

  const tangents: Vector3[] = [];
  for (let i = 0; i <= segU; i++) {
    const t = i / segU;
    const dt = 0.001;
    let T: Vector3;
    if (closed) {
      const pNext = pathFunc((t + dt) % 1);
      const pPrev = pathFunc((t - dt + 1) % 1);
      T = normalize(vec.sub(pNext, pPrev));
    } else {
      const pNext = pathFunc(Math.min(t + dt, 1));
      const pPrev = pathFunc(Math.max(t - dt, 0));
      T = normalize(vec.sub(pNext, pPrev));
    }
    tangents.push(T);
  }

  let T0 = tangents[0];
  let up = { x: 0, y: 1, z: 0 };
  if (Math.abs(T0.y) > 0.9) up = { x: 1, y: 0, z: 0 };
  let B0 = normalize(vec.cross(T0, up));
  let N0 = vec.cross(B0, T0);
  frames.push({ T: T0, B: B0, N: N0 });

  const rotate = (v: Vector3, a: Vector3, theta: number): Vector3 => {
    const cos = Math.cos(theta),
      sin = Math.sin(theta);
    return vec.add(
      vec.add(vec.mul(v, cos), vec.mul(vec.cross(a, v), sin)),
      vec.mul(a, vec.dot(a, v) * (1 - cos))
    );
  };

  for (let i = 1; i <= segU; i++) {
    const T_prev = tangents[i - 1];
    const T_curr = tangents[i];
    const axis = vec.cross(T_prev, T_curr);
    let B_curr: Vector3, N_curr: Vector3;

    if (vec.dot(axis, axis) < 0.000001) {
      B_curr = frames[i - 1].B;
      N_curr = frames[i - 1].N;
    } else {
      const axis_n = normalize(axis);
      const angle = Math.acos(Math.max(-1, Math.min(1, vec.dot(T_prev, T_curr))));
      B_curr = normalize(rotate(frames[i - 1].B, axis_n, angle));
      N_curr = vec.cross(B_curr, T_curr);
    }
    frames.push({ T: T_curr, B: B_curr, N: N_curr });
  }

  let twistOffset = 0;
  if (closed) {
    const B_start = frames[0].B;
    const B_end = frames[segU].B;
    const T_end = frames[segU].T;
    const cos = vec.dot(B_start, B_end);
    const sin = vec.dot(vec.cross(B_end, B_start), T_end);
    twistOffset = Math.atan2(sin, cos);
  }

  const numU = closed ? segU : segU + 1;
  const numV = segV;

  for (let i = 0; i < numU; i++) {
    const p = pathFunc(i / segU);
    let { B, N, T } = frames[i];

    if (closed && twistOffset !== 0) {
      const angle = (i / segU) * twistOffset;
      B = rotate(B, T, angle);
      N = rotate(N, T, angle);
    }

    for (let j = 0; j < numV; j++) {
      const v = (j / segV) * Math.PI * 2;
      const cv = Math.cos(v),
        sv = Math.sin(v);

      vertices.push({
        x: p.x + radius * (cv * N.x + sv * B.x),
        y: p.y + radius * (cv * N.y + sv * B.y),
        z: p.z + radius * (cv * N.z + sv * B.z),
      });
    }
  }

  for (let i = 0; i < segU; i++) {
    const i0 = i;
    const i1 = (i + 1) % (closed ? segU : segU + 1);

    for (let j = 0; j < segV; j++) {
      const j0 = j;
      const j1 = (j + 1) % segV;
      const a = i0 * numV + j0;
      const b = i1 * numV + j0;
      const c = i1 * numV + j1;
      const d = i0 * numV + j1;
      faces.push([a, b, c, d]);
    }
  }

  return { vertices, faces };
};

export const parametric = (
  segU: number,
  segV: number,
  func: (u: number, v: number) => Vector3,
  uRange: [number, number] = [0, Math.PI * 2],
  vRange: [number, number] = [0, Math.PI * 2]
): Geometry => {
  const vertices: Vector3[] = [];
  const faces: number[][] = [];

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
