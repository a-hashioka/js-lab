import { useState, useEffect } from 'react'
import Viewer from './components/Viewer'
import Gallery from './components/Gallery'
import './index.css'

type ViewMode = 'gallery' | 'viewer';

interface GeomViewerProps {
  onExit?: () => void;
}

function GeomViewer({ onExit }: GeomViewerProps) {
  const [view, setView] = useState<ViewMode>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('id')) return 'viewer';
    return 'gallery';
  });
  const [currentId, setCurrentId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'icosahedron';
  });

  const handleNavigate = (id: string) => {
    setCurrentId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
  };

  const handleSelectShape = (id: string) => {
    setView('viewer');
    handleNavigate(id);
  };

  const handleBackToGallery = () => {
    setView('gallery');
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
  };

  const handleBackToPortal = () => {
    onExit?.();
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      
      if (id) {
        setCurrentId(id);
        setView('viewer');
      } else {
        setView('gallery');
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
      <div className={view === 'gallery' ? '' : 'hidden'}>
        <Gallery 
          onSelectShape={handleSelectShape} 
          onBack={handleBackToPortal}
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

export default GeomViewer
