import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { PageTransition } from "../components/common/PageTransition";
import { SectionReveal } from "../components/common/SectionReveal";
import { MagneticButton } from "../components/common/MagneticButton";
import { CustomDropdown } from "../components/common/CustomDropdown";

const contactSchema = z.object({
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

type ContactForm = z.infer<typeof contactSchema>;

const parseQuantity = (val: string): number => {
  if (val === "above 500") return 500;
  if (val.includes("to")) {
    const maxVal = val.split("to")[1];
    return parseInt(maxVal, 10) || 1;
  }
  return parseInt(val, 10) || 1;
};

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const stateCategoryId = location.state?.categoryId;
  const categoryId = stateCategoryId ? Number(stateCategoryId) : 4;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const giftingForValue = watch("giftingFor") || "";
  const quantityValue = watch("quantity") || "";

  const onSubmit = async (data: ContactForm) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

    try {
      const payload = {
        category_id: categoryId,
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
        ].filter(Boolean).join("\n"),
        quantity: parseQuantity(data.quantity)
      };

      const response = await fetch(
        `${API_BASE_URL}/api/v1/user/products/category_enquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY || "",
            "Authorization": `Bearer ${localStorage.getItem("nexus_token") || ""}`,
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
    "w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm outline-none transition-colors focus:border-gold-deep placeholder:text-ink/40 dark:border-paper/15 dark:bg-paper/5 dark:text-paper dark:placeholder:text-paper/40";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <PageTransition>
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionReveal>
            <p className="eyebrow mb-4">Contact</p>
            <h1 className="font-display text-4xl text-ink dark:text-paper lg:text-6xl">
              Talk to our corporate gifting experts
            </h1>
            <p className="mt-4 max-w-2xl text-ink/60 dark:text-paper/60">
              Share your requirements and our team will curate a bespoke gifting proposal
              within one business day.
            </p>
          </SectionReveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <SectionReveal delay={0.1}>
              <div className="space-y-8">
                {[
                  { icon: Phone, label: "Phone", value: "+91 98840 40777" },
                  { icon: Mail, label: "Email", value: "satishkumar@nexusi.in" },
                  { 
                    icon: MapPin, 
                    label: "Head Office", 
                    value: "No.154 & 155, Luz Church Road,\nMylapore\nChennai – 600 004\nLandmark – Opp – Nageswara Rao Park\nAdjacent – Pazhamudir Nilayam Fruit Shop" 
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15">
                      <Icon className="text-gold-deep" size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink/45 dark:text-paper/45">
                        {label}
                      </p>
                      <p className="mt-1 font-medium text-ink dark:text-paper whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl bg-ink p-6 text-paper">
                  <p className="font-display text-xl">Business Hours</p>
                  <p className="mt-2 text-sm text-paper/60">Mon – Sat, 9:30 AM – 7:00 PM IST</p>
                  <p className="mt-4 text-sm text-gold-light">
                    Emergency festival-season support available 24/7
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="glass rounded-3xl p-8 shadow-luxe-sm dark:glass-dark">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <CheckCircle2 className="text-gold-deep" size={48} />
                    <p className="mt-4 font-display text-2xl text-ink dark:text-paper">
                      Enquiry Accepted
                    </p>
                    <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
                      Our gifting consultants will reach out shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <input type="text" className={inputClass} placeholder="Full name" {...register("name")} onInput={(e) => {e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");}}/>
                      {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                    <div>
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
                    <div>
                      <input type="text" className={inputClass} placeholder="Company name" {...register("company")} onInput={(e) => {e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z0-9\s]/g, "");}}/>
                      {errors.company && <p className={errorClass}>{errors.company.message}</p>}
                    </div>
                    <div>
                      <input type="email" className={inputClass} placeholder="Email ID" {...register("email")} />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="City"
                        {...register("city")}
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                        }}
                      />
                      {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                    </div>
                    <div>
                      <input 
                        type="text"
                        className={inputClass} 
                        placeholder="Budget (e.g. 2000/unit)" 
                        {...register("budget", {
                          onChange: (e) => {
                            const val = e.target.value;
                            const digits = val.replace(/[^0-9]/g, "");
                            e.target.value = digits ? `₹ ${digits}` : "";
                          }
                        })}
                      />
                      {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
                    </div>
                    <div>
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
                        onChange={(val) => setValue("giftingFor", val, { shouldValidate: true })}
                        error={errors.giftingFor?.message}
                      />
                    </div>
                    <div>
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
                        onChange={(val) => setValue("quantity", val, { shouldValidate: true })}
                        error={errors.quantity?.message}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <textarea
                        className={inputClass}
                        rows={4}
                        placeholder="Additional information"
                        {...register("notes")}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <MagneticButton type="submit" className="w-full justify-center !bg-gold-deep !text-ink hover:!bg-gold hover:!shadow-gold-glow">
                        {isSubmitting ? "Sending…" : "Submit Enquiry"}
                      </MagneticButton>
                    </div>
                  </form>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
