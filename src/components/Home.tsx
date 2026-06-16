import React from 'react';

interface HomeProps {
  onEnterGallery: () => void;
}

const Home: React.FC<HomeProps> = ({ onEnterGallery }) => {
  return (
    <main className="home-main">
      <header className="home-header">
        <h1>JS Lab</h1>
        <span className="subtitle">A collection of web experiments.</span>
      </header>
      <nav className="home-nav">
        <ul>
          <li>
            <button onClick={onEnterGallery} className="home-link-btn">
              Geometry Viewer
            </button>
          </li>
          {/* Future links can be added here */}
        </ul>
      </nav>
    </main>
  );
};

export default Home;
