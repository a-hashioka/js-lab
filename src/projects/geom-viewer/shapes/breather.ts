/**
 * js/shapes/breather.js
 * 構造の説明: ブリーザー曲面 (Breather Surface)
 */

import type { ShapeDefinition } from "../types";
import {  parametric  } from "../utils/math";

/**
 * ブリーザー曲面を生成します。
 * Sine-Gordon方程式のソリトン解であり、パラメータ a によって形状がダイナミックに変化します。
 * 6.5周期分のソリトンを連結して描画し、脈動するチューブ状の幾何学的構造を可視化します。
 * @param {number} counter - アニメーション用のカウンター
 * @returns {Object} {vertices, faces}
 */
export const breather: ShapeDefinition = {
  id: "breather",
  title: "Breather Surface",
  isDynamic: true,
  desc: [
    "The Breather surface is a complex mathematical form that represents a periodic soliton solution of the Sine-Gordon equation. It is a member of the family of pseudospherical surfaces, characterized by a constant negative Gaussian curvature ($K = -1$).",
    "Historically, this surface emerged from the study of Bäcklund transformations in the late 19th century, allowing the generation of constant-curvature surfaces. It serves as a bridge between classical differential geometry and modern nonlinear wave theory.",
    "In this visualization, we animate the parameter $a$ while rendering 6.5 full cycles of the breather soliton. The parameter ranges for $u$ and $v$ are dynamically adjusted to maintain a visually consistent and complete periodic chain throughout the 'breathing' animation.",
  ],
  formulas: [
    { 
      label: "Parameters", 
      eq: "w = \\sqrt{1-a^2} \\\\" + 
          "D = a [ (w \\cosh(au))^2 + (a \\sin(wv))^2 ]" 
    },
    { 
      label: "Parametric Equations", 
      eq: "x = -u + \\frac{2w^2 \\cosh(au) \\sinh(au)}{D} \\\\" + 
          "y = \\frac{-2w \\cosh(au) [w \\cos(v) \\cos(wv) + \\sin(v) \\sin(wv)]}{D} \\\\" +
          "z = \\frac{-2w \\cosh(au) [w \\sin(v) \\cos(wv) - \\cos(v) \\sin(wv)]}{D}" 
    },
    { label: "Sine-Gordon Eq", eq: "u_{xx} - u_{tt} = \\sin u" },
    { label: "Curvature", eq: "K = -1" },
  ],
  generate: (counter: number = 0) => {
    /**
     * a の変化範囲: [0.5, 0.6]
     * 数学的な同期点 a = 0.6 (w = 0.8) を中心に、
     * v の範囲を 10 * PI に設定することで、回転と脈動が美しく揃います。
     */
    const a = 0.55 + 0.05 * Math.sin(counter * 0.03);
    const w = Math.sqrt(1 - a * a);

    // u は端が十分に細くなるまで描画 (10/a)
    const uLimit = 10.0 / a; 
    // v は 10*PI に設定し、回転と脈動の周期を同期させる
    const vLimit = 10 * Math.PI;

    // 解像度のバランスを最適化 (u:40, v:100)
    // 縦方向(u)の分割を増やすことで脈動の波形を滑らかにしつつ、
    // 横方向(v)を絞って全体の節点数（約4000面）を抑えています。
    return parametric(40, 100, (u: number, v: number) => {
      const au = a * u;
      const wv = w * v;
      
      const ch = Math.cosh(au);
      const sh = Math.sinh(au);
      const cv = Math.cos(v);
      const sv = Math.sin(v);
      const cwv = Math.cos(wv);
      const swv = Math.sin(wv);

      const wch = w * ch;
      const aswv = a * swv;
      const denom = a * (wch * wch + aswv * aswv);
      
      const x = -u + (2 * w * w * ch * sh) / denom;
      const y = (-2 * w * ch * (w * cv * cwv + sv * swv)) / denom;
      const z = (-2 * w * ch * (w * sv * cwv - cv * swv)) / denom;
      
      // スケールをさらに調整 (0.11)
      const s = 0.11;
      return { x: x * s, y: y * s, z: z * s };
    }, [-uLimit, uLimit], [0, vLimit]);
  }
};
