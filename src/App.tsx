import { useState, useEffect } from 'react'
import GeomViewer from './projects/geom-viewer'
import './App.css'

type ProjectId = 'none' | 'geom-viewer';

function App() {
  const [project, setProject] = useState<ProjectId>(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('project');
    if (p === 'geom-viewer') return 'geom-viewer';
    return 'none';
  });

  const handleSelectProject = (id: ProjectId) => {
    setProject(id);
    const url = new URL(window.location.href);
    if (id === 'none') {
      url.searchParams.delete('project');
      url.searchParams.delete('id');
    } else {
      url.searchParams.set('project', id);
    }
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('project');
      if (p === 'geom-viewer') {
        setProject('geom-viewer');
      } else {
        setProject('none');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (project === 'geom-viewer') {
    return <GeomViewer onExit={() => handleSelectProject('none')} />;
  }

  return (
    <div className="lab-container">
      <header className="lab-header">
        <h1>JS Lab</h1>
      </header>
      
      <main className="lab-main">
        <ul className="project-list">
          <li>
            <button className="project-link" onClick={() => handleSelectProject('geom-viewer')}>
              Geometry Viewer
            </button>
          </li>
        </ul>
      </main>
    </div>
  )
}

export default App
