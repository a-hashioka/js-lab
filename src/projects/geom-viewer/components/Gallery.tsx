import React from 'react';
import { disciplines, shapes } from '../shapes';

interface GalleryProps {
  onSelectShape: (id: string) => void;
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onSelectShape, onBack }) => {
  return (
    <main className="gallery-main">
      <nav className="top-nav">
        <button onClick={onBack} className="back-link-btn">Back to JS Lab</button>
      </nav>
      <header className="gallery-header">
        <h1>Geometry Gallery</h1>
      </header>
      <div id="gallery-container">
        {disciplines.map((discipline) => (
          <section key={discipline.id} className="discipline-section">
            <div className="discipline-header">
              <h2>{discipline.name}</h2>
              <p className="discipline-desc">{discipline.desc}</p>
            </div>

            {discipline.groups.map((group, idx) => (
              <div key={idx} className="group-container">
                <h3 className="group-title">{group.name}</h3>
                <ul className="shape-list">
                  {group.shapes.map((id) => {
                    const shape = shapes[id];
                    if (!shape) return null;
                    return (
                      <li key={id}>
                        <button 
                          className="shape-link-btn" 
                          onClick={() => onSelectShape(id)}
                        >
                          {shape.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
};

export default Gallery;
