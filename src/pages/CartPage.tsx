import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Send, X, CheckCircle2, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../context/CartContext";
import { PageTransition } from "../components/common/PageTransition";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomDropdown } from "../components/common/CustomDropdown";
import { EnquiryPDFTemplate, type EnquiryPDFData } from "../components/common/EnquiryPDFTemplate";
import { supabase } from "../supabase";

const enquirySchema = z.object({
  company: z.string().min(2, "Enter your company name"),
  city: z.string().min(2, "Enter your city").regex(/^[A-Za-z\s]+$/, "City name must contain only alphabetic characters"),
  budget: z.string().min(1, "Enter a budget amount").regex(/^₹\s\d+$/, "Enter a valid budget amount"),
  giftingFor: z.string().min(1, "Tell us who this is for"),
  quantity: z.string().min(1, "Enter an approximate quantity"),
  notes: z.string().optional(),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const handleEnquireClick = () => {
    const token = localStorage.getItem("nexus_token");
    if (!token) {
      navigate("/login");
    } else {
      setEnquiryOpen(true);
    }
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            to="/collections"
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink/50 hover:text-gold-deep dark:text-paper/50"
          >
            <ArrowLeft size={16} /> Continue shopping
          </Link>

          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gold/10 pb-8">
            <div>
              <p className="eyebrow mb-3">Your selection</p>
              <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-5xl">
                Gift Cart
              </h1>
              <p className="mt-3 text-ink/60 dark:text-paper/60">
                {totalItems === 0
                  ? "Your cart is empty"
                  : `${totalItems} item${totalItems > 1 ? "s" : ""} selected`}
              </p>
            </div>
            {items.length > 0 && (
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink/15 dark:border-paper/15 px-5 py-3 text-sm font-medium text-ink/70 dark:text-paper/70 transition-all hover:border-red-400 hover:text-red-500 dark:hover:border-red-400 dark:hover:text-red-400"
                >
                  <Trash2 size={15} /> Clear all
                </button>
                <button
                  onClick={handleEnquireClick}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold text-ink px-6 py-3.5 text-sm font-medium transition-all hover:bg-gold-deep dark:hover:bg-gold-light hover:shadow-gold-glow cursor-pointer shadow-luxe-sm"
                >
                  <Send size={15} /> Enquire Now
                </button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
                <ShoppingBag size={40} className="text-gold-deep" />
              </div>
              <h2 className="font-display text-2xl text-ink dark:text-paper">
                Your cart is empty
              </h2>
              <p className="mt-3 max-w-sm text-ink/55 dark:text-paper/55">
                Browse our premium collections and add products to start building your corporate gifting order.
              </p>
              <Link
                to="/collections"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold text-ink px-8 py-4 text-sm font-medium transition-all hover:bg-gold-deep hover:shadow-gold-glow shadow-luxe-sm"
              >
                Explore Collections
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex flex-col sm:flex-row gap-5 rounded-3xl bg-cloud dark:bg-ink-soft p-4 shadow-luxe-sm transition-transform hover:-translate-y-0.5"
                  >
                    <div className="h-36 w-full sm:w-44 flex-shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-3 py-1">
                      <div>
                        <h3 className="font-display text-lg text-ink dark:text-paper lg:text-xl">
                          {item.product.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink/60 dark:text-paper/60 line-clamp-2">
                          {item.product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 dark:bg-paper/10 text-ink/70 dark:text-paper/70 transition-colors hover:bg-gold/20 hover:text-gold-deep"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="flex h-9 min-w-[2.5rem] items-center justify-center rounded-xl bg-ink/5 dark:bg-paper/10 px-3 text-sm font-medium text-ink dark:text-paper">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 dark:bg-paper/10 text-ink/70 dark:text-paper/70 transition-colors hover:bg-gold/20 hover:text-gold-deep"
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/40 dark:text-paper/40 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Bottom enquire bar */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-gold/10 via-gold/5 to-transparent dark:from-gold/15 dark:via-gold/5 p-6 lg:p-8">
                <div>
                  <h3 className="font-display text-xl text-ink dark:text-paper">
                    Ready to order?
                  </h3>
                  <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">
                    Submit an enquiry and our team will prepare a detailed quote for you.
                  </p>
                </div>
                <button
                  onClick={handleEnquireClick}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold text-ink px-8 py-4 text-sm font-medium transition-all hover:bg-gold-deep dark:hover:bg-gold-light hover:shadow-gold-glow cursor-pointer shadow-luxe-sm flex-shrink-0"
                >
                  <Send size={16} /> Enquire Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {enquiryOpen && (
          <CartEnquiryModal
            onClose={() => setEnquiryOpen(false)}
            cartItems={items}
            clearCart={clearCart}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

export function CartEnquiryModal({
  onClose,
  cartItems,
  clearCart,
}: {
  onClose: () => void;
  cartItems: CartItem[];
  clearCart: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [enquiryData, setEnquiryData] = useState<EnquiryPDFData | null>(null);
  const [profile, setProfile] = useState<{ name: string; email: string; phone: string } | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("nexus_token");
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/user/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setProfile({
              name: data.profile.name || "",
              email: data.profile.email || "",
              phone: data.profile.phone || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile in CartEnquiryModal:", err);
      }
    };

    fetchProfile();
  }, [API_BASE_URL]);

  // Load html2pdf from CDN
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => setIsLibraryLoaded(true);
    script.onerror = () => console.error("Failed to load html2pdf library");
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        console.error("Error removing script:", e);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryForm>({ resolver: zodResolver(enquirySchema) });

  const giftingForValue = watch("giftingFor") || "";
  const quantityValue = watch("quantity") || "";

  const downloadPDF = async () => {
    try {
      const filename = enquiryData?.enquiryId
        ? `Enquiry_${enquiryData.enquiryId}.pdf`
        : `Enquiry_${Date.now()}.pdf`;

      // Get the public URL from Supabase
      const { data } = supabase.storage
        .from("enquiry-pdfs")
        .getPublicUrl(`enquiries/${filename}`);

      if (data?.publicUrl) {
        // Open or download the PDF
        window.open(data.publicUrl, "_blank");
      } else {
        alert("PDF not found. Please try again.");
      }
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const onSubmit = async (data: EnquiryForm) => {
    try {
      const token = localStorage.getItem("nexus_token");
      const itemsPayload = cartItems.map((item) => ({
        product_id: Number(item.product.id),
        quantity: Number(item.quantity),
      }));

      const payload = {
        items: itemsPayload,
        company_name: data.company,
        city: data.city,
        budget: data.budget,
        gifting_for: data.giftingFor,
        additional_information: [
          data.notes ? `Notes: ${data.notes}` : "",
          `Quantity option: ${data.quantity}`
        ].filter(Boolean).join("\n")
      };

      const response = await fetch(
        `${API_BASE_URL}/api/v1/user/products/product_enquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`,
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

      const resData = await response.json().catch(() => null);
      const enquiryCode = resData?.enquiry_code || "";

      // Set enquiry data for PDF
      const pdfData: EnquiryPDFData = {
        enquiryId: enquiryCode,
        name: profile?.name || "Valued Customer",
        email: profile?.email || "",
        company: data.company,
        mobile: profile?.phone || "N/A",
        city: data.city,
        budget: data.budget,
        giftingFor: data.giftingFor,
        quantity: data.quantity,
        notes: data.notes,
        items: cartItems,
        submittedDate: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setEnquiryData(pdfData);
      setSubmitted(true);
      clearCart();

      // Automatically generate and upload PDF after enquiry submission
      setTimeout(() => {
        generateAndUploadPDF(pdfData, enquiryCode);
      }, 500);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const generateAndUploadPDF = async (pdfData: EnquiryPDFData, enquiryCode: string) => {
    try {
      const element = document.getElementById("enquiry-pdf-content");
      if (!element) {
        console.error("PDF element not found");
        return;
      }

      console.log("Starting PDF generation for enquiry:", enquiryCode);

      const filename = `Enquiry_${enquiryCode}.pdf`;

      const opt = {
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          onclone: (clonedDoc: Document) => {
            Array.from(clonedDoc.getElementsByTagName("style")).forEach((el) => {
              try {
                let css = el.innerHTML;
                if (css.includes("oklch")) {
                  css = css.replace(/oklch\([^)]+\)/g, "#cca028");
                  el.innerHTML = css;
                }
              } catch (e) {
                console.error("Error cleaning style tag:", e);
              }
            });
          }
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        }
      };

      // Generate PDF
      const worker = window.html2pdf().set(opt).from(element);
      const pdf = (await worker.toPdf().get("pdf")) as any;

      // Convert PDF to Blob
      const blob = pdf.output("blob");
      console.log("PDF generated successfully, size:", blob.size, "bytes");

      // Upload to Supabase Storage
      console.log("Uploading to Supabase bucket: enquiry-pdfs, path: enquiries/" + filename);
      const { error, data: uploadData } = await supabase.storage
        .from("enquiry-pdfs")
        .upload(`enquiries/${filename}`, blob, {
          contentType: "application/pdf",
          upsert: true
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return;
      }

      console.log("Upload successful:", uploadData);

      // Get Public URL
      const { data } = supabase.storage
        .from("enquiry-pdfs")
        .getPublicUrl(`enquiries/${filename}`);

      const pdfUrl = data.publicUrl;
      console.log("PDF public URL:", pdfUrl);

      // Update backend with PDF URL
      const token = localStorage.getItem("nexus_token");
      if (token) {
        console.log("Updating database for enquiry_code:", enquiryCode);
        const updateResponse = await fetch(
          `${API_BASE_URL}/api/v1/user/enquiries/update-pdf`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              enquiry_code: enquiryCode,
              enquire_pdf: pdfUrl
            })
          }
        );

        const responseData = await updateResponse.json().catch(() => null);
        if (updateResponse.ok) {
          console.log("Database updated successfully with PDF URL");
          console.log("Enquiry ID:", enquiryCode, "- PDF URL stored:", pdfUrl);
        } else {
          console.error("Failed to update database. Response:", responseData);
        }
      } else {
        console.error("No authentication token found");
      }
    } catch (err) {
      console.error("PDF generation/upload error:", err);
    }
  };

  const modalInputClass =
    "w-full rounded-xl border border-black/15 bg-[#c2c3c8] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#cca028] placeholder:text-[#5f6368]";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[32px] p-10 bg-[#d1d2d6] border border-white/20 shadow-2xl relative text-[#0f172a]"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="eyebrow mb-2 text-[#cca028] dark:text-[#cca028]">Cart Enquiry</p>
            <h3 className="font-display text-3xl font-semibold text-[#0f172a] dark:text-[#0f172a] tracking-tight">
              Get a quote
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#0f172a] hover:opacity-70 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart summary */}
        {!submitted && (
          <div className="mb-5 rounded-2xl bg-[#c7c8cd] border border-black/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#cca028]">
              Products selected
            </p>
            <ul className="space-y-1">
              {cartItems.map((item, i) => (
                <li key={i} className="text-sm text-[#0f172a] font-medium">
                  • {item.product.title} (x{item.quantity})
                </li>
              ))}
            </ul>
          </div>
        )}

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <CheckCircle2 className="text-[#cca028]" size={40} />
            <p className="font-display text-xl text-[#0f172a] dark:text-[#0f172a]">
              Enquiry Accepted
            </p>
            <p className="max-w-xs text-sm text-[#0f172a]/70 dark:text-[#0f172a]/70">
              Our gifting consultants will reach out shortly.
            </p>
            {isLibraryLoaded && enquiryData && (
              <button
                onClick={downloadPDF}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#cca028] text-[#0f172a] px-6 py-3 text-sm font-medium transition-all hover:bg-[#d5a82c] shadow-md"
              >
                <Download size={16} /> Download Enquiry PDF
              </button>
            )}
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 sm:col-span-1">
              <input
                type="text"
                className={modalInputClass}
                placeholder="Company name"
                {...register("company")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^A-Za-z0-9\s]/g,
                    ""
                  );
                }}
              />
              {errors.company && (
                <p className={errorClass}>{errors.company.message}</p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input
                type="text"
                className={modalInputClass}
                placeholder="City"
                {...register("city")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  );
                }}
              />
              {errors.city && (
                <p className={errorClass}>{errors.city.message}</p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input
                type="text"
                className={modalInputClass}
                placeholder="Budget (e.g. 2000/unit)"
                {...register("budget", {
                  onChange: (e) => {
                    const val = e.target.value;
                    const digits = val.replace(/[^0-9]/g, "");
                    e.target.value = digits ? `₹ ${digits}` : "";
                  },
                })}
              />
              {errors.budget && (
                <p className={errorClass}>{errors.budget.message}</p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input type="hidden" {...register("giftingFor")} />
              <CustomDropdown
                placeholder="Select Gifting For"
                value={giftingForValue}
                options={[
                  { label: "Internal Employee", value: "Internal Clients" },
                  { label: "Clients / Customers", value: "External" },
                  { label: "VIP / CEO", value: "Vip" },
                  { label: "Others", value: "Others" },
                ]}
                onChange={(val) =>
                  setValue("giftingFor", val, { shouldValidate: true })
                }
                error={errors.giftingFor?.message}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input type="hidden" {...register("quantity")} />
              <CustomDropdown
                placeholder="Select Quantity"
                value={quantityValue}
                options={[
                  { label: "0 to 5 pcs", value: "0 to 5" },
                  { label: "5 to 10 pcs", value: "5 to 10" },
                  { label: "10 to 50 pcs", value: "10 to 50" },
                  { label: "50 to 100 pcs", value: "50 to 100" },
                  { label: "100 to 200 pcs", value: "100 to 200" },
                  { label: "200 to 500 pcs", value: "200 to 500" },
                  { label: "Above 500 pcs", value: "above 500" },
                ]}
                onChange={(val) =>
                  setValue("quantity", val, { shouldValidate: true })
                }
                error={errors.quantity?.message}
              />
            </div>
            <div className="col-span-2">
              <textarea
                className={modalInputClass}
                rows={3}
                placeholder="Additional information"
                {...register("notes")}
              />
            </div>
            <div className="col-span-2 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center py-4 bg-[#cca028] text-[#0f172a] font-medium rounded-xl shadow-md hover:bg-[#d5a82c] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? "Sending…" : "Submit Enquiry"}
              </button>
            </div>
          </form>
        )}

        {/* Hidden PDF Template */}
        {enquiryData && (
          <div style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "210mm",
            height: "297mm",
            zIndex: "-1"
          }}>
            <EnquiryPDFTemplate data={enquiryData} id="enquiry-pdf-content" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
