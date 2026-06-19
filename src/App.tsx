import { useState, useEffect } from "react";
import GeomViewer from "./projects/geom-viewer";
import VFXMuseum from "./projects/vfx-museum";
import "./App.css";

type ProjectId = "none" | "geom-viewer" | "vfx-museum";

function App() {
  const [project, setProject] = useState<ProjectId>(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("project");
    if (p === "geom-viewer") return "geom-viewer";
    if (p === "vfx-museum") return "vfx-museum";
    return "none";
  });

  const handleSelectProject = (id: ProjectId) => {
    setProject(id);
    const url = new URL(window.location.href);
    if (id === "none") {
      url.searchParams.delete("project");
      url.searchParams.delete("id");
    } else {
      url.searchParams.set("project", id);
    }
    window.history.pushState({}, "", url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("project");
      if (p === "geom-viewer") {
        setProject("geom-viewer");
      } else if (p === "vfx-museum") {
        setProject("vfx-museum");
      } else {
        setProject("none");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (project === "geom-viewer") {
    return <GeomViewer onExit={() => handleSelectProject("none")} />;
  }

  if (project === "vfx-museum") {
    return <VFXMuseum onExit={() => handleSelectProject("none")} />;
  }

  return (
    <div className="lab-container">
      <header className="lab-header">
        <div className="lab-title-row">
          <div className="lab-title-group">
            <h1>JS LAB</h1>
            <p className="lab-subtitle">
              Creative Coding & Visual Computing Experiments
            </p>
          </div>
        </div>
        <div className="lab-line"></div>
      </header>

      <main className="lab-main">
        <div className="project-grid">
          <button
            className="project-card"
            onClick={() => handleSelectProject("geom-viewer")}
          >
            <div className="project-card-header">
              <span className="project-id">EXP_01</span>
              <span className="project-arrow">→</span>
            </div>
            <h2 className="project-title">Geometry Viewer</h2>
            <p className="project-desc">
              Interactive 3D and 4D mathematical surface renderer. Explore
              Platonic solids, fractals, and chaotic structures driven by a
              custom canvas engine.
            </p>
          </button>

          <button
            className="project-card"
            onClick={() => handleSelectProject("vfx-museum")}
          >
            <div className="project-card-header">
              <span className="project-id">EXP_02</span>
              <span className="project-arrow">→</span>
            </div>
            <h2 className="project-title">VFX Museum</h2>
            <p className="project-desc">
              A curated exhibition of real-time particle simulations, retro
              ASCII filters, matrix code waterfalls, and interactive generative
              visual effects.
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
