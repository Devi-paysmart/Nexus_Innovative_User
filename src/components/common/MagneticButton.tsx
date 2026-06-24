import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "../../hooks/useMagnetic";
import { cn } from "../../utils/cn";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "gold";
  className?: string;
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: MagneticButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>(0.25);

  const base =
    "relative inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-medium tracking-wide transition-transform duration-300 ease-out";

  const variants = {
    primary: "bg-ink text-paper shadow-luxe-sm hover:shadow-gold-glow",
    ghost:
      "border border-ink/15 text-ink dark:text-paper dark:border-paper/20 hover:border-gold-deep hover:text-gold-deep dark:hover:text-gold-light dark:hover:border-gold-light",
    gold: "bg-gold text-ink shadow-luxe-sm hover:bg-gold-deep hover:text-ink dark:bg-gold dark:text-ink dark:hover:bg-gold-light hover:shadow-gold-glow",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </motion.button>
  );
}
