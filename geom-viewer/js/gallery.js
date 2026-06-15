/**
 * js/gallery.js
 * 階層的な形状ギャラリーを動的に生成・レンダリングします。
 */

import { disciplines, shapes } from "./shapes/index.js";

/**
 * ギャラリーを生成してDOMに挿入します。
 * disciplinesデータ（分野、グループ、形状）に基づき、セクションを構築します。
 */
function renderGallery() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  // 既存のコンテンツをクリア
  container.innerHTML = "";

  // 分野（Mathematics, Physics, etc.）ごとにセクションを作成
  disciplines.forEach((discipline) => {
    const section = document.createElement("section");
    section.className = "discipline-section";

    section.innerHTML = `
      <div class="discipline-header">
        <h2>${discipline.name}</h2>
        <p class="discipline-desc">${discipline.desc}</p>
      </div>
    `;

    // 分野内のグループ（Platonic Solids, etc.）ごとにコンテナを作成
    discipline.groups.forEach((group) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "group-container";

      const gHeader = document.createElement("h3");
      gHeader.className = "group-title";
      gHeader.textContent = group.name;
      groupDiv.appendChild(gHeader);

      const ul = document.createElement("ul");
      ul.className = "shape-list";

      // グループ内の各形状へのリンクを作成
      group.shapes.forEach((id) => {
        const shape = shapes[id];
        if (!shape) return;

        const li = document.createElement("li");
        li.innerHTML = `<a href="viewer.html?id=${id}" class="shape-link">${shape.title}</a>`;
        ul.appendChild(li);
      });

      groupDiv.appendChild(ul);
      section.appendChild(groupDiv);
    });

    container.appendChild(section);
  });
}

/**
 * DOMContentLoaded時に実行。
 * すでにロード済みの場合は即座に実行。
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderGallery);
} else {
  renderGallery();
}
