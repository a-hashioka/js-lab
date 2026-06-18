import React from "react";

interface GalleryProps {
  onSelectVFX: (id: string) => void;
  onBack: () => void;
}

const vfxItems = [
  { id: "matrix", name: "Stream", desc: "Terminal-style digital rain" },
  { id: "network", name: "Neural", desc: "Minimalist particle nodes" },
  { id: "parallax", name: "Parallax", desc: "Scenic spatial depth" },
  { id: "scramble", name: "Signal", desc: "Abstract text decoding" },
  { id: "particle-text", name: "Ethereal", desc: "Geometric particle forms" },
  { id: "ascii", name: "ASCII", desc: "Classic 3D text rendering" },
  { id: "grid", name: "Grid", desc: "80s Synthwave aesthetic" },
];

const Gallery: React.FC<GalleryProps> = ({ onSelectVFX, onBack }) => {
  return (
    <main className="vfx-gallery-main">
      <nav className="vfx-top-nav">
        <button onClick={onBack} className="vfx-back-btn">
          Back to JS Lab
        </button>
      </nav>
      <header className="vfx-gallery-header">
        <h1>VFX Museum</h1>
        <p>A collection of legendary visual effects.</p>
      </header>
      <div className="vfx-gallery-grid">
        {vfxItems.map((item) => (
          <button
            key={item.id}
            className="vfx-card"
            onClick={() => onSelectVFX(item.id)}
          >
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
          </button>
        ))}
      </div>
    </main>
  );
};

export default Gallery;
