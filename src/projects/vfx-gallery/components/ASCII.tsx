import React, { useEffect, useRef } from "react";

const ASCII: React.FC = () => {
  const containerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let A = 0;
    let B = 0;
    let animationFrameId: number;

    const renderASCII = () => {
      const b: string[] = [];
      const z: number[] = [];
      A += 0.04;
      B += 0.02;

      const cA = Math.cos(A),
        sA = Math.sin(A);
      const cB = Math.cos(B),
        sB = Math.sin(B);

      // Determine dimensions based on viewport to keep aspect ratio reasonable
      // Using a fixed grid logic but scaling the output
      const width = 80;
      const height = 40;

      for (let k = 0; k < width * height; k++) {
        b[k] = k % width === width - 1 ? "\n" : " ";
        z[k] = 0;
      }

      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j),
          st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const sp = Math.sin(i),
            cp = Math.cos(i);
          const h = ct + 2; // R1 + R2*cos(theta)
          const D = 1 / (sp * h * sA + st * cA + 5); // 1/(z+K2)
          const t = sp * h * cA - st * sA;

          // x, y projection
          const x = Math.floor(width / 2 + 30 * D * (cp * h * cB - t * sB));
          const y = Math.floor(height / 2 + 15 * D * (cp * h * sB + t * cB));

          const o = x + width * y;
          // Luminance calculation
          const N = Math.floor(
            8 *
              ((st * sA - sp * ct * cA) * cB -
                sp * ct * sA -
                st * cA -
                cp * ct * sB),
          );

          if (y >= 0 && y < height && x >= 0 && x < width && D > z[o]) {
            z[o] = D;
            // ASCII shading characters
            b[o] = ".,-~:;=!*#$@"[Math.max(0, N)];
          }
        }
      }

      container.innerHTML = b.join("");
      animationFrameId = requestAnimationFrame(renderASCII);
    };

    renderASCII();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <pre
        ref={containerRef}
        style={{
          fontFamily: '"JetBrains Mono", "Courier New", Courier, monospace',
          fontSize: "clamp(8px, 1.5vw, 16px)",
          lineHeight: "1",
          letterSpacing: "0.1em",
          fontWeight: "bold",
          margin: 0,
          color: "#ffb000", // Amber color
          textShadow: "0 0 5px rgba(255, 176, 0, 0.5)",
        }}
      />
    </div>
  );
};

export default ASCII;
