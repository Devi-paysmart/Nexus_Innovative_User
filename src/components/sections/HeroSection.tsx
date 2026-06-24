
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "../common/MagneticButton";
import { FloatingParticles } from "../common/FloatingParticles";


gsap.registerPlugin(ScrollTrigger);




export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);
    const showcaseRef = useRef<HTMLDivElement>(null);
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);


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

            if (showcaseRef.current) {
                gsap.fromTo(
                    showcaseRef.current,
                    { scale: 0.92, opacity: 0, y: 40 },
                    { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.6 }
                );
            }

            if (sectionRef.current && showcaseRef.current) {
                gsap.to(showcaseRef.current, {
                    y: -60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.2,
                    },
                });

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



    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20 lg:pt-32"
            aria-label="Hero"
        >
            <FloatingParticles count={28} />

            {/* Animated gradient mesh */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-cloud via-paper to-white dark:from-ink dark:via-ink-soft dark:to-slate" />
                <div
                    ref={blob1Ref}
                    className="absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-gold/25 via-gold/10 to-transparent blur-3xl"
                />
                <div
                    ref={blob2Ref}
                    className="absolute -right-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-gradient-to-bl from-ink/[0.07] via-gold/5 to-transparent blur-3xl dark:from-gold/10"
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
            </div>

            <div className="mx-auto grid w-full max-w-[95rem] items-center gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 -mt-8 lg:-mt-16">
                {/* Copy — LEFT */}
                <div className="relative z-10 lg:self-start lg:pt-50">
                    <div
                        className="mb-5 h-px w-12 bg-gradient-to-r from-gold via-gold/50 to-transparent"
                        aria-hidden="true"
                    />

                    <h1
                        ref={headlineRef}
                        className="font-display text-[2.75rem] leading-[0.98] tracking-tight sm:text-6xl lg:text-[4.25rem]"
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
                        className="mt-6 max-w-lg text-base leading-relaxed text-ink/60 dark:text-paper/60 sm:text-lg"
                    >
                        From ₹1,000 utility gifts to premium executive hampers — we ensure
                        gifting becomes strategic differentiation for your brand, not an
                        outsourced function.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <Link to="/collections">
                            <MagneticButton variant="gold">
                                Explore Collections <ArrowRight size={16} />
                            </MagneticButton>
                        </Link>
                        {/* <Link to="/contact">
                            <MagneticButton variant="ghost">Request Catalogue</MagneticButton>
                        </Link> */}
                    </motion.div>
                </div>

                {/* Premium 3D sculpture with reflection — RIGHT */}
                <div ref={showcaseRef} className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center lg:max-w-4xl">
                    {/* Main image container */}
                    <div className="relative z-10 w-full flex justify-center">
                        <img
                            src="/a457e9573b279691b20cd59500dfa37b-removebg-preview.png"
                            alt="Premium Corporate Gift"
                            className="mx-auto h-auto w-full max-w-[460px] sm:max-w-[580px] lg:max-w-[760px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
                            loading="eager"
                        />
                        {/* Ambient glow */}
                        <div className="absolute inset-x-8 bottom-0 top-1/4 -z-10 rounded-full bg-gradient-to-t from-gold/25 via-gold/10 to-transparent blur-3xl" />
                        
                        {/* Rotating luxury rings behind the image */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute left-1/2 top-1/2 -z-20 h-[32rem] w-[32rem] lg:h-[38rem] lg:w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15 opacity-50 dark:border-gold/25"
                            style={{
                                maskImage: "radial-gradient(circle, transparent 40%, black 100%)",
                                WebkitMaskImage: "radial-gradient(circle, transparent 40%, black 100%)",
                            }}
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                            className="absolute left-1/2 top-1/2 -z-20 h-[38rem] w-[38rem] lg:h-[48rem] lg:w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/10 opacity-30 dark:border-gold/20"
                        />
                    </div>

                    {/* Static Contact Shadow on the Floor */}
                    <div className="mx-auto -mt-6 h-3 w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[580px] rounded-full bg-gradient-to-r from-gold-deep/20 via-black/60 to-gold-deep/20 dark:via-black/80 blur-md z-0" />

                    {/* Reflection */}
                    <div className="relative -mt-2 h-[240px] w-full overflow-hidden" aria-hidden="true">
                        <img
                            src="/a457e9573b279691b20cd59500dfa37b-removebg-preview.png"
                            alt=""
                            className="mx-auto h-auto w-full max-w-[460px] sm:max-w-[580px] lg:max-w-[760px] opacity-20 blur-[3px]"
                            style={{
                                transform: "scaleY(-1)",
                                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 60%)",
                                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 60%)",
                            }}
                        />
                    </div>

                    {/* Reflective floor line */}
                    <div className="mx-auto -mt-2 h-px w-11/12 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
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
