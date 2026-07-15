import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";

export function PromotionalVideoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasShown = localStorage.getItem("nexus_promo_video_shown");
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark as shown in localStorage immediately so it doesn't open on page refresh
        localStorage.setItem("nexus_promo_video_shown", "true");
      }, 2000); // 4-second delay

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener("volumechange", handleVolumeChange);
    return () => {
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 md:p-6"
          onClick={handleClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl bg-black overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 rounded-full p-2.5 bg-black/60 text-white/80 hover:text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg border border-white/10 cursor-pointer"
              aria-label="Close promotional video"
            >
              <X size={20} />
            </button>

            {/* Custom Mute/Unmute Helper Overlay */}
            <button
              onClick={handleMuteToggle}
              className="absolute bottom-4 right-16 z-50 rounded-full p-2.5 bg-black/60 text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200 shadow-lg border border-white/10 cursor-pointer"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Video Player */}
            <video
              ref={videoRef}
              src="https://gzekphwepqxmytzrtask.supabase.co/storage/v1/object/public/promotional%20video/Nexus_Innovative_Promotional_Video_202607151405.mp4"
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
              controls
              playsInline
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
