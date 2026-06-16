/**
 * js/shapes/orrery.js
 * 太陽系の精巧なモデル。
 * 単一の球体で構成され、肢減光（Limb Darkening）と発光エフェクトを持つ太陽を中心に、
 * 各惑星とその衛星が軌道を描きます。
 */

import type { ShapeDefinition, Vector3, Geometry } from "../types";
import {  normalize, vec, subdivide  } from "../utils/math";
import {  PHI  } from "../constants";

/**
 * 特定の半径、中心、タイプに基づいて、細分化された球体（アイコスフィア）を生成します。
 *
 * @param {number} radius - 球の半径。
 * @param {Vector3} center - 中心座標 {x, y, z}。
 * @param {string} type - 'SUN', 'PLANET', 'MOON' のいずれか。
 * @param {number} iterations - 細分化の回数。
 * @param {any} camera - カメラの回転状態（太陽の肢減光計算用）。
 * @returns {any} 頂点、面、および色情報のオブジェクト。
 */
const createBody = (
  radius: number,
  center: Vector3 = { x: 0, y: 0, z: 0 },
  type = "PLANET",
  iterations = 1,
  camera: any = { x: 0, y: 0 },
) => {
  // 正二十面体の初期頂点
  let geo = {
    vertices: [
      { x: -1, y: PHI, z: 0 }, { x: 1, y: PHI, z: 0 }, { x: -1, y: -PHI, z: 0 }, { x: 1, y: -PHI, z: 0 },
      { x: 0, y: -1, z: PHI }, { x: 0, y: 1, z: PHI }, { x: 0, y: -1, z: -PHI }, { x: 0, y: 1, z: -PHI },
      { x: PHI, y: 0, z: -1 }, { x: PHI, y: 0, z: 1 }, { x: -PHI, y: 0, z: -1 }, { x: -PHI, y: 0, z: 1 },
    ].map(normalize),
    faces: [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
    ],
  };

  // 球状に細分化
  for (let i = 0; i < iterations; i++) {
    geo = subdivide(geo, true);
  }

  const v: Vector3[] = geo.vertices.map((v) => ({
    x: center.x + v.x * radius,
    y: center.y + v.y * radius,
    z: center.z + v.z * radius,
  }));

  const faceColors: string[] = [];
  const edgeColors: string[] = [];
  const faceStyles: any[] = [];
  const lightSource = { x: 0, y: 0, z: 0 };

  geo.faces.forEach((face: number[]) => {
    if (type === "SUN") {
      edgeColors.push("rgba(255, 255, 255, ALPHA)"); // 太陽は白いフレーム
    } else {
      edgeColors.push("rgba(0, 0, 0, 0)"); // 惑星・衛星はフレームなし
    }

    // 法線の計算（球体なので中心からのベクトルを正規化するだけで良い）
    const c = { x: 0, y: 0, z: 0 };
    face.forEach((vi) => {
      c.x += v[vi].x;
      c.y += v[vi].y;
      c.z += v[vi].z;
    });
    c.x /= 3; c.y /= 3; c.z /= 3;
    
    const normal = normalize({
      x: c.x - center.x,
      y: c.y - center.y,
      z: c.z - center.z,
    });

    if (type === "SUN") {
      // カメラを考慮した肢減光（Limb Darkening）エフェクト
      // 太陽の中心から外縁に向かって暗くなる現象をシミュレート
      const rotX = camera.x, rotY = camera.y;

      // 法線をカメラに合わせて回転（レンダラーのロジックに合わせる）
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const z1 = normal.z * cosY + normal.y * sinY;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const z2 = z1 * cosX + normal.x * sinX;

      // mu = 1.0 が中心（カメラを向いている）、0.0 が縁
      const mu = Math.abs(z2);
      const intensity = Math.pow(mu, 0.5);

      const r = 255;
      const g = Math.floor(160 + 95 * intensity);
      const b = Math.floor(40 + 215 * Math.pow(intensity, 1.5));
      faceColors.push(`rgba(${r}, ${g}, ${b}, 1.0)`);
      faceStyles.push({ composite: "source-over" });
    } else {
      // 惑星と衛星のライティング（太陽からの平行光に近い扱い）
      const lightVec = normalize({
        x: lightSource.x - c.x,
        y: lightSource.y - c.y,
        z: lightSource.z - c.z,
      });
      const dot = Math.max(0.08, vec.dot(normal, lightVec));
      const b = Math.floor(60 + 195 * dot);
      faceColors.push(`rgba(${b}, ${b}, ${b}, ALPHA)`);
      faceStyles.push(null);
    }
  });

  return { v, f: geo.faces, faceColors, edgeColors, faceStyles };
};

export const orrery: ShapeDefinition = {
  id: "orrery",
  title: "Solar System",
  isDynamic: true,
  hideVertices: true,
  hideEdges: true,
  desc: [
    "An orrery is a mechanical model of the Solar System that illustrates the relative positions and motions of the planets and moons according to the heliocentric model. The study of celestial mechanics was revolutionized by Nicolaus Copernicus, who proposed that the Sun, rather than the Earth, is at the center of the universe. This shift laid the groundwork for modern astronomy and our understanding of the cosmic order.",
    "The motion of the planets was further refined by Johannes Kepler's three laws of planetary motion, which described their orbits as ellipses. Later, Sir Isaac Newton's law of universal gravitation provided the physical basis for these movements, demonstrating that the same force that makes an apple fall to the ground also keeps the planets in their orbits around the Sun. This unification of terrestrial and celestial physics is a cornerstone of the Scientific Revolution.",
  ],
  formulas: [
    { label: "Universal Gravitation", eq: "F = G \\frac{m_1 m_2}{r^2}" },
    { label: "Kepler's Third Law", eq: "\\frac{a^3}{T^2} = \\frac{G(M+m)}{4\\pi^2}" },
    { label: "Titius-Bode Law", eq: "a = 0.4 + 0.3 \\cdot 2^n" },
  ],
  /**
   * 太陽系のジオメトリを生成します。
   *
   * @param {number} counter - アニメーションフレーム。
   * @param {any} state - ビューアーの状態（カメラ回転などの取得用）。
   * @returns {Geometry} 生成されたジオメトリデータ。
   */
  generate: (counter: number = 0, state: any = {}): Geometry => {
    const vertices: Vector3[] = [];
    const faces: number[][] = [];
    const faceColors: string[] = [];
    const edgeColors: string[] = [];
    const faceStyles: any[] = [];
    const glows: any[] = [];

    // カメラの状態（回転）を取得。存在しない場合はデフォルト。
    const camera = state.rotation || { x: 0.5, y: 0.5 };
    const time = counter * 0.005;

    const addBody = (bodyData: any) => {
      const offset = vertices.length;
      const {
        v,
        f,
        faceColors: colors,
        edgeColors: eColors,
        faceStyles: styles,
      } = createBody(
        bodyData.size,
        bodyData.pos,
        bodyData.type,
        bodyData.iter || 0,
        camera,
      );

      // グロー効果用の中心頂点
      const centerIdx = vertices.length;
      vertices.push(bodyData.pos);

      vertices.push(...v);
      faces.push(...f.map((face: number[]) => face.map((i: number) => i + offset + 1)));
      faceColors.push(...colors);
      edgeColors.push(...eColors);
      faceStyles.push(...styles);

      if (bodyData.type === "SUN") {
        // 太陽の周りの柔らかなコロナ（光輪）効果
        glows.push({
          vertexIdx: centerIdx,
          radius: bodyData.size * 15,
          stops: [
            { offset: 0.0, color: "rgba(255, 200, 50, 0.4)" },
            { offset: 0.2, color: "rgba(255, 120, 20, 0.2)" },
            { offset: 0.5, color: "rgba(255, 50, 0, 0.05)" },
            { offset: 1.0, color: "rgba(255, 0, 0, 0)" },
          ],
        });
      }
    };

    // 1. 太陽
    addBody({ size: 0.1, pos: { x: 0, y: 0, z: 0 }, type: "SUN", iter: 2 });

    // 2. 惑星と衛星の設定
    const getScaledDist = (au: number) => 0.18 + Math.log(au + 1) * 0.5;

    const planets = [
      { name: "Mercury", au: 0.39, period: 0.24, size: 0.009, moons: [] },
      { name: "Venus", au: 0.72, period: 0.61, size: 0.019, moons: [] },
      {
        name: "Earth", au: 1.0, period: 1.0, size: 0.021,
        moons: [{ name: "Moon", dist: 0.05, period: 0.07, size: 0.006 }],
      },
      {
        name: "Mars", au: 1.52, period: 1.88, size: 0.014,
        moons: [
          { name: "Phobos", dist: 0.035, period: 0.03, size: 0.004 },
          { name: "Deimos", dist: 0.045, period: 0.05, size: 0.003 },
        ],
      },
      {
        name: "Jupiter", au: 5.2, period: 11.86, size: 0.064,
        moons: [
          { name: "Io", dist: 0.08, period: 0.05, size: 0.005 },
          { name: "Europa", dist: 0.11, period: 0.08, size: 0.004 },
          { name: "Ganymede", dist: 0.14, period: 0.12, size: 0.007 },
          { name: "Callisto", dist: 0.18, period: 0.18, size: 0.006 },
        ],
      },
      {
        name: "Saturn", au: 9.54, period: 29.45, size: 0.054,
        moons: [{ name: "Titan", dist: 0.12, period: 0.15, size: 0.009 }],
      },
      {
        name: "Uranus", au: 19.22, period: 84.01, size: 0.034,
        moons: [{ name: "Titania", dist: 0.08, period: 0.12, size: 0.006 }],
      },
      {
        name: "Neptune", au: 30.06, period: 164.79, size: 0.034,
        moons: [{ name: "Triton", dist: 0.08, period: 0.1, size: 0.006 }],
      },
    ];

    planets.forEach((p: any, idx) => {
      const dist = getScaledDist(p.au);
      const angle = time / p.period + idx * 1.5;
      const px = Math.cos(angle) * dist;
      const pz = Math.sin(angle) * dist;
      const pPos = { x: px, y: 0, z: pz };

      let pIter = 1;
      if (p.size > 0.04) pIter = 2;
      if (p.size < 0.015) pIter = 0;
      addBody({ size: p.size, pos: pPos, type: "PLANET", iter: pIter });

      p.moons.forEach((m: any, mIdx: number) => {
        const inclination = mIdx * 0.2 + 0.1;
        const mAngle = time / m.period + mIdx * 1.2;
        const mx = px + Math.cos(mAngle) * m.dist;
        const my = Math.sin(mAngle) * m.dist * Math.sin(inclination);
        const mz = pz + Math.sin(mAngle) * m.dist * Math.cos(inclination);
        addBody({ size: m.size, pos: { x: mx, y: my, z: mz }, type: "MOON", iter: 0 });
      });

      // 土星の環
      if (p.name === "Saturn") {
        const rSegments = 40;
        const rOffset = vertices.length;
        const rInner = p.size * 1.4;
        const rOuter = p.size * 2.1;
        for (let i = 0; i <= rSegments; i++) {
          const theta = (i / rSegments) * Math.PI * 2;
          const cx = Math.cos(theta), sz = Math.sin(theta);
          vertices.push({ x: px + cx * rInner, y: 0, z: pz + sz * rInner });
          vertices.push({ x: px + cx * rOuter, y: 0, z: pz + sz * rOuter });
          if (i < rSegments) {
            const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2 + 1, d = (i + 1) * 2;
            faces.push([rOffset + a, rOffset + b, rOffset + c, rOffset + d]);
            faceColors.push("rgba(180, 180, 180, 0.25)");
            edgeColors.push("rgba(0, 0, 0, 0)");
            faceStyles.push(null);
          }
        }
      }
    });

    return {
      vertices, faces, faceColors, edgeColors, faceStyles, glows,
      hideVertices: true,
      hideEdges: false,
    };
  },
};
