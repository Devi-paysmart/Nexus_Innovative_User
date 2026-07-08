import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { SectionReveal } from "../common/SectionReveal";

export function TestimonialPreview() {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const fetchVideo = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
      const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/products/testimonial_video`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY || "",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setVideoUrl(data.publicUrl || "");
        }
      } catch (err) {
        console.error("Failed to load testimonial video:", err);
      }
    };
    fetchVideo();
  }, []);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-cloud/50 dark:bg-ink-soft/20">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold/5 dark:bg-gold/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-gold-light/5 dark:bg-gold-light/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-8 lg:px-12 relative">
        <SectionReveal>
          <div className="mb-16 text-center">
            <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold-deep dark:text-gold rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={12} /> Success Stories
            </span>
            <h2 className="font-display text-4xl text-ink dark:text-paper lg:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-sm text-ink/65 dark:text-paper/65 max-w-xl mx-auto">
              Discover how leading companies trust Nexus to build premium corporate relationships.
            </p>
          </div>
        </SectionReveal>

        {videoUrl ? (
          <SectionReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Quote and Meta */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="text-7xl font-serif text-gold-deep/20 dark:text-gold/15 select-none leading-none -mb-4">
                  “
                </span>
                <blockquote className="font-display text-2xl leading-relaxed text-ink dark:text-paper lg:text-3xl font-medium">
                  Nexus transformed our corporate gifting from a logistical headache into a brand showcase. Every hamper felt bespoke.
                </blockquote>
                <div className="mt-8 flex items-center gap-4 border-t border-ink/8 dark:border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center font-bold text-gold-deep dark:text-gold text-lg border border-gold/20">
                    PS
                  </div>
                  <div>
                    <p className="font-medium text-ink dark:text-paper">Priya Sharma</p>
                    <p className="text-xs text-ink/50 dark:text-paper/50">
                      Head of HR, Fortune 500 IT Services
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Video Mockup */}
              <div className="lg:col-span-7">
                <div className="relative group overflow-hidden rounded-3xl bg-black border border-ink/10 dark:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-gold-glow/20">
                  {/* Decorative corner glows */}
                  <div className="absolute inset-0 border border-gold/10 rounded-3xl pointer-events-none group-hover:border-gold/30 transition-colors" />
                  
                  <div className="aspect-video w-full relative">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover rounded-3xl"
                      playsInline
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        ) : (
          <div className="text-center py-12">
            <p className="text-ink/40 dark:text-paper/40 font-medium">Loading stories...</p>
          </div>
        )}

        <SectionReveal delay={0.2}>
          <div className="mt-16 text-center">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-deep hover:text-gold hover:underline transition-colors group cursor-pointer"
            >
              Explore all video stories 
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
