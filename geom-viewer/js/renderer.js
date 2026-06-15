/**
 * js/renderer.js
 * 最適化された3Dから2Dへの投影およびCanvas描画エンジン。
 */

/**
 * 透視投影を使用して、3D頂点を2Dスクリーン座標に投影します。
 *
 * @param {Object} v - 3D頂点 {x, y, z}
 * @param {number} scale - グローバルスケーリング係数。
 * @param {number} rotX - X軸周りの回転（ラジアン）。
 * @param {number} rotY - Y軸周りの回転（ラジアン）。
 * @param {number} rotZ - Z軸周りの回転（ラジアン）。
 * @param {number} fov - 視野角（焦点距離）。
 * @param {number} viewDist - 視点からオブジェクトまでの距離。
 * @param {number} w - キャンバスの幅。
 * @param {number} h - キャンバスの高さ。
 * @returns {Object} スクリーン座標と奥行きに基づくスケール係数 {x, y, scale}。
 */
export const project = (v, scale, rotX, rotY, rotZ, fov, viewDist, w, h) => {
  // Y軸周りの回転
  const cosY = Math.cos(rotY),
    sinY = Math.sin(rotY);
  const y1 = v.y * cosY - v.z * sinY;
  const z1 = v.z * cosY + v.y * sinY;

  // X軸周りの回転
  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX);
  const x2 = v.x * cosX - z1 * sinX;
  const z2 = z1 * cosX + v.x * sinX;

  // Z軸周りの回転
  const cosZ = Math.cos(rotZ),
    sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = y1 * cosZ + x2 * sinZ;

  // 透視投影の計算
  const s = fov / (fov + z2 * scale + viewDist);

  return {
    x: w / 2 + x3 * scale * s,
    y: h / 2 + y3 * scale * s,
    scale: s,
  };
};

/**
 * 投影された幾何学的データをキャンバスに描画します。
 *
 * @param {CanvasRenderingContext2D} ctx - キャンバスのレンダリングコンテキスト。
 * @param {Object} data - 形状データ（頂点、面など）。
 * @param {Array} projected - 投影されたスクリーン座標の配列。
 * @param {number} w - キャンバスの幅。
 * @param {number} h - キャンバスの高さ。
 */
export const draw = (ctx, data, projected, w, h) => {
  ctx.clearRect(0, 0, w, h);

  // 1. 面を深度でソート（ペインターのアルゴリズム：奥から順に描画するため）
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

  // 奥から前の順にソート
  faces.sort((a, b) => a.avgScale - b.avgScale);

  // 2. 面の描画
  faces.forEach(({ face, avgScale, color }) => {
    // 距離/スケールに基づいて透明度を適応的に計算
    const alpha = Math.min(Math.max((avgScale - 0.3) * 2.0, 0.1), 0.85);

    if (color) {
      ctx.fillStyle = color.replace("ALPHA", (alpha * 0.9).toFixed(2));
    } else {
      ctx.fillStyle = `rgba(248, 248, 248, ${(alpha * 0.8).toFixed(2)})`;
    }

    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.0 * avgScale;

    // パスの描画
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

  // 3. 頂点（ノード）を小さなドットとして描画
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
