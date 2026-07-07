import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { EnquiryModal } from "./EnquiryModal";

import whatsappLogo from "../../../logo/whatsapp-removebg-preview.png";

export function FloatingActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
            onClick={() => {
              const token = localStorage.getItem("nexus_token");
              if (!token) {
                navigate("/login");
              } else {
                setModalOpen(true);
              }
            }}
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


