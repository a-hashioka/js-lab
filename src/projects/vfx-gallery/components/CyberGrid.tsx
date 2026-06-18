import React, { useEffect, useRef } from "react";

const CyberGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let speed = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const animate = () => {
      // Clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Camera settings
      const horizon = canvas.height * 0.55;
      const fov = 250;

      // Speed update
      speed += 2.4;
      const gridSpacing = 40;
      const maxZ = 800;

      ctx.save();

      // 1. Horizontal lines (moving from back to front)
      let zStart = gridSpacing - (speed % gridSpacing);
      for (let z = zStart; z < maxZ; z += gridSpacing) {
        const y = horizon + (fov * 150) / z;

        if (y > canvas.height) continue;

        const alpha = 1 - z / maxZ;
        ctx.strokeStyle = `rgba(255, 0, 128, ${alpha * 0.8})`; // Neon Pink
        ctx.lineWidth = (1 - z / maxZ) * 2 + 0.5;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Vertical lines (radiating from center)
      const centerX = canvas.width / 2;
      const numVerticalLines = 30;

      for (let i = -numVerticalLines; i <= numVerticalLines; i++) {
        const x3d = i * gridSpacing * 1.5;

        const zFar = maxZ;
        const xFar = centerX + (x3d * fov) / zFar;
        const yFar = horizon + (fov * 150) / zFar;

        const zNear = gridSpacing - (speed % gridSpacing);
        const xNear = centerX + (x3d * fov) / zNear;
        const yNear = horizon + (fov * 150) / zNear;

        const grad = ctx.createLinearGradient(0, yFar, 0, canvas.height);
        grad.addColorStop(0, "rgba(0, 255, 255, 0.1)"); // Cyan back
        grad.addColorStop(1, "rgba(0, 255, 255, 0.9)"); // Cyan front

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(xFar, yFar);
        ctx.lineTo(xNear, yNear);
        ctx.stroke();
      }

      ctx.restore();

      // Horizon mask (Sunset feel)
      ctx.fillStyle = "rgba(20, 5, 38, 0.4)";
      ctx.fillRect(0, 0, canvas.width, horizon);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #140526 0%, #05010d 100%)",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default CyberGrid;
