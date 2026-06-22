import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 24, className = "" }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = Array.from({ length: count }, () => {
      const el = document.createElement("span");
      el.className = "hero-particle pointer-events-none absolute rounded-full";
      el.style.cssText = `
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        background: ${Math.random() > 0.5 ? "rgba(212,175,55,0.4)" : "rgba(15,23,42,0.12)"};
        animation: particle-float ${Math.random() * 8 + 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
      `;
      container.appendChild(el);
      return el;
    });

    return () => particles.forEach((p) => p.remove());
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-[5] overflow-hidden ${className}`}
      aria-hidden
    />
  );
}
