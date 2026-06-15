/**
 * js/viewer.js
 * Main controller for the individual shape viewer.
 * Manages state, input, and the rendering loop.
 */

import { shapes, disciplines } from "./shapes/index.js";
import { project, draw } from "./renderer.js";

// --- Configuration & Constants ---
const ROTATION_SPEED = 0.01;
const AUTO_ROTATION_SPEEDS = { x: 0.005, y: 0.003, z: 0.002 };
const PERSPECTIVE = { fov: 600, viewDist: 600 };

// --- State Management ---
const state = {
  currentId: "",
  shapeObj: null,
  shapeData: null,

  // Transformation state
  rotation: { x: 0.5, y: 0.5 },
  rotationTarget: { x: 0.5, y: 0.5 },
  autoAngles: { x: 0, y: 0, z: 0 },

  // Interaction state
  isDragging: false,
  previousMousePos: { x: 0, y: 0 },

  // Specialized state for dynamic shapes
  dynamicCounter: 0,
  angle4D: 0,
};

const canvas = document.getElementById("canvas");
const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;

/**
 * Calculates ordered list of shape IDs for navigation.
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
 * Updates UI elements for navigation (Prev/Next buttons).
 */
function updateNavigation(id) {
  const index = orderedIds.indexOf(id);
  const prevBtn = document.getElementById("prev-shape");
  const nextBtn = document.getElementById("next-shape");

  const setBtn = (btn, targetId) => {
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
 * Loads the shape data and populates the UI.
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

  state.shapeData = state.shapeObj.generate();
  state.dynamicCounter = 0;

  // Update Text Content
  document.getElementById("shape-title").textContent = state.shapeObj.title;

  const descContainer = document.getElementById("shape-desc");
  descContainer.innerHTML = "";
  (state.shapeObj.desc || []).forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    descContainer.appendChild(p);
  });

  renderFormulas();
}

/**
 * Renders mathematical formulas using KaTeX if available.
 */
function renderFormulas() {
  const formulaList = document.getElementById("formula-list");
  const formulaBlock = document.getElementById("formulas-block");
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
 * Sets up interaction listeners.
 */
function initInput() {
  const infoToggle = document.getElementById("info-toggle");
  const contentSection = document.getElementById("content-section");

  if (infoToggle && contentSection) {
    infoToggle.addEventListener("click", () => {
      const isHidden = contentSection.classList.toggle("hidden");
      infoToggle.querySelector(".icon").textContent = isHidden ? "i" : "×";
    });
  }

  const handleDown = (e) => {
    if (e.target.closest("#info-toggle, #content-section, .top-nav")) return;
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
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);

  canvas.addEventListener("touchstart", handleDown, { passive: false });
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", handleUp);
}

/**
 * Syncs canvas dimensions with CSS and handles DPI.
 */
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
}

/**
 * Updates dynamic properties of specific shapes (Lorenz, Tesseract).
 */
function updateDynamicState() {
  // Lorenz Attractor: Incremental growth
  if (state.currentId === "lorenz" && state.dynamicCounter < 3000) {
    state.dynamicCounter += 7;
    state.shapeData = state.shapeObj.generate(
      Math.min(state.dynamicCounter, 3000),
    );
  }

  // Auto-rotation when not dragging
  if (!state.isDragging) {
    state.autoAngles.x += AUTO_ROTATION_SPEEDS.x;
    state.autoAngles.y += AUTO_ROTATION_SPEEDS.y;
    state.autoAngles.z += AUTO_ROTATION_SPEEDS.z;
    state.angle4D += 0.02;
  }

  // Smooth rotation damping
  state.rotation.x += (state.rotationTarget.x - state.rotation.x) * 0.1;
  state.rotation.y += (state.rotationTarget.y - state.rotation.y) * 0.1;
}

/**
 * Projects vertices, handling 4D-to-3D projection if necessary.
 */
function getProjectedVertices(width, height, scale) {
  let verts = state.shapeData.vertices;

  // 4D Projection (Tesseract)
  if (state.shapeObj.is4D && state.shapeData.vertices4D) {
    const cos = Math.cos(state.angle4D),
      sin = Math.sin(state.angle4D);
    verts = state.shapeData.vertices4D.map((v) => {
      const x = v.x * cos - v.w * sin;
      const w = v.w * cos + v.x * sin;
      const d = 2 / (3 + w);
      return { x: x * d, y: v.y * d, z: v.z * d };
    });
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
 * Main animation loop.
 */
function renderLoop() {
  if (ctx && state.shapeData) {
    updateDynamicState();

    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width, rect.height) * 0.65;

    const projected = getProjectedVertices(rect.width, rect.height, scale);
    if (projected) {
      draw(ctx, state.shapeData, projected, rect.width, rect.height);
    }
  }

  requestAnimationFrame(renderLoop);
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  loadShape();
  initInput();
  window.addEventListener("resize", resize);
  resize();
  renderLoop();
});
