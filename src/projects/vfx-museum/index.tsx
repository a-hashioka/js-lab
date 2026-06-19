import React, { useState, useEffect, useRef } from "react";
import Museum from "./components/Museum";
import MatrixRain from "./components/MatrixRain";
import ParticleNetwork from "./components/ParticleNetwork";
import MouseParallax from "./components/MouseParallax";
import TextScramble from "./components/TextScramble";
import ParticleText from "./components/ParticleText";
import ASCII from "./components/ASCII";
import CyberGrid from "./components/CyberGrid";
import "./index.css";

type ViewMode = "museum" | "viewer";

interface VFXMuseumProps {
  onExit: () => void;
}

const VFXMuseum: React.FC<VFXMuseumProps> = ({ onExit }) => {
  const [view, setView] = useState<ViewMode>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("vfx") ? "viewer" : "museum";
  });

  const [activeSlide, setActiveSlide] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("vfx") || "matrix";
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view !== "viewer") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlide(entry.target.id);
            const url = new URL(window.location.href);
            url.searchParams.set("vfx", entry.target.id);
            window.history.replaceState({}, "", url);
          }
        });
      },
      { threshold: 0.5 },
    );

    const slides = document.querySelectorAll(".vfx-slide");
    slides.forEach((slide) => observer.observe(slide));

    // Initial scroll
    const target = document.getElementById(activeSlide);
    if (target) {
      target.scrollIntoView({ behavior: "instant" });
    }

    return () => observer.disconnect();
  }, [view]);

  const handleSelectVFX = (id: string) => {
    setActiveSlide(id);
    setView("viewer");
    const url = new URL(window.location.href);
    url.searchParams.set("vfx", id);
    window.history.pushState({}, "", url);
  };

  const handleBackToMuseum = () => {
    setView("museum");
    const url = new URL(window.location.href);
    url.searchParams.delete("vfx");
    window.history.pushState({}, "", url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const vfx = params.get("vfx");
      if (vfx) {
        setActiveSlide(vfx);
        setView("viewer");
      } else {
        setView("museum");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isWhiteBG =
    activeSlide === "network" || activeSlide === "particle-text";

  const getVFXName = (id: string) => {
    const names: Record<string, string> = {
      matrix: "Stream",
      network: "Neural",
      parallax: "Parallax",
      scramble: "Signal",
      "particle-text": "Ethereal",
      ascii: "ASCII",
      grid: "Grid",
    };
    return names[id] || "";
  };

  return (
    <div className={`vfx-wrapper ${view === "museum" || isWhiteBG ? "white-theme" : "dark-theme"}`}>
      {view === "museum" ? (
        <Museum onSelectVFX={handleSelectVFX} onBack={onExit} />
      ) : (
        <div className="vfx-container" ref={containerRef}>
          <button className="vfx-exit-btn" onClick={handleBackToMuseum}>
            ✕
          </button>

          <div
            className="vfx-label"
            style={{ color: isWhiteBG ? "#000" : "#fff" }}
          >
            <div
              className="vfx-line"
              style={{ background: isWhiteBG ? "#000" : "#fff" }}
            ></div>
            <h2>{getVFXName(activeSlide)}</h2>
          </div>

          <section className="vfx-slide" id="matrix">
            <div className="vfx-canvas-container">
              {activeSlide === "matrix" && <MatrixRain />}
            </div>
          </section>

          <section className="vfx-slide" id="network">
            <div className="vfx-canvas-container">
              {activeSlide === "network" && <ParticleNetwork />}
            </div>
          </section>

          <section className="vfx-slide" id="parallax">
            <div className="vfx-canvas-container">
              {activeSlide === "parallax" && <MouseParallax />}
            </div>
          </section>

          <section className="vfx-slide" id="scramble">
            <div className="vfx-canvas-container">
              {activeSlide === "scramble" && <TextScramble />}
            </div>
          </section>

          <section className="vfx-slide" id="particle-text">
            <div className="vfx-canvas-container">
              {activeSlide === "particle-text" && <ParticleText />}
            </div>
          </section>

          <section className="vfx-slide" id="ascii">
            <div className="vfx-canvas-container">
              {activeSlide === "ascii" && <ASCII />}
            </div>
          </section>

          <section className="vfx-slide" id="grid">
            <div className="vfx-canvas-container">
              {activeSlide === "grid" && <CyberGrid />}
            </div>
          </section>

          <div className="vfx-nav">
            {[
              "matrix",
              "network",
              "parallax",
              "scramble",
              "particle-text",
              "ascii",
              "grid",
            ].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSlide === id ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background:
                    activeSlide === id
                      ? isWhiteBG
                        ? "#000"
                        : "#fff"
                      : isWhiteBG
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VFXMuseum;
