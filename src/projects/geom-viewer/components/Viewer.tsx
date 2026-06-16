import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { shapes, orderedIds } from '../shapes';
import { project, project4D, draw } from '../utils/renderer';
import { ROTATION_SPEED, AUTO_ROTATION_SPEEDS, PERSPECTIVE } from '../constants';
import type { Geometry, ProjectedPoint } from '../types';

declare global {
  interface Window {
    katex: any;
  }
}

const Formula: React.FC<{ label: string; eq: string }> = ({ label, eq }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      window.katex.render(eq, containerRef.current, {
        throwOnError: false,
      });
    }
  }, [eq]);

  return (
    <div className="formula-item">
      <span className="formula-label">{label}</span>
      <div className="formula-render" ref={containerRef}>
        {eq}
      </div>
    </div>
  );
};

interface ViewerProps {
  id: string;
  onBack: () => void;
  onNavigate: (id: string) => void;
}

const Viewer: React.FC<ViewerProps> = ({ id: currentId, onBack, onNavigate }) => {
  const shape = useMemo(() => shapes[currentId], [currentId]);
  const [showInfo, setShowInfo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Animation state in a ref to avoid re-renders
  const animState = useRef({
    currentId: '',
    rotation: { x: 0.5, y: 0.5 },
    rotationTarget: { x: 0.5, y: 0.5 },
    autoAngles: { x: 0, y: 0, z: 0 },
    dynamicCounter: 0,
    angle4D: 0,
    lastTime: 0,
    isDragging: false,
    lastMousePos: { x: 0, y: 0 },
    shapeData: null as Geometry | null,
    lastGeneratedStep: -1,
  });

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const animate = useCallback((time: number) => {
    const s = animState.current;
    
    // Check if shape changed and reset state if needed
    if (s.currentId !== currentId) {
      s.currentId = currentId;
      s.dynamicCounter = 0;
      s.angle4D = 0;
      s.lastGeneratedStep = -1;
      const data = shape.generate(0);
      if (shape.hideVertices) data.hideVertices = true;
      s.shapeData = data;
    }

    if (s.lastTime === 0) s.lastTime = time;
    const deltaTime = time - s.lastTime;
    s.lastTime = time;

    if (deltaTime > 100) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    const dtFactor = deltaTime / 16.666;

    // Update rotation and angles
    if (!s.isDragging) {
      s.autoAngles.x += AUTO_ROTATION_SPEEDS.x * dtFactor;
      s.autoAngles.y += AUTO_ROTATION_SPEEDS.y * dtFactor;
      s.autoAngles.z += AUTO_ROTATION_SPEEDS.z * dtFactor;
      s.angle4D += 0.02 * dtFactor;
    }

    const lerpFactor = 1 - Math.pow(0.9, dtFactor);
    s.rotation.x += (s.rotationTarget.x - s.rotation.x) * lerpFactor;
    s.rotation.y += (s.rotationTarget.y - s.rotation.y) * lerpFactor;

    // Dynamic shape update
    if (shape?.isDynamic) {
      let next = s.dynamicCounter + (shape.step || 1) * dtFactor;
      if (shape.limit && next > shape.limit) next = shape.limit;
      s.dynamicCounter = next;
      
      const currentStep = Math.floor(next);
      if (currentStep !== s.lastGeneratedStep || shape.id === 'orrery') {
        const data = shape.generate(currentStep, { rotation: s.rotation });
        if (shape.hideVertices) data.hideVertices = true;
        s.shapeData = data;
        s.lastGeneratedStep = currentStep;
      }
    }

    // Render
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas && s.shapeData) {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(rect.width, rect.height) * 0.85;
      
      let verts = s.shapeData.vertices;
      if (shape?.is4D && s.shapeData.vertices4D) {
        verts = project4D(s.shapeData.vertices4D, s.angle4D);
      }

      if (verts) {
        const projected: ProjectedPoint[] = verts.map(v => 
          project(
            v,
            scale,
            s.rotation.x + s.autoAngles.x,
            s.rotation.y + s.autoAngles.y,
            s.autoAngles.z,
            PERSPECTIVE.fov,
            PERSPECTIVE.viewDist,
            rect.width,
            rect.height
          )
        );
        draw(ctx, s.shapeData, projected, rect.width, rect.height);
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [currentId, shape]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('#info-toggle, #content-section, .top-nav, .nav-controls')) return;
    
    const p = 'touches' in e ? e.touches[0] : e;
    animState.current.isDragging = true;
    animState.current.lastMousePos = { x: p.clientX, y: p.clientY };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!animState.current.isDragging) return;
    
    // Prevent default to avoid scrolling while dragging
    if (e.cancelable) e.preventDefault();

    const p = 'touches' in e ? e.touches[0] : e;
    const dx = p.clientX - animState.current.lastMousePos.x;
    const dy = p.clientY - animState.current.lastMousePos.y;
    animState.current.rotationTarget.x += dx * ROTATION_SPEED;
    animState.current.rotationTarget.y += dy * ROTATION_SPEED;
    animState.current.lastMousePos = { x: p.clientX, y: p.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    animState.current.isDragging = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const currentIndex = orderedIds.indexOf(currentId);
  const prevId = orderedIds[(currentIndex - 1 + orderedIds.length) % orderedIds.length];
  const nextId = orderedIds[(currentIndex + 1) % orderedIds.length];

  return (
    <div className="viewer-container">
      <div className="canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        />
      </div>

      <div id="ui-layer">
        <nav className="top-nav">
          <button onClick={onBack} className="back-link-btn">← Gallery</button>
        </nav>

        <div className="title-nav-container">
          <h1 id="shape-title">{shape?.title}</h1>
          <div className="nav-controls">
            <button 
              className="nav-btn" 
              onClick={() => onNavigate(prevId)}
            >
              ← prev
            </button>
            <button 
              className="nav-btn" 
              onClick={() => onNavigate(nextId)}
            >
              next →
            </button>
          </div>
        </div>

        <button 
          id="info-toggle" 
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Show Information"
        >
          <span className="icon">{showInfo ? '×' : 'i'}</span>
        </button>

        <section id="content-section" className={showInfo ? '' : 'hidden'}>
          <div className="info-overlay-content">
            <div className="info-block">
              <h3>Description</h3>
              <div id="shape-desc">
                {shape?.desc.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
            
            {shape?.formulas && shape.formulas.length > 0 && (
              <div className="info-block" id="formulas-block">
                <h3>Mathematical Background</h3>
                <div id="formula-list">
                  {shape.formulas.map((f, i) => (
                    <Formula key={i} label={f.label} eq={f.eq} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Viewer;
