import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Send, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../context/CartContext";
import { PageTransition } from "../components/common/PageTransition";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomDropdown } from "../components/common/CustomDropdown";

const enquirySchema = z.object({
  name: z.string().min(2, "Enter your full name").regex(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  company: z.string().min(2, "Enter your company name"),
  email: z.string().email("Enter a valid email"),
  city: z.string().min(2, "Enter your city").regex(/^[A-Za-z\s]+$/, "City name must contain only alphabetic characters"),
  budget: z.string().min(1, "Enter a budget amount").regex(/^₹\s\d+$/, "Enter a valid budget amount"),
  giftingFor: z.string().min(1, "Tell us who this is for"),
  quantity: z.string().min(1, "Enter an approximate quantity"),
  notes: z.string().optional(),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

export function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

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
                  onClick={() => setEnquiryOpen(true)}
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
                  onClick={() => setEnquiryOpen(true)}
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

function CartEnquiryModal({
  onClose,
  cartItems,
  clearCart,
}: {
  onClose: () => void;
  cartItems: CartItem[];
  clearCart: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryForm>({ resolver: zodResolver(enquirySchema) });

  const giftingForValue = watch("giftingFor") || "";
  const quantityValue = watch("quantity") || "";
  const onSubmit = async (data: EnquiryForm) => {
    try {
      const itemsPayload = cartItems.map((item) => ({
        product_id: Number(item.product.id),
        quantity: Number(item.quantity),
      }));

      const payload = {
        items: itemsPayload,
        name: data.name,
        email: data.email,
        company_name: data.company,
        mobile: data.mobile,
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

      setSubmitted(true);
      clearCart();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
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
              Enquiry received
            </p>
            <p className="max-w-xs text-sm text-[#0f172a]/70 dark:text-[#0f172a]/70">
              Our gifting team will reach out within one business day with your custom quote.
            </p>
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
                placeholder="Full name"
                {...register("name")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  );
                }}
              />
              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input
                type="tel"
                maxLength={10}
                className={modalInputClass}
                placeholder="Mobile number"
                {...register("mobile")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
              />
              {errors.mobile && (
                <p className={errorClass}>{errors.mobile.message}</p>
              )}
            </div>
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
                type="email"
                className={modalInputClass}
                placeholder="Email ID"
                {...register("email")}
              />
              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
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
      </motion.div>
    </motion.div>
  );
}
