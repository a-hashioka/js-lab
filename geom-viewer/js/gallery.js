/**
 * js/gallery.js
 * Renders the hierarchical shape gallery.
 */

import { disciplines, shapes } from "./shapes/index.js";

// Cache-busting: v2.0
function renderGallery() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  container.innerHTML = "";

  disciplines.forEach((discipline) => {
    const section = document.createElement("section");
    section.className = "discipline-section";

    section.innerHTML = `
      <div class="discipline-header">
        <h2>${discipline.name}</h2>
        <p class="discipline-desc">${discipline.desc}</p>
      </div>
    `;

    discipline.groups.forEach((group) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "group-container";

      const gHeader = document.createElement("h3");
      gHeader.className = "group-title";
      gHeader.textContent = group.name;
      groupDiv.appendChild(gHeader);

      const ul = document.createElement("ul");
      ul.className = "shape-list";

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderGallery);
} else {
  renderGallery();
}
