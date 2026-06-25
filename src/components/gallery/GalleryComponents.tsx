import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../../data/categories";
import { cn } from "../../utils/cn";

interface ImageCarouselProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ImageCarousel({ products, onSelect }: ImageCarouselProps) {
  const [active, setActive] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const current = products[active];

  const goTo = (index: number) => {
    if (index === active || !heroRef.current) return;
    gsap.to(heroRef.current, {
      opacity: 0,
      scale: 1.03,
      duration: 0.25,
      onComplete: () => {
        setActive(index);
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
        );
      },
    });
  };

  const prev = () => goTo(active === 0 ? products.length - 1 : active - 1);
  const next = () => goTo(active === products.length - 1 ? 0 : active + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active === 0 ? products.length - 1 : active - 1);
      if (e.key === "ArrowRight") goTo(active === products.length - 1 ? 0 : active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, products.length]);

  return (
    <div className="space-y-6">
      <div
        ref={heroRef}
        className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-3xl shadow-luxe"
        onClick={() => onSelect(current)}
      >
        <img src={current.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
        <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 text-sm text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ZoomIn size={16} /> View details
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-3 shadow-luxe-sm transition-transform hover:scale-105"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-3 shadow-luxe-sm transition-transform hover:scale-105"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            aria-label={`Show image ${i + 1}`}
            className={cn(
              "h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
              i === active ? "border-gold shadow-gold-glow" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img src={p.image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [product]);

  const list = product?.images && product.images.length > 0 ? product.images : (product ? [product.image] : []);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && list.length > 1) {
        handlePrev();
      } else if (e.key === "ArrowRight" && list.length > 1) {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose, index, list.length]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl shadow-luxe dark:glass-dark"
          >
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-t-3xl select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={index}
                  src={list[index]}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>

              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full bg-ink/60 p-2.5 text-paper backdrop-blur-sm hover:bg-ink/80 z-20 transition-colors"
              >
                <X size={18} />
              </button>

              {list.length > 1 && (
                <AnimatePresence>
                  {isHovered && (
                    <>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-3 text-ink shadow-luxe-sm transition-transform hover:scale-110 active:scale-95 z-20 hover:bg-white flex items-center justify-center cursor-pointer"
                      >
                        <ChevronLeft size={20} />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-3 text-ink shadow-luxe-sm transition-transform hover:scale-110 active:scale-95 z-20 hover:bg-white flex items-center justify-center cursor-pointer"
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>
              )}

              {list.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-ink/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {list.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all duration-300 cursor-pointer",
                        i === index ? "bg-gold scale-125" : "bg-paper/50"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="p-8 lg:p-10">
              <p className="eyebrow mb-3">Product</p>
              <h2 className="font-display text-3xl text-ink dark:text-paper lg:text-4xl">
                {product.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/65 dark:text-paper/65">
                {product.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(index === 0 ? images.length - 1 : index - 1);
      if (e.key === "ArrowRight") onNavigate(index === images.length - 1 ? 0 : index + 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(index === 0 ? images.length - 1 : index - 1); }}
        className="absolute left-4 rounded-full bg-paper/10 p-3 text-paper"
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(index === images.length - 1 ? 0 : index + 1); }}
        className="absolute right-4 rounded-full bg-paper/10 p-3 text-paper"
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-paper/10 p-2 text-paper"
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>
    </motion.div>
  );
}

interface ProductCardImageCarouselProps {
  images: string[];
  alt: string;
  onClick?: () => void;
  aspectClassName?: string;
}

export function ProductCardImageCarousel({
  images,
  alt,
  onClick,
  aspectClassName = "aspect-[4/3]",
}: ProductCardImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const list = images && images.length > 0 ? images : ["/sus-mug.jpg"];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={cn("relative overflow-hidden w-full select-none cursor-pointer", aspectClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={index}
          src={list[index]}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />

      {list.length > 1 && (
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-2 text-ink shadow-luxe-sm transition-transform hover:scale-110 active:scale-95 z-10 hover:bg-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft size={16} />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-2 text-ink shadow-luxe-sm transition-transform hover:scale-110 active:scale-95 z-10 hover:bg-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight size={16} />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      )}

      {list.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-ink/30 px-2 py-1 rounded-full backdrop-blur-sm">
          {list.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                i === index ? "bg-gold scale-125" : "bg-paper/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

