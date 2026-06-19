import React, { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  ease: number;
  friction: number;

  constructor(x: number, y: number, color: string, size: number) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.ease = 0.08;
    this.friction = 0.88;
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(dy, dx);
      this.vx -= Math.cos(angle) * force * 15;
      this.vy -= Math.sin(angle) * force * 15;
    }

    this.vx += (this.originX - this.x) * this.ease;
    this.vy += (this.originY - this.y) * this.ease;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

const ParticleText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const text = "ETHEREAL";
      ctx.fillStyle = "black";
      // Straight, simple font (Inter/Helvetica)
      ctx.font = '900 12vw "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.02em"; // Tightened letter spacing
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = [];

      // Calculate responsive values based on a base width of 1600px
      const scale = window.innerWidth / 1600;
      const gap = Math.max(2, Math.round(4 * scale));
      const particleSize = Math.max(1.2, 2.5 * scale);

      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const index = (y * canvas.width + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha > 128) {
            particles.push(new Particle(x, y, "#000", particleSize));
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handlePointerLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("touchend", handlePointerLeave);
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(mouse.current.x, mouse.current.y);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("touchend", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ display: "block", background: "#fff" }} />
  );
};

export default ParticleText;
