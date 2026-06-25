import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MagneticButton } from "./MagneticButton";
import { useLocation } from "react-router-dom";

import whatsappLogo from "../../../logo/whatsapp-removebg-preview.png";

const enquirySchema = z.object({
  name: z.string().min(2, "Enter your full name").regex(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string().email("Enter a valid email"),
  notes: z.string().optional(),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

export function FloatingActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const shouldHideEnquireButton =
    (location.pathname.startsWith("/collections/") && location.pathname !== "/collections") ||
    location.pathname === "/contact" ||
    location.pathname === "/cart";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <a
          href="https://wa.me/919884040777?text=Hi%2C%20I%20want%20to%20know%20more%20about%20corporate%20gifting"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-2 text-white shadow-luxe-sm transition-transform hover:scale-105"
        >
          <img src={whatsappLogo} alt="WhatsApp" className="h-8 w-8 object-contain" />
        </a>

        {!shouldHideEnquireButton && (
          <motion.button
            aria-label="Open enquiry form"
            onClick={() => setModalOpen(true)}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 rounded-full bg-gold text-ink px-5 py-3.5 text-sm font-medium transition-all hover:bg-gold-deep dark:hover:bg-gold-light hover:shadow-gold-glow cursor-pointer shadow-luxe-sm"
          >
            <Mail size={16} className="text-ink" />
            Enquire
          </motion.button>
        )}
      </div>

      <AnimatePresence>{modalOpen && <EnquiryModal onClose={() => setModalOpen(false)} />}</AnimatePresence>
    </>
  );
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryForm>({ resolver: zodResolver(enquirySchema) });

  const onSubmit = async (data: EnquiryForm) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        message: data.notes || "",
      };

      const response = await fetch(
        `${API_BASE_URL}/api/v1/user/enquiries/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `Server Error (${response.status})`
        );
      }

      const result = await response.json();
      console.log("Enquiry Created:", result);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-deep placeholder:text-ink/40 dark:border-paper/15 dark:bg-paper/5 dark:text-paper dark:placeholder:text-paper/40";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="glass dark:glass-dark max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-8 shadow-luxe"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="eyebrow mb-2">Let's talk gifting</p>
            <h3 className="font-display text-2xl text-ink dark:text-paper">Tell us what you need</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-ink dark:text-paper hover:bg-ink/5 dark:hover:bg-paper/10">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <CheckCircle2 className="text-gold-deep" size={40} />
            <p className="font-display text-xl text-ink dark:text-paper">Enquiry Accepted</p>
            <p className="max-w-xs text-sm text-ink/60 dark:text-paper/60">
              Our gifting consultants will reach out shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <input
                type="text"
                className={inputClass}
                placeholder="Full name"
                {...register("name")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                }}
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input
                type="tel"
                maxLength={10}
                className={inputClass}
                placeholder="Mobile number"
                {...register("mobile")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
              />
              {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input type="email" className={inputClass} placeholder="Email ID" {...register("email")} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div className="col-span-2">
              <textarea
                className={inputClass}
                rows={3}
                placeholder="Your message"
                {...register("notes")}
              />
            </div>

            <div className="col-span-2 mt-2">
              <MagneticButton type="submit" className="w-full justify-center !bg-gold-deep !text-ink hover:!bg-gold hover:!shadow-gold-glow">
                {isSubmitting ? "Sending…" : "Submit Enquiry"}
              </MagneticButton>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

