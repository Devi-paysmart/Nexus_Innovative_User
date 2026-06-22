import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "../common/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

// Swap this for your own asset whenever it's ready — kept as the placeholder
// CloudFront URL for now per your call.
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  // Background video + particle layer
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load the new display typeface and remap the existing `font-display`
  // token to it. Doing this here keeps the change self-contained to this
  // component, but `font-display` is a shared class — for production this
  // font import + override belongs in your global stylesheet / tailwind
  // config instead, so every page (not just this one mount) gets it.
  useEffect(() => {
    const linkId = "font-fraunces-link";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..600&display=swap";
      document.head.appendChild(link);
    }

    const styleId = "font-display-override";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .font-display {
          font-family: "Fraunces", "Times New Roman", serif;
          font-optical-sizing: auto;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll(".word");
      if (words?.length) {
        gsap.fromTo(
          words,
          { y: 80, opacity: 0, rotateX: 40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            stagger: 0.07,
            ease: "power4.out",
            delay: 0.4,
          }
        );
      }

      if (sublineRef.current) {
        gsap.fromTo(
          sublineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 1.1 }
        );
      }

      if (sectionRef.current) {
        gsap.to(blob1Ref.current, {
          y: 80,
          x: 40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to(blob2Ref.current, {
          y: -60,
          x: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ===================== AMBIENT PARTICLES OVER THE LIVE VIDEO =====================
  // The video itself just plays on a loop via the autoPlay/loop attributes
  // below — no scroll-scrubbing, no frozen frames. This effect only drives
  // the drifting gold dust canvas layered on top of it.
  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    if (!particleCanvas) return;

    const pCtx = particleCanvas.getContext("2d");
    if (!pCtx) return;

    let particles: Particle[] = [];
    let cancelled = false;
    let particleRaf = 0;

    function resizeParticleCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = particleCanvas!.getBoundingClientRect();
      particleCanvas!.width = Math.round(rect.width * dpr);
      particleCanvas!.height = Math.round(rect.height * dpr);
      createParticles();
    }

    function createParticles() {
      particles = [];
      const count = Math.floor(
        (particleCanvas!.width * particleCanvas!.height) / 16000
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particleCanvas!.width,
          y: Math.random() * particleCanvas!.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.4 + 0.5,
          opacity: Math.random() * 0.45 + 0.15,
        });
      }
    }

    function animateParticles() {
      if (cancelled) return;
      pCtx!.clearRect(0, 0, particleCanvas!.width, particleCanvas!.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = particleCanvas!.width;
        if (p.x > particleCanvas!.width) p.x = 0;
        if (p.y < 0) p.y = particleCanvas!.height;
        if (p.y > particleCanvas!.height) p.y = 0;
        pCtx!.beginPath();
        pCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx!.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        pCtx!.fill();
      }
      particleRaf = requestAnimationFrame(animateParticles);
    }

    resizeParticleCanvas();
    window.addEventListener("resize", resizeParticleCanvas);
    particleRaf = requestAnimationFrame(animateParticles);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeParticleCanvas);
      cancelAnimationFrame(particleRaf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20 lg:pt-32"
      aria-label="Hero"
    >
      {/* Looping ambient video + gold dust, layered under the existing palette */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={VIDEO_URL}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />

        {/* Brand veil so headline/body copy stay legible over the footage */}
        <div className="absolute inset-0 bg-gradient-to-br from-cloud/85 via-paper/55 to-white/35 dark:from-ink/90 dark:via-ink-soft/70 dark:to-slate/55" />

        <div
          ref={blob1Ref}
          className="absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-transparent blur-3xl"
        />
        <div
          ref={blob2Ref}
          className="absolute -right-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-gradient-to-bl from-ink/[0.06] via-gold/5 to-transparent blur-3xl dark:from-gold/10"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08),transparent_60%)]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <canvas
          ref={particleCanvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      </div>

      <div className="mx-auto flex flex-col items-center justify-center text-center w-full max-w-4xl px-6 -mt-8 lg:-mt-16">
        {/* Copy */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="mb-5 h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent"
            aria-hidden="true"
          />

          <h1
            ref={headlineRef}
            className="font-display text-[2.75rem] leading-[0.98] tracking-tight sm:text-6xl lg:text-[4.25rem] text-center"
            style={{ perspective: "800px" }}
          >
            <span className="text-gold-deep dark:text-gold-light font-semibold italic">
              {("Premium").split(" ").map((w, i) => (
                <span key={`l1-pre-${i}`} className="word mr-[0.25em] inline-block">
                  {w}
                </span>
              ))}
            </span>
            <span className="text-ink/90 dark:text-paper/90 font-light italic">
              {("Corporate").split(" ").map((w, i) => (
                <span key={`l1-corp-${i}`} className="word mr-[0.25em] inline-block">
                  {w}
                </span>
              ))}
            </span>
            <span className="text-gold-deep dark:text-gold-light font-semibold italic">
              {("Gifts").split(" ").map((w, i) => (
                <span key={`l1-gift-${i}`} className="word mr-[0.25em] inline-block">
                  {w}
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={sublineRef}
            className="mt-6 max-w-2xl text-base leading-relaxed text-ink/60 dark:text-paper/60 sm:text-lg text-center"
          >
            From ₹1,000 utility gifts to ₹5 lakh executive hampers — we ensure
            gifting becomes strategic differentiation for your brand, not an
            outsourced function.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/collections">
              <MagneticButton variant="gold">
                Explore Collections <ArrowRight size={16} />
              </MagneticButton>
            </Link>
            <Link to="/contact">
              <MagneticButton variant="ghost">Request Catalogue</MagneticButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-ink/35 dark:text-paper/35">
            Scroll
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}