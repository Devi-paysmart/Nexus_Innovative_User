import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * LuxuryLogin — Sign-in page for a premium gifting house.
 *
 * Design system (v3 — "the gifting table") — unchanged from the original.
 * See design tokens below; the only functional addition here is a
 * "Create an Account" link/button beneath the form that routes to /register.
 *
 * Colors:
 *   --aubergine:  #1E0B2E  (deepest shadow in the scene, page base)
 *   --plum:       #3A1B4F  (card glass tint)
 *   --gold:       #CBA135  (ribbon / hardware gold)
 *   --gold-soft:  #EBD9A6  (candlelight highlight)
 *   --cream:      #F6F1E7  (primary text on dark)
 *   --rose:       #9C5C74  (secondary accent, echoes the rose bouquet)
 *
 * Type:
 *   Display / Logo -> "Playfair Display" (700/800/900)
 *   Labels / Copy  -> "Cormorant Garamond" (500/600, italic for captions)
 *   Inputs / UI    -> "Inter" (400/500)
 */

const BACKGROUND_IMAGE = "/Designer (2).png";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M3 6.5h18v11H3z" strokeLinejoin="round" />
      <path d="M3 7l9 6 9-6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.4 4.1M6.3 7.4A15.7 15.7 0 0 0 2.5 12S6 18.5 12 18.5a10.4 10.4 0 0 0 4.2-.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}

export default function LuxuryLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setStatus("error");
      setError("Please enter both your email and password.");
      return;
    }

    setStatus("loading");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const apiKey = import.meta.env.VITE_CLIENT_API_KEY || "";
      
      const response = await fetch(`${baseUrl}/api/v1/user/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Authentication failed.");
      }

      const data = await response.json();
      localStorage.setItem("nexus_token", data.access_token);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));

      setStatus("idle");
      navigate("/profile");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "We couldn't sign you in. Check your details and try again.");
    }
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-aubergine font-sans text-cream">
      {/* Full-bleed background photograph */}
      <img
        src={BACKGROUND_IMAGE}
        alt="A royal-purple gifting table with ribboned gift boxes, a perfume bottle, a gold watch, and roses, lit by candlelight"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-aubergine/80 via-aubergine/35 to-transparent md:from-aubergine/85 md:via-aubergine/20 md:to-transparent" />
      <div className="absolute inset-0 bg-aubergine/10" />

      {/* Content */}
      <div className="relative flex min-h-dvh items-center px-6 py-16 md:px-16 lg:px-24">
        <div className="w-full max-w-md animate-[fadeUp_0.7s_ease-out]">
          <div className="relative bg-transparent px-4 py-8 sm:px-6 sm:py-10">
            {/* Brand Logo */}
            <div className="mx-auto mb-6 flex justify-center">
              <img src="/logo.png" alt="Nexus Logo" className="h-16 w-auto object-contain" />
            </div>

            <h1 className="text-center font-display text-3xl font-bold tracking-tight text-cream drop-shadow-sm sm:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-3 text-center font-serifBody text-lg italic text-cream/80">
              Sign in to continue your collection
            </p>

            <div className="my-8 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-gold/50" />
              <span className="h-2 w-2 rotate-45 border border-gold/80" />
              <span className="h-px w-16 bg-gold/50" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block font-serifBody text-base font-medium tracking-wide text-gold-soft">
                  Email Address
                </label>
                <div className="group relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/80">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-cream/40 bg-transparent pl-12 pr-4 font-sans text-[16px] text-cream placeholder:text-cream/60 outline-none transition-colors duration-200 focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block font-serifBody text-base font-medium tracking-wide text-gold-soft">
                    Password
                  </label>
                  <a href="#forgot-password" className="font-sans text-xs uppercase tracking-wider text-gold/90 transition-colors hover:text-gold-soft">
                    Forgot?
                  </a>
                </div>
                <div className="group relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/80">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-cream/40 bg-transparent pl-12 pr-12 font-sans text-[16px] text-cream placeholder:text-cream/60 outline-none transition-colors duration-200 focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-cream/60 transition-colors hover:text-gold"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" aria-live="polite" className="font-sans text-sm text-[#F0A8B4]">
                  {error}
                </p>
              )}

              {/* Sign in */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative h-12 w-full overflow-hidden bg-gradient-to-r from-gold via-gold-soft to-gold font-sans text-sm font-semibold uppercase tracking-[0.2em] text-aubergine transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {status === "loading" ? "Signing In…" : "Sign In"}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
              </button>

              {/* Register — quiet, secondary action beneath the primary CTA */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="h-12 w-full rounded-xl border border-gold/50 bg-transparent font-sans text-sm font-medium uppercase tracking-[0.2em] text-gold-soft transition-colors duration-200 hover:border-gold hover:bg-gold/10 hover:text-gold-soft"
              >
                Create an Account
              </button>
            </form>

            <p className="mt-8 text-center font-serifBody text-base italic text-cream/70">
              New to the house?{" "}
              <Link to="/register" className="font-medium not-italic text-gold underline-offset-4 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: #F6F1E7 !important;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: #F6F1E7;
        }
      `}</style>
    </div>
  );
}