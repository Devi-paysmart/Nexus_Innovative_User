import { useState, useEffect } from "react";
import { Quote, Sparkles } from "lucide-react";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";

export function TestimonialsPage() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  return (
    <PageTransition>
      <div className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gold/3 dark:bg-gold/2 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[35rem] h-[35rem] bg-gold-light/3 dark:bg-gold-light/2 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full px-8 lg:px-12 max-w-7xl mx-auto">
          {/* Header */}
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold-deep dark:text-gold rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={12} /> Testimonials
              </span>
              <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
                Client Success Stories
              </h1>
              <p className="mt-4 text-sm text-ink/65 dark:text-paper/65">
                Real feedback from real leaders. See how Nexus helps organizations transform corporate gifting into unforgettable moments.
              </p>
            </div>
          </SectionReveal>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <p className="font-display text-xl text-ink/40 animate-pulse">Loading story details...</p>
            </div>
          ) : videoUrl ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-12">
              {/* Left Column: Interactive Player card with border glow */}
              <SectionReveal delay={0.1} className="lg:col-span-7">
                <div className="overflow-hidden rounded-3xl bg-black border border-ink/10 dark:border-white/10 shadow-2xl relative group transition-all duration-500 hover:shadow-gold-glow/20">
                  <div className="absolute inset-0 border border-gold/15 rounded-3xl pointer-events-none group-hover:border-gold/30 transition-colors z-10" />
                  
                  <div className="aspect-video w-full relative">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover rounded-3xl"
                      playsInline
                    />
                  </div>
                </div>
              </SectionReveal>

              {/* Right Column: Case study content */}
              <SectionReveal delay={0.2} className="lg:col-span-5 flex flex-col justify-center">
                <Quote className="text-gold-deep/30 dark:text-gold/20 mb-4" size={44} />
                <blockquote className="font-display text-2xl leading-relaxed text-ink dark:text-paper lg:text-3xl font-medium">
                  "Nexus transformed our corporate gifting from a logistical headache into a brand showcase. Every hamper felt bespoke."
                </blockquote>
                
                <div className="mt-8 flex items-center gap-4 border-t border-ink/8 dark:border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center font-bold text-gold-deep dark:text-gold text-lg border border-gold/20">
                    PS
                  </div>
                  <div>
                    <p className="font-semibold text-ink dark:text-paper">Priya Sharma</p>
                    <p className="text-xs text-ink/50 dark:text-paper/50">
                      Head of HR, Fortune 500 IT Services
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-cloud/50 dark:bg-ink-soft/40 border border-ink/5 dark:border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink/40 dark:text-paper/40 mb-2">Key Outcome</h3>
                  <p className="text-sm text-ink/75 dark:text-paper/75 leading-relaxed">
                    By collaborating with Nexus, the company successfully automated seasonal corporate gifting across 6 major offices, boosting employee engagement scores by 18% with completely personalized gifts.
                  </p>
                </div>
              </SectionReveal>
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-ink/10 dark:border-white/10 rounded-3xl">
              <p className="text-ink/40 dark:text-paper/40 font-medium">No testimonials available at this moment.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
