import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface EnquiryModalProps {
  onClose: () => void;
}

export function EnquiryModal({ onClose }: EnquiryModalProps) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const API_KEY = import.meta.env.VITE_CLIENT_API_KEY || "";

    try {
      const payload = {
        category_id: 4,
        name: form.name,
        email: form.email,
        company_name: "Not Provided",
        mobile: form.mobile,
        city: "Not Provided",
        budget: "Not Provided",
        gifting_for: "Others",
        additional_information: form.message || "",
        quantity: 1,
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/user/products/category_enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Server error (${res.status})`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm outline-none transition-colors focus:border-gold-deep placeholder:text-ink/40";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-luxe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label="Close enquiry form"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <CheckCircle2 className="text-gold-deep" size={48} />
            <p className="mt-4 font-display text-2xl text-ink">Enquiry sent!</p>
            <p className="mt-2 text-sm text-ink/60">
              Our gifting consultants will reach out shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep transition-colors"
            >
              Close
            </button>
          </motion.div>
        ) : (
          <>
            <p className="eyebrow mb-2 text-gold-deep">LET'S TALK GIFTING</p>
            <h2 className="font-display text-2xl text-ink mb-6">Tell us what you need</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
                <input
                  name="mobile"
                  type="tel"
                  placeholder="Mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="Email ID"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <textarea
                name="message"
                placeholder="Your message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gold py-3.5 text-sm font-semibold text-ink transition-all hover:bg-gold-deep hover:shadow-gold-glow disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Submit Enquiry"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Wrapper that handles open/close state and AnimatePresence for convenience */
export function EnquiryModalTrigger({
  children,
}: {
  children: (open: () => void) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {children(() => setIsOpen(true))}
      <AnimatePresence>
        {isOpen && <EnquiryModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
