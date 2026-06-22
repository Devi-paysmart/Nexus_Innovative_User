import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActions } from "../common/FloatingActions";
import { LuxuryCursor } from "../common/LuxuryCursor";

export function MainLayout({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LuxuryCursor />
      <AnimatePresence>{loading && <PremiumLoader />}</AnimatePresence>

      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold-deep to-gold-light"
      />

      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}

function PremiumLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          src="/logo.png"
          alt="Nexus Logo"
          className="h-20 lg:h-24 w-auto object-contain"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          className="mt-4 h-px w-full origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-xs uppercase tracking-[0.35em] text-paper/40"
      >
        Corporate Gifting
      </motion.p>
    </motion.div>
  );
}
