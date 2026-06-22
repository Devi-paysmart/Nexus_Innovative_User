import { useRef } from "react";

/**
 * useMagnetic
 * Gives an element a subtle "pull toward the cursor" effect on hover,
 * and snaps back to rest on mouse leave. Strength is intentionally
 * restrained — this should read as premium, not gimmicky.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return { ref, onMouseMove, onMouseLeave };
}
