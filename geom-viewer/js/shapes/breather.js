/**
 * js/shapes/breather.js
 * 構造の説明: ブリーザー曲面 (Breather Surface)
 */

import { parametric } from "../utils.js";

/**
 * ブリーザー曲面を生成します。
 * Sine-Gordon方程式のソリトン解であり、パラメータ a によって形状がダイナミックに変化します。
 * 6.5周期分のソリトンを連結して描画し、脈動するチューブ状の幾何学的構造を可視化します。
 * @param {number} counter - アニメーション用のカウンター
 * @returns {Object} {vertices, faces}
 */
export const breather = {
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
  generate: (counter = 0) => {
    /**
     * a の変化範囲: [0.25, 0.5]
     * 数学的な定義域は 0 < a < 1。
     * a が小さいほど細長く、大きいほど太くなります。
     * この範囲では、ソリトンの特徴的な「呼吸」を安定して観察できます。
     */
    const a = 0.375 + 0.125 * Math.sin(counter * 0.02);
    const w = Math.sqrt(1 - a * a);

    // u は a に反比例して広がる
    const uLimit = 7.0 / a; 
    // v は 6.5周期分 (6.5 * 2pi/w) を描画
    const vLimit = (6.5 * 2 * Math.PI) / w;

    // 解像度をさらに最適化 (u:30, v:140)
    return parametric(30, 140, (u, v) => {
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
      
      // スケールをさらに縮小 (0.12 -> 0.08)
      const s = 0.08;
      return { x: x * s, y: y * s, z: z * s };
    }, [-uLimit, uLimit], [0, vLimit]);
  }
};
