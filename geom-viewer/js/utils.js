/**
 * js/utils.js
 * 幾何学的な形状生成に使用される数学的ユーティリティ関数。
 */

/**
 * 3Dベクトルを正規化して単位ベクトルにします。
 *
 * @param {Object} v - 正規化する3Dベクトル {x, y, z}
 * @returns {Object} 正規化された3Dベクトル {x, y, z}
 */
export const normalize = (v) => {
  const l = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};

/**
 * ベクトルの基本演算
 */
export const vec = {
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z }),
  sub: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
  mul: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
  div: (v, s) => ({ x: v.x / s, y: v.y / s, z: v.z / s }),
  midpoint: (v1, v2) => ({
    x: (v1.x + v2.x) / 2,
    y: (v1.y + v2.y) / 2,
    z: (v1.z + v2.z) / 2,
  }),
};

/**
 * メッシュを細分化（サブディビジョン）します。
 * 各三角形の面を4つの小さな三角形に分割します。
 *
 * @param {Object} geometry - {vertices, faces}
 * @param {boolean} shouldNormalize - 新しい頂点を正規化するかどうか（球体生成用）
 * @returns {Object} 細分化された {vertices, faces}
 */
export const subdivide = (geometry, shouldNormalize = false) => {
  const { vertices, faces } = geometry;
  const nextFaces = [];
  const cache = new Map();
  const nextVertices = [...vertices];

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
      // 三角形以外は現在はサポートしない（またはそのまま通す）
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
 * フレネ・セレの標構（接線、法線、副法線）を使用して断面を計算します。
 *
 * @param {Function} pathFunc - パス上の点(t)を返す関数。tは0から1。
 * @param {number} segU - パス方向の分割数。
 * @param {number} segV - 断面（円）の分割数。
 * @param {number} radius - チューブの半径。
 * @param {boolean} closed - パスが閉じているかどうか。
 * @returns {Object} 生成された {vertices, faces}。
 */
export const tube = (pathFunc, segU, segV, radius, closed = false) => {
  const vertices = [];
  const faces = [];

  for (let i = 0; i <= segU; i++) {
    const t = i / segU;
    const p = pathFunc(t);

    // 接線(T)の計算（差分法）
    const dt = 0.0001;
    let T;
    if (closed) {
      // 閉じたパスの場合、ラップアラウンドを使用して接線を計算
      const pNext = pathFunc((t + dt) % 1);
      const pPrev = pathFunc((t - dt + 1) % 1);
      T = normalize(vec.sub(pNext, pPrev));
    } else {
      // 開いたパスの場合、端点を超えないように接線を計算
      const pNext = pathFunc(Math.min(t + dt, 1));
      const pPrev = pathFunc(Math.max(t - dt, 0));
      T = normalize(vec.sub(pNext, pPrev));
    }

    // 法線(N)と副法線(B)の計算
    let up = { x: 0, y: 1, z: 0 };
    if (Math.abs(T.y) > 0.9) up = { x: 1, y: 0, z: 0 };

    const B = normalize({
      x: T.y * up.z - T.z * up.y,
      y: T.z * up.x - T.x * up.z,
      z: T.x * up.y - T.y * up.x,
    });
    const N = {
      x: B.y * T.z - B.z * T.y,
      y: B.z * T.x - B.x * T.z,
      z: B.x * T.y - B.y * T.x,
    };

    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * Math.PI * 2;
      const cv = Math.cos(v),
        sv = Math.sin(v);

      vertices.push({
        x: p.x + radius * (cv * N.x + sv * B.x),
        y: p.y + radius * (cv * N.y + sv * B.y),
        z: p.z + radius * (cv * N.z + sv * B.z),
      });

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

/**
 * 媒介変数を用いた曲面を生成するためのヘルパー関数。
 * (u, v) ドメインを (x, y, z) 座標にマッピングし、頂点と面を生成します。
 *
 * @param {number} segU - U軸方向の分割数。
 * @param {number} segV - V軸方向の分割数。
 * @param {Function} func - マッピング関数 (u, v) => {x, y, z}。
 * @param {Array} uRange - Uの範囲 [min, max] (デフォルトは [0, 2π])。
 * @param {Array} vRange - Vの範囲 [min, max] (デフォルトは [0, 2π])。
 * @returns {Object} 生成された {vertices, faces}。verticesは座標オブジェクトの配列、facesは頂点インデックスの配列。
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
