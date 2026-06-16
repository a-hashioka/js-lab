import { useState, useEffect } from 'react'
import Home from './components/Home'
import Viewer from './components/Viewer'
import Gallery from './components/Gallery'
import './App.css'

type ViewMode = 'home' | 'gallery' | 'viewer';

function App() {
  const [view, setView] = useState<ViewMode>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('id')) return 'viewer';
    if (params.get('view') === 'gallery') return 'gallery';
    return 'home';
  });
  const [currentId, setCurrentId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'icosahedron';
  });

  const handleNavigate = (id: string) => {
    setCurrentId(id);
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
  };

  const handleSelectShape = (id: string) => {
    setView('viewer');
    handleNavigate(id);
  };

  const handleEnterGallery = () => {
    setView('gallery');
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'gallery');
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
  };

  const handleBackToGallery = () => {
    handleEnterGallery();
  };

  const handleBackToHome = () => {
    setView('home');
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const viewParam = params.get('view');
      
      if (id) {
        setCurrentId(id);
        setView('viewer');
      } else if (viewParam === 'gallery') {
        setView('gallery');
      } else {
        setView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let title = 'JS Lab';
    if (view === 'gallery') title = 'Geometry Gallery';
    if (view === 'viewer') title = 'Geometry Visualizer';
    document.title = title;
  }, [view]);

  return (
    <div className="App">
      {view === 'home' && <Home onEnterGallery={handleEnterGallery} />}
      
      <div className={view === 'gallery' ? '' : 'hidden'}>
        <Gallery 
          onSelectShape={handleSelectShape} 
          onBack={handleBackToHome}
        />
      </div>

      {view === 'viewer' && (
        <Viewer 
          id={currentId} 
          onBack={handleBackToGallery} 
          onNavigate={handleNavigate} 
        />
      )}
    </div>
  )
}

export default App
