import React, { useEffect, useRef } from "react";

const phrases = [
  "SYSTEM ONLINE.",
  "TRANSMISSION RECEIVED.",
  "DECODING SEQUENCE...",
  "INTERRUPT DETECTED.",
  "RESTRUCTURING DATA.",
  "FRAGMENTED REALITY.",
  "AWAITING INPUT.",
  "EOF",
];

class TextScrambler {
  chars = "!<>-_\\/[]{}—=+*^?#________";
  resolve: (value: void | PromiseLike<void>) => void = () => {};
  frameRequest: number = 0;
  frame: number = 0;
  queue: {
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }[] = [];
  el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color: rgba(255, 255, 255, 0.8)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const TextScramble: React.FC = () => {
  const elRef = useRef<HTMLDivElement>(null);
  const scramblerRef = useRef<TextScrambler | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    scramblerRef.current = new TextScrambler(elRef.current);

    let counter = 0;
    const next = () => {
      scramblerRef.current?.setText(phrases[counter]).then(() => {
        setTimeout(next, 3000);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();

    return () => {
      if (scramblerRef.current) {
        cancelAnimationFrame(scramblerRef.current.frameRequest);
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        background: "#050505",
        fontFamily: "monospace",
        fontSize: "2rem",
        fontWeight: 300,
        letterSpacing: "0.2em",
        color: "#fff",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <div ref={elRef}></div>
    </div>
  );
};

export default TextScramble;
