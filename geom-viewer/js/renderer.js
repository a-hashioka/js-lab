/**
 * js/renderer.js
 * 最適化された3Dから2Dへの投影およびCanvas描画エンジン。
 */

/**
 * 4次元の頂点を3次元に投影します。
 * 
 * @param {Array} vertices4D - 4次元頂点の配列 {x, y, z, w}。
 * @param {number} angle - W軸周りの回転角度。
 * @returns {Array} 3次元頂点の配列 {x, y, z}。
 */
export const project4D = (vertices4D, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  return vertices4D.map((v) => {
    // X-W平面での回転
    const x = v.x * cos - v.w * sin;
    const w = v.w * cos + v.x * sin;
    
    // 遠近投影 (4D -> 3D)
    // d は投影面までの距離。w が大きい（遠い）ほどスケールが小さくなる。
    const d = 2 / (3 + w);
    return { x: x * d, y: v.y * d, z: v.z * d };
  });
};

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
 * @returns {Object} スクリーン座標と奥行きに基づくスケール係 {x, y, scale}。
 */
export const project = (v, scale, rotX, rotY, rotZ, fov, viewDist, w, h) => {
  if (!v) return { x: 0, y: 0, scale: 0 };

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
 * @param {Object} data - 形状データ（頂点、面、グロー、スタイルなど）。
 * @param {Array} projected - 投影されたスクリーン座標の配列。
 * @param {number} w - キャンバスの幅。
 * @param {number} h - キャンバスの高さ。
 */
export const draw = (ctx, data, projected, w, h) => {
  if (!ctx || !data || !projected) return;

  ctx.clearRect(0, 0, w, h);

  // 1. 面を深度でソート（ペインターのアルゴリズム）
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

  // 2. 面の描画
  faces.forEach(({ face, index, avgScale, color, edgeColor, style }) => {
    const alpha = Math.min(Math.max((avgScale - 0.3) * 2.0, 0.1), 0.85);

    if (style && style.composite) {
      ctx.globalCompositeOperation = style.composite;
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    if (color) {
      ctx.fillStyle = color.replace("ALPHA", (alpha * 0.9).toFixed(2));
    } else {
      ctx.fillStyle = `rgba(248, 248, 248, ${(alpha * 0.8).toFixed(2)})`;
    }

    if (edgeColor) {
      ctx.strokeStyle = edgeColor.replace("ALPHA", alpha.toFixed(2));
    } else {
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha.toFixed(2)})`;
    }
    
    ctx.lineWidth = Math.max(0.5, 1.0 * avgScale);

    let started = false;
    ctx.beginPath();
    for (let i = 0; i < face.length; i++) {
      const p = projected[face[i]];
      if (p) {
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else { ctx.lineTo(p.x, p.y); }
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

  ctx.globalCompositeOperation = "source-over";

  // 3. グロー（光輪）効果の描画
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
      ctx.globalCompositeOperation = "screen"; // 加算合成で光を表現
      ctx.beginPath();
      ctx.arc(p.x, p.y, gradRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
  }

  // 4. 頂点（ノード）の描画
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

