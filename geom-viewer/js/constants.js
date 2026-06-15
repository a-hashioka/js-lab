/**
 * js/constants.js
 * 幾何学計算およびビューアー設定に使用される共通の定数。
 */

/** 黄金比 (Golden Ratio) */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** ビューアーの回転速度 */
export const ROTATION_SPEED = 0.01;

/** 自動回転の速度設定 */
export const AUTO_ROTATION_SPEEDS = { x: 0.005, y: 0.003, z: 0.002 };

/** 投影設定（視野角と視点距離） */
export const PERSPECTIVE = { fov: 600, viewDist: 600 };
