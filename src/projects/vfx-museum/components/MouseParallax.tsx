import React, { useState, useEffect, useMemo } from 'react';

const MouseParallax: React.FC = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
    }));
  }, []);

  const lights = useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      size: Math.random() * 300 + 200,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * -20,
    }));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0d001a, #020208)",
        position: "relative",
      }}
    >
      {/* 1. Star Layer (Background) */}
      <div
        style={{
          position: "absolute",
          width: "110%",
          height: "110%",
          transform: `translate(${-offset.x * 10}px, ${-offset.y * 10}px)`,
          pointerEvents: "none",
          transition: "transform 0.1s ease-out",
        }}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              background: "#fff",
              borderRadius: "50%",
              width: star.size + "px",
              height: star.size + "px",
              left: star.x + "%",
              top: star.y + "%",
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* 2. Central Design Name */}
      <div
        style={{
          position: "absolute",
          width: "110%",
          height: "110%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `translate(${-offset.x * 30}px, ${-offset.y * 30}px)`,
          pointerEvents: "none",
          zIndex: 10,
          transition: "transform 0.1s ease-out",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "10vw",
            margin: 0,
            textShadow: "0 0 30px #ff00ff, 0 0 10px #00ffff",
            fontWeight: "bold",
            letterSpacing: "0.15em",
          }}
        >
          PARALLAX
        </h1>
      </div>

      {/* 3. Light Layer (Foreground) */}
      <div
        style={{
          position: "absolute",
          width: "110%",
          height: "110%",
          transform: `translate(${-offset.x * 60}px, ${-offset.y * 60}px)`,
          pointerEvents: "none",
          transition: "transform 0.1s ease-out",
        }}
      >
        {lights.map((light, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              background: "radial-gradient(circle, rgba(255,0,128,0.12) 0%, rgba(0,0,0,0) 70%)",
              width: light.size + "px",
              height: light.size + "px",
              left: light.baseX + "%",
              top: light.baseY + "%",
              animation: `vfx-float ${light.duration}s ease-in-out ${light.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MouseParallax;
