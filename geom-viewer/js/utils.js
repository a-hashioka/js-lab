/**
 * js/utils.js
 * 幾何学的な形状生成に使用される数学的ユーティリティ関数。
 * ベクトル演算、メッシュ細分化、および曲面生成アルゴリズムを提供します。
 */

/**
 * 3Dベクトルを正規化して単位ベクトルにします。
 * 零ベクトルの場合は {x: 1, y: 0, z: 0} を返します（安全策）。
 *
 * @param {Object} v - 正規化する3Dベクトル {x, y, z}
 * @returns {Object} 正規化された3Dベクトル {x, y, z}
 */
export const normalize = (v) => {
  const l = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  if (l < 0.000001) return { x: 1, y: 0, z: 0 };
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/**
 * ベクトルの基本演算（加算、減算、乗算、除算、内積、外積、中点）。
 */
export const vec = {
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z }),
  sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
  mul: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
  div: (v, s) => ({ x: v.x / s, y: v.y / s, z: v.z / s }),
  dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z,
  cross: (v1, v2) => ({
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  }),
  midpoint: (v1, v2) => ({
    x: (v1.x + v2.x) / 2,
    y: (v1.y + v2.y) / 2,
    z: (v1.z + v2.z) / 2,
  }),
};

/**
 * メッシュを細分化（サブディビジョン）します。
 * 各三角形の面を4つの小さな三角形に分割します。
 * 共有頂点をキャッシュすることで、頂点の重複を防止します。
 *
 * @param {Object} geometry - 入力メッシュ {vertices, faces}
 * @param {boolean} shouldNormalize - 新しい頂点を正規化するかどうか（球体生成用）
 * @returns {Object} 細分化された {vertices, faces}
 */
export const subdivide = (geometry, shouldNormalize = false) => {
  const { vertices, faces } = geometry;
  const nextFaces = [];
  const cache = new Map();
  const nextVertices = [...vertices];

  /** 中点のインデックスを取得、未生成なら生成 */
  const getMidpoint = (p1Idx, p2Idx) => {
    const key = p1Idx < p2Idx ? `${p1Idx}-${p2Idx}` : `${p2Idx}-${p1Idx}`;
    if (cache.has(key)) return cache.get(key);

    let mid = vec.midpoint(nextVertices[p1Idx], nextVertices[p2Idx]);
    if (shouldNormalize) mid = normalize(mid);

    nextVertices.push(mid);
    const idx = nextVertices.length - 1;
    cache.set(key, idx);
    return idx;
  };

  faces.forEach((face) => {
    if (face.length !== 3) {
      // 三角形以外は現在はサポートしない（そのまま通す）
      nextFaces.push(face);
      return;
    }
    const [a, b, c] = face;
    const ab = getMidpoint(a, b);
    const bc = getMidpoint(b, c);
    const ca = getMidpoint(c, a);
    nextFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  });

  return { vertices: nextVertices, faces: nextFaces };
};

/**
 * パス（曲線）に沿って管状のメッシュ（チューブ）を生成します。
 * 並行移動標構（Bishop Frame / Parallel Transport Frame）を使用して、急激な曲がりでもねじれを最小限に抑えます。
 * 閉じたパスの場合は、始点と終点のねじれの差（ホロノミー）を全セグメントに均等に分散させます。
 *
 * @param {Function} pathFunc - パス上の点(t)を返す関数。tは0から1。
 * @param {number} segU - パス方向（長さ方向）の分割数。
 * @param {number} segV - 断面（円周方向）の分割数。
 * @param {number} radius - チューブの半径。
 * @param {boolean} closed - パスが閉じているかどうか。
 * @returns {Object} 生成された {vertices, faces}。
 */
export const tube = (pathFunc, segU, segV, radius, closed = false) => {
  const vertices = [];
  const faces = [];
  const frames = [];

  // 1. 各ポイントでの接線(Tangent)を計算
  const tangents = [];
  for (let i = 0; i <= segU; i++) {
    const t = i / segU;
    const dt = 0.001;
    let T;
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

  // 2. 並行移動標構を構築 (Bishop Frame)
  // 初期フレームの設定
  let T0 = tangents[0];
  let up = { x: 0, y: 1, z: 0 };
  if (Math.abs(T0.y) > 0.9) up = { x: 1, y: 0, z: 0 };
  let B0 = normalize(vec.cross(T0, up));
  let N0 = vec.cross(B0, T0);
  frames.push({ T: T0, B: B0, N: N0 });

  /** ロドリゲスの回転公式を使用してベクトルを回転 */
  const rotate = (v, a, theta) => {
    const cos = Math.cos(theta), sin = Math.sin(theta);
    return vec.add(
      vec.add(vec.mul(v, cos), vec.mul(vec.cross(a, v), sin)),
      vec.mul(a, vec.dot(a, v) * (1 - cos))
    );
  };

  // 前のフレームを接線に沿って最小回転で伝播させる
  for (let i = 1; i <= segU; i++) {
    const T_prev = tangents[i - 1];
    const T_curr = tangents[i];
    const axis = vec.cross(T_prev, T_curr);
    let B_curr, N_curr;

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

  // 3. ホロノミーの補正 (閉じたパスの場合、始点と終点のねじれを合わせる)
  let twistOffset = 0;
  if (closed) {
    const B_start = frames[0].B;
    const B_end = frames[segU].B;
    const T_end = frames[segU].T;
    
    // 終点での B と始点での B の間の角度を計算
    let cos = vec.dot(B_start, B_end);
    let sin = vec.dot(vec.cross(B_end, B_start), T_end);
    twistOffset = Math.atan2(sin, cos);
  }

  // 4. 頂点の生成
  const numU = closed ? segU : segU + 1;
  const numV = segV; // 断面は円なので重複を避けるため終点は含めない

  for (let i = 0; i < numU; i++) {
    const p = pathFunc(i / segU);
    let { B, N, T } = frames[i];
    
    // ねじれを均等に分散
    if (closed && twistOffset !== 0) {
      const angle = (i / segU) * twistOffset;
      B = rotate(B, T, angle);
      N = rotate(N, T, angle);
    }

    for (let j = 0; j < numV; j++) {
      const v = (j / segV) * Math.PI * 2;
      const cv = Math.cos(v), sv = Math.sin(v);

      vertices.push({
        x: p.x + radius * (cv * N.x + sv * B.x),
        y: p.y + radius * (cv * N.y + sv * B.y),
        z: p.z + radius * (cv * N.z + sv * B.z),
      });
    }
  }

  // 5. 面（四角形）の生成
  for (let i = 0; i < segU; i++) {
    if (!closed && i === segU) break;
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

/**
 * 媒介変数を用いた曲面（Parametric Surface）を生成します。
 * (u, v) ドメインを (x, y, z) 座標にマッピングし、頂点と四角形面を生成します。
 *
 * @param {number} segU - U軸方向の分割数。
 * @param {number} segV - V軸方向の分割数。
 * @param {Function} func - マッピング関数 (u, v) => {x, y, z}。
 * @param {Array} uRange - Uの範囲 [min, max] (デフォルトは [0, 2π])。
 * @param {Array} vRange - Vの範囲 [min, max] (デフォルトは [0, 2π])。
 * @returns {Object} 生成された {vertices, faces}。
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
