/**
 * js/viewer.js
 * 個別の形状ビューアーのメインコントローラー。
 * 状態管理、入力処理、およびレンダリングループを担当します。
 */

import { shapes, disciplines } from "./shapes/index.js";
import { project, project4D, draw } from "./renderer.js";
import { ROTATION_SPEED, AUTO_ROTATION_SPEEDS, PERSPECTIVE } from "./constants.js";

// --- 状態管理 ---
const state = {
  currentId: "",
  shapeObj: null,
  shapeData: null,

  // 変形状態
  rotation: { x: 0.5, y: 0.5 },
  rotationTarget: { x: 0.5, y: 0.5 },
  autoAngles: { x: 0, y: 0, z: 0 },

  // インタラクション状態
  isDragging: false,
  previousMousePos: { x: 0, y: 0 },

  // 動的な形状のための特殊状態
  dynamicCounter: 0,
  angle4D: 0,

  // 時間管理（スムーズなアニメーション用）
  lastTime: 0,
};

const canvas = document.getElementById("canvas");
const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;

/**
 * ナビゲーション用の形状IDの順序付きリストを取得します。
 *
 * @returns {Array} 形状IDの配列。
 */
const getOrderedIds = () => {
  const ids = [];
  disciplines.forEach((d) => {
    d.groups.forEach((g) => {
      g.shapes.forEach((id) => {
        if (shapes[id]) ids.push(id);
      });
    });
  });
  return ids;
};

const orderedIds = getOrderedIds();

/**
 * ナビゲーションUI（戻る/次へボタン）を更新します。
 *
 * @param {string} id - 現在の形状ID。
 */
function updateNavigation(id) {
  const index = orderedIds.indexOf(id);
  const prevBtn = document.getElementById("prev-shape");
  const nextBtn = document.getElementById("next-shape");

  const setBtn = (btn, targetId) => {
    if (!btn) return;
    if (targetId) {
      btn.href = `viewer.html?id=${targetId}`;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    } else {
      btn.style.opacity = "0.3";
      btn.style.pointerEvents = "none";
    }
  };

  setBtn(prevBtn, orderedIds[index - 1]);
  setBtn(nextBtn, orderedIds[index + 1]);
}

/**
 * 形状データをロードし、UIを初期化します。
 */
function loadShape() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "icosahedron";

  state.currentId = id;
  state.shapeObj = shapes[id];

  if (!state.shapeObj) {
    window.location.href = "index.html";
    return;
  }

  updateNavigation(id);

  state.dynamicCounter = 0;
  state.shapeData = state.shapeObj.generate(state.dynamicCounter, state);
  if (state.shapeObj.hideVertices) {
    state.shapeData.hideVertices = true;
  }

  // テキストコンテンツの更新
  const titleEl = document.getElementById("shape-title");
  if (titleEl) titleEl.textContent = state.shapeObj.title;

  const descContainer = document.getElementById("shape-desc");
  if (descContainer) {
    descContainer.innerHTML = "";
    (state.shapeObj.desc || []).forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      descContainer.appendChild(p);
    });
  }

  renderFormulas();
}

/**
 * KaTeXを使用して数式をレンダリングします（利用可能な場合）。
 */
function renderFormulas() {
  const formulaList = document.getElementById("formula-list");
  const formulaBlock = document.getElementById("formulas-block");
  if (!formulaList || !formulaBlock) return;

  formulaList.innerHTML = "";

  const formulas = state.shapeObj.formulas || [];
  if (formulas.length > 0) {
    formulaBlock.classList.remove("hidden");
    formulas.forEach((f) => {
      const item = document.createElement("div");
      item.className = "formula-item";

      const label = document.createElement("span");
      label.className = "formula-label";
      label.textContent = f.label;

      const renderDiv = document.createElement("div");
      renderDiv.className = "formula-render";

      item.appendChild(label);
      item.appendChild(renderDiv);
      formulaList.appendChild(item);

      if (window.katex) {
        try {
          window.katex.render(f.eq, renderDiv, { throwOnError: false });
        } catch (e) {
          renderDiv.textContent = f.eq;
        }
      } else {
        renderDiv.textContent = f.eq;
      }
    });
  } else {
    formulaBlock.classList.add("hidden");
  }
}

/**
 * インタラクションのためのリスナーを設定します。
 */
function initInput() {
  const infoToggle = document.getElementById("info-toggle");
  const contentSection = document.getElementById("content-section");

  if (infoToggle && contentSection) {
    infoToggle.addEventListener("click", () => {
      const isHidden = contentSection.classList.toggle("hidden");
      const icon = infoToggle.querySelector(".icon");
      if (icon) icon.textContent = isHidden ? "i" : "×";
    });
  }

  if (!canvas) return;

  const handleDown = (e) => {
    if (
      e.target.closest("#info-toggle, #content-section, #bottom-nav, .top-nav")
    )
      return;
    state.isDragging = true;
    const p = e.touches ? e.touches[0] : e;
    state.previousMousePos = { x: p.clientX, y: p.clientY };
  };

  const handleMove = (e) => {
    if (!state.isDragging) return;
    const p = e.touches ? e.touches[0] : e;
    state.rotationTarget.x +=
      (p.clientX - state.previousMousePos.x) * ROTATION_SPEED;
    state.rotationTarget.y +=
      (p.clientY - state.previousMousePos.y) * ROTATION_SPEED;
    state.previousMousePos = { x: p.clientX, y: p.clientY };
  };

  const handleUp = () => (state.isDragging = false);

  canvas.addEventListener("mousedown", handleDown);
  window.addEventListener("mousemove", handleMove, { passive: false });
  window.addEventListener("mouseup", handleUp);

  canvas.addEventListener("touchstart", handleDown, { passive: false });
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", handleUp);
}

/**
 * キャンバスのサイズをウィンドウに合わせ、DPI調整を行います。
 */
function resize() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
}

/**
 * 特定の形状の動的なプロパティを更新します。
 *
 * @param {number} deltaTime - 前回のフレームからの経過時間（ミリ秒）。
 */
function updateDynamicState(deltaTime) {
  if (!state.shapeObj) return;

  // 基準となるフレームレート (60fps) に対する係数
  const dtFactor = deltaTime / 16.666;

  // 形状特有の動的更新
  if (state.shapeObj.isDynamic) {
    const step = (state.shapeObj.step || 1) * dtFactor;
    state.dynamicCounter += step;
    
    // 制限がある場合はその値でクランプ
    if (state.shapeObj.limit && state.dynamicCounter > state.shapeObj.limit) {
      state.dynamicCounter = state.shapeObj.limit;
    }

    // カウンターの整数部分が変化した時のみ再生成（パフォーマンス最適化）
    const currentStep = Math.floor(state.dynamicCounter);
    if (currentStep !== state.lastGeneratedStep || state.currentId === "orrery") {
      // Orreryはカメラ回転に依存するため、常に（または変化時に）再生成が必要
      state.shapeData = state.shapeObj.generate(currentStep, state);
      if (state.shapeObj.hideVertices) {
        state.shapeData.hideVertices = true;
      }
      state.lastGeneratedStep = currentStep;
    }
  }

  // ドラッグ中ではない時の自動回転
  if (!state.isDragging) {
    state.autoAngles.x += AUTO_ROTATION_SPEEDS.x * dtFactor;
    state.autoAngles.y += AUTO_ROTATION_SPEEDS.y * dtFactor;
    state.autoAngles.z += AUTO_ROTATION_SPEEDS.z * dtFactor;
    state.angle4D += 0.02 * dtFactor;
  }

  // スムーズな回転のダンピング処理（時間依存）
  const lerpFactor = 1 - Math.pow(0.9, dtFactor);
  state.rotation.x += (state.rotationTarget.x - state.rotation.x) * lerpFactor;
  state.rotation.y += (state.rotationTarget.y - state.rotation.y) * lerpFactor;
}

/**
 * 頂点を投影します。必要に応じて4Dから3Dへの投影も行います。
 *
 * @param {number} width - 描画領域の幅。
 * @param {number} height - 描画領域の高さ。
 * @param {number} scale - 投影スケール。
 * @returns {Array|null} 投影された頂点の配列。
 */
function getProjectedVertices(width, height, scale) {
  if (!state.shapeData) return null;

  let verts = state.shapeData.vertices;

  // 4D投影
  if (state.shapeObj.is4D && state.shapeData.vertices4D) {
    verts = project4D(state.shapeData.vertices4D, state.angle4D);
  }

  if (!verts) return null;

  return verts.map((v) =>
    project(
      v,
      scale,
      state.rotation.x + state.autoAngles.x,
      state.rotation.y + state.autoAngles.y,
      state.autoAngles.z,
      PERSPECTIVE.fov,
      PERSPECTIVE.viewDist,
      width,
      height,
    ),
  );
}

/**
 * メインのアニメーションループ。
 *
 * @param {number} time - 現在のタイムスタンプ（ミリ秒）。
 */
function renderLoop(time = 0) {
  const deltaTime = time - state.lastTime;
  state.lastTime = time;

  // deltaTime が異常に大きい場合（タブ復帰時など）は無視
  if (deltaTime > 100) {
    requestAnimationFrame(renderLoop);
    return;
  }

  if (ctx && state.shapeData) {
    updateDynamicState(deltaTime);

    const rect = canvas.getBoundingClientRect();
    // スケールを 0.65 に調整
    const scale = Math.min(rect.width, rect.height) * 0.65;

    const projected = getProjectedVertices(rect.width, rect.height, scale);
    if (projected) {
      draw(ctx, state.shapeData, projected, rect.width, rect.height);
    }
  }

  requestAnimationFrame(renderLoop);
}

// 初期化処理
document.addEventListener("DOMContentLoaded", () => {
  loadShape();
  initInput();
  window.addEventListener("resize", resize);
  resize();
  renderLoop();
});
