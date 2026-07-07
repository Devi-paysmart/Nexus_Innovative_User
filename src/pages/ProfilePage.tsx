import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShoppingBag,
  History,
  FileText,
  Edit3,
  Download,
  Printer,
  X,
  Check,
  Briefcase,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { PageTransition } from "../components/common/PageTransition";
import { cn } from "../utils/cn";
import { QuotationSheet } from "../components/profile/QuotationSheet";
import type { Enquiry } from "../components/profile/QuotationSheet";
import { EnquiryModal } from "../components/common/EnquiryModal";
import { CartEnquiryModal } from "./CartPage";
import { supabase } from "../supabase";
import { CustomDropdown } from "../components/common/CustomDropdown";
import { EnquiryPDFTemplate, type EnquiryPDFData } from "../components/common/EnquiryPDFTemplate";

export function ProfilePage() {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState<"cart" | "enquiries">("enquiries");

  // Read current user session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("nexus_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const metadata = parsed.metadata || {};
        return {
          name: metadata.first_name || parsed.email.split("@")[0],
          email: parsed.email,
          phone: metadata.mobile,
        };
      } catch (e) {
        console.error("Error reading user session from localStorage:", e);
      }
    }
    return {
      name: "Alexander Vance",
      email: "alexander.vance@vancecorp.com",
      phone: "+1 (555) 019-2834",
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");
    navigate("/login");
  };


  // Fetch profile details from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const apiKey = import.meta.env.VITE_CLIENT_API_KEY || "";
      const token = localStorage.getItem("nexus_token");

      if (!token) return;

      try {
        const response = await fetch(`${baseUrl}/api/v1/user/auth/profile`, {
          headers: {
            "X-API-Key": apiKey,
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            const p = data.profile;
            setCurrentUser((curr) => ({
              name: p.name || curr.name,
              email: p.email || curr.email,
              phone: p.phone || curr.phone,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile details:", err);
      }
    };

    fetchProfile();
  }, []);

  interface ProfileEnquiry extends Enquiry {
    companyName?: string;
    city?: string;
    mobile?: string;
    dbId?: number;
    giftingFor?: string;
  }

  const [enquiries, setEnquiries] = useState<ProfileEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const handleEnquireClick = () => {
    setEnquiryOpen(true);
  };

  // Derive profile summary details from latest enquiry
  const latestEnquiry = enquiries[0];
  const profileSummary = {
    companyName: latestEnquiry?.companyName,
    budget: latestEnquiry?.budget,
    city: latestEnquiry?.city,
    mobile: latestEnquiry?.mobile || currentUser.phone
  };

  // Fetch enquiries from backend
  useEffect(() => {
    const fetchEnquiries = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const apiKey = import.meta.env.VITE_CLIENT_API_KEY;
      const token = localStorage.getItem("nexus_token");

      if (!token) {
        setLoadingEnquiries(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/v1/user/enquiries/my_enquiries`, {
          headers: {
            "X-API-Key": apiKey,
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const mapped: ProfileEnquiry[] = (data.enquiries || []).map((item: any) => {
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }) : "";

            return {
              id: item.enquiry_id || `ENQ${String(item.id).padStart(5, '0')}`,
              title: item.gifting_for ? `${item.gifting_for} Gifting` : "Corporate Gifting",
              category: item.enquiry_type ? (item.enquiry_type.charAt(0).toUpperCase() + item.enquiry_type.slice(1) + " Gifting") : "General Gifting",
              quantity: item.quantity || 1,
              budget: item.budget || "Custom",
              status: "Processing",
              createdDate: dateStr,
              updatedDate: dateStr,
              notes: [item.message, item.additional_information].filter(Boolean).join("\n"),
              companyName: item["Company Name"] || item.company_name || "",
              city: item.city || "",
              mobile: item.mobile || "",
              clientName: item.name || currentUser.name || "Client",
              clientEmail: item.email || currentUser.email || "Email",
              enquirePdf: item.enquire_pdf || undefined,
              dbId: item.id,
              giftingFor: item.gifting_for || "Others",
            };
          });
          setEnquiries(mapped);
          localStorage.setItem("nexus_dummy_enquiries", JSON.stringify(mapped));
          if (mapped.length > 0) {
            setSelectedPdfId(mapped[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
      } finally {
        setLoadingEnquiries(false);
      }
    };

    fetchEnquiries();
  }, [currentUser]);

  // Edit Enquiry states
  const [editingEnquiry, setEditingEnquiry] = useState<ProfileEnquiry | null>(null);
  const [editForm, setEditForm] = useState<{
    companyName: string;
    city: string;
    budget: string;
    giftingFor: string;
    quantityOption: string;
    notes: string;
  }>({
    companyName: "",
    city: "",
    budget: "",
    giftingFor: "",
    quantityOption: "",
    notes: "",
  });

  const [pdfEnquiryData, setPdfEnquiryData] = useState<EnquiryPDFData | null>(null);

  // PDF Preview states
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [selectedPdfId, setSelectedPdfId] = useState<string>("");
  const selectedPdfEnq = enquiries.find((e) => e.id === selectedPdfId) || enquiries[0] || {
    id: "N/A",
    title: "Corporate Gifting",
    category: "General",
    quantity: 1,
    budget: "₹50 - ₹100",
    status: "Draft",
    createdDate: "",
    updatedDate: "",
    notes: ""
  };

  // Parse budget helper
  const parseBudgetRange = (budgetStr: string): [number, number] => {
    if (budgetStr.includes("-")) {
      const parts = budgetStr.replace(/[₹$\s]/g, "").split("-");
      return [Number(parts[0]) || 10, Number(parts[1]) || 50];
    } else {
      const base = Number(budgetStr.replace(/[₹$\s+]/g, "")) || 150;
      return [base, base * 1.5];
    }
  };

  const [minPrice, maxPrice] = parseBudgetRange(selectedPdfEnq.budget);
  const minTotalVal = selectedPdfEnq.quantity * minPrice;
  const maxTotalVal = selectedPdfEnq.quantity * maxPrice;

  // Load html2pdf CDN script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Parse message/notes and quantity range from combined notes
  const parseNotesAndQuantity = (notesStr: string) => {
    let notes = "";
    let qtyOption = "";
    if (notesStr) {
      const lines = notesStr.split("\n");
      const notesLines: string[] = [];
      for (const line of lines) {
        if (line.startsWith("Quantity option:")) {
          qtyOption = line.replace("Quantity option:", "").trim();
        } else if (line.startsWith("Notes:")) {
          notesLines.push(line.replace("Notes:", "").trim());
        } else {
          notesLines.push(line);
        }
      }
      notes = notesLines.filter(Boolean).join("\n");
    }
    return { notes, qtyOption };
  };

  // Handle Editing
  const openEditModal = (enq: ProfileEnquiry) => {
    setEditingEnquiry(enq);
    const parsed = parseNotesAndQuantity(enq.notes);
    setEditForm({
      companyName: enq.companyName || "",
      city: enq.city || "",
      budget: enq.budget || "",
      giftingFor: enq.giftingFor || "Others",
      quantityOption: parsed.qtyOption || "10 to 50",
      notes: parsed.notes || "",
    });
  };

  const generateAndUploadPDF = async (pdfData: EnquiryPDFData, enquiryCode: string) => {
    try {
      const element = document.getElementById("edit-enquiry-pdf-content");
      if (!element) {
        console.error("PDF element not found");
        return;
      }

      console.log("Starting PDF generation for edited enquiry:", enquiryCode);
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

      const worker = window.html2pdf().set(opt).from(element);
      const pdf = (await worker.toPdf().get("pdf")) as any;
      const blob = pdf.output("blob");

      // Upload to Supabase Storage
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

      const { data } = supabase.storage
        .from("enquiry-pdfs")
        .getPublicUrl(`enquiries/${filename}`);

      const pdfUrl = `${data.publicUrl}?t=${Date.now()}`;

      // Update backend with PDF URL
      const token = localStorage.getItem("nexus_token");
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      if (token) {
        const updateResponse = await fetch(
          `${baseUrl}/api/v1/user/enquiries/update-pdf`,
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

        if (updateResponse.ok) {
          console.log("Database updated successfully with updated PDF URL and email sent");
          setEnquiries((prev) =>
            prev.map((enq) =>
              enq.id === enquiryCode
                ? { ...enq, enquirePdf: pdfUrl }
                : enq
            )
          );
        }
      }
    } catch (err) {
      console.error("PDF regeneration/upload error:", err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnquiry) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const token = localStorage.getItem("nexus_token");

    if (!token) return;

    try {
      const additionalInfo = [
        editForm.notes ? `Notes: ${editForm.notes}` : "",
        `Quantity option: ${editForm.quantityOption}`
      ].filter(Boolean).join("\n");

      const parseQuantity = (range: string) => {
        if (range.startsWith("above")) return 500;
        const parts = range.split(" to ");
        if (parts.length === 2) return Number(parts[1]);
        return 1;
      };

      const response = await fetch(`${baseUrl}/api/v1/user/enquiries/update/${editingEnquiry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          company_name: editForm.companyName,
          city: editForm.city,
          budget: editForm.budget,
          gifting_for: editForm.giftingFor,
          quantity: parseQuantity(editForm.quantityOption),
          message: additionalInfo
        })
      });

      if (response.ok) {
        const now = new Date();
        const dateStr = now.toLocaleString("en-IN", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });

        // 1. Update UI state first
        setEnquiries((prev) => {
          const updated = prev.map((enq) =>
            enq.id === editingEnquiry.id
              ? {
                ...enq,
                companyName: editForm.companyName,
                city: editForm.city,
                budget: editForm.budget,
                giftingFor: editForm.giftingFor,
                title: `${editForm.giftingFor} Gifting`,
                notes: additionalInfo,
                quantity: parseQuantity(editForm.quantityOption),
                updatedDate: dateStr,
              }
              : enq
          );
          localStorage.setItem("nexus_dummy_enquiries", JSON.stringify(updated));
          return updated;
        });

        // 2. Fetch products to regenerate the A4 enquiry PDF
        const { data: cartData } = await supabase
          .from("cart_items")
          .select("*, products(*)")
          .eq("enquiry_id", editingEnquiry.dbId);

        const pdfItems = (cartData || []).map((ci: any) => ({
          product: {
            id: ci.products?.id,
            title: ci.products?.name || "Product Item",
            price: ci.products?.price || 0,
            image: ci.products?.images?.[0] || "",
          },
          quantity: ci.quantity,
        }));

        const pdfData: EnquiryPDFData = {
          enquiryId: editingEnquiry.id,
          name: editingEnquiry.clientName || currentUser.name || "Valued Customer",
          email: editingEnquiry.clientEmail || currentUser.email || "",
          company: editForm.companyName,
          mobile: editingEnquiry.mobile || currentUser.phone || "N/A",
          city: editForm.city,
          budget: editForm.budget,
          giftingFor: editForm.giftingFor,
          quantity: editForm.quantityOption,
          notes: editForm.notes,
          items: pdfItems as any,
          submittedDate: dateStr,
        };

        setPdfEnquiryData(pdfData);

        // Close the modal
        setEditingEnquiry(null);

        // 3. Trigger client-side PDF regeneration & upload to Supabase & email notification API
        setTimeout(() => {
          generateAndUploadPDF(pdfData, editingEnquiry.id);
        }, 500);
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.detail || "Failed to update enquiry.");
      }
    } catch (err) {
      console.error("Error saving edit:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDownloadPDF = async (enquiryId?: string) => {
    const targetId = enquiryId || selectedPdfId;
    const targetEnq = enquiries.find((e) => e.id === targetId) || selectedPdfEnq;

    if (targetEnq && targetEnq.enquirePdf) {
      window.open(targetEnq.enquirePdf, "_blank");
      return;
    }

    // Set selection state so the hidden DOM component renders with correct props
    setSelectedPdfId(targetId);

    const runExport = async () => {
      const element = document.getElementById("pdf-render-sheet");
      if (!element) return;

      const filename = `Nexus_Quotation_${targetEnq.id}.pdf`;
      const opt = {
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
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
        jsPDF: { unit: "px", format: [794, 1000], orientation: "portrait" }
      };

      const html2pdf = (window as any).html2pdf;
      if (!html2pdf) {
        alert("PDF library is still loading. Please try again in a moment.");
        return;
      }

      try {
        // Generate PDF and get as blob
        const worker = html2pdf().set(opt).from(element);
        const pdf = (await worker.toPdf().get("pdf")) as any;

        // Convert PDF to Blob
        const blob = pdf.output("blob");
        console.log("PDF generated successfully, size:", blob.size, "bytes");

        // Upload to Supabase Storage
        console.log("Uploading to Supabase bucket: enquiry-pdfs, path: quotations/" + filename);
        const { error, data: uploadData } = await supabase.storage
          .from("enquiry-pdfs")
          .upload(`quotations/${filename}`, blob, {
            contentType: "application/pdf",
            upsert: true
          });

        if (error) {
          console.error("Supabase upload error:", error);
          alert("PDF generated but failed to upload to server. Error: " + error.message);
          return;
        }

        console.log("Upload successful:", uploadData);

        // Get Public URL
        const { data } = supabase.storage
          .from("enquiry-pdfs")
          .getPublicUrl(`quotations/${filename}`);

        const pdfUrl = data.publicUrl;
        console.log("PDF public URL:", pdfUrl);

        // Update backend with PDF URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const token = localStorage.getItem("nexus_token");

        if (token && targetEnq.id) {
          console.log("Updating database for enquiry_code:", targetEnq.id);
          const apiResponse = await fetch(
            `${baseUrl}/api/v1/user/enquiries/update-pdf`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                enquiry_code: targetEnq.id,
                enquire_pdf: pdfUrl
              })
            }
          );

          const responseData = await apiResponse.json().catch(() => null);
          if (apiResponse.ok) {
            console.log("Database updated successfully with PDF URL");
            console.log("Enquiry ID:", targetEnq.id, "- PDF URL stored:", pdfUrl);
            // Update local enquiry state with the new PDF URL
            setEnquiries((prev) =>
              prev.map((enq) =>
                enq.id === targetEnq.id
                  ? { ...enq, enquirePdf: pdfUrl }
                  : enq
              )
            );
          } else {
            console.error("Failed to update database. Response:", responseData);
          }
        }

        // Open the PDF in new window
        window.open(pdfUrl, "_blank");
      } catch (err) {
        console.error("PDF download/upload failed:", err);
        alert("Failed to process PDF. Please try again.");
      }
    };

    // Wait a brief moment for React state update to propagate before capturing
    setTimeout(runExport, 150);
  };

  const handleOpenPrintPreview = (enquiryId?: string) => {
    const targetId = enquiryId || selectedPdfId;
    const targetEnq = enquiries.find((e) => e.id === targetId) || selectedPdfEnq;

    if (targetEnq && targetEnq.enquirePdf) {
      window.open(targetEnq.enquirePdf, "_blank");
      return;
    }

    window.open(`/quotation/${targetId}?print=true`, "_blank");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cloud dark:bg-ink pt-32 pb-24 text-ink dark:text-paper transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">

          {/* Back button */}
          <Link
            to="/collections"
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink/50 hover:text-gold-deep dark:text-paper/50 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          {/* ── USER HERO CARD ── */}
          <div className="relative overflow-hidden rounded-[32px] bg-white/70 dark:bg-ink-soft/75 backdrop-blur-xl border border-ink/5 dark:border-white/10 p-8 shadow-luxe mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="absolute right-6 top-6 md:right-8 md:top-8 inline-flex items-center gap-1.5 rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white cursor-pointer shadow-sm"
            >
              <LogOut size={13} />
              Logout
            </button>

            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-gold-deep to-gold-light flex items-center justify-center text-ink font-bold text-3xl shadow-lg border border-white/20">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-2 border-white dark:border-ink rounded-full px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                Active
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="font-display text-3xl font-semibold tracking-tight">{currentUser.name}</h1>
              </div>
              {/* <p className="text-sm text-ink/50 dark:text-paper/50 mt-1.5 flex items-center gap-1.5 justify-center md:justify-start font-medium">
                <Briefcase size={14} className="text-gold-deep dark:text-gold" />
                <span>{profileSummary.companyName}</span>
              </p> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 border-t border-ink/5 dark:border-white/5 pt-6 text-xs text-ink/75 dark:text-paper/75">
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <Mail size={15} className="text-gold-deep dark:text-gold" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <Phone size={15} className="text-gold-deep dark:text-gold" />
                  <span>{currentUser.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center md:justify-start">
                  <Phone size={15} className="text-gold-deep dark:text-gold" />
                  <span>Helpline: +91 98840 40777</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── DASHBOARD NAVIGATION TABS ── */}
          <div className="flex border-b border-ink/5 dark:border-white/10 mb-8 overflow-x-auto scrollbar-none gap-2">
            {[
              // { id: "overview", label: "Overview", icon: User },
              // { id: "cart", label: `Active Cart (${cartItems.length})`, icon: ShoppingBag },
              { id: "enquiries", label: `Enquiries (${enquiries.length})`, icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold tracking-wide transition-all duration-300 relative rounded-t-xl cursor-pointer",
                    active
                      ? "border-gold-deep text-gold-deep dark:border-gold dark:text-gold bg-gold/5"
                      : "border-transparent text-ink/50 dark:text-paper/50 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5"
                  )}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB DETAILS RENDER ── */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 md:grid-cols-3"
                >
                  <div className="bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl p-6 border border-ink/5 dark:border-white/5 shadow-sm md:col-span-2">
                    <h3 className="font-display text-xl font-semibold mb-4 border-b border-ink/5 dark:border-white/5 pb-2">Account Summary</h3>
                    <div className="grid sm:grid-cols-2 gap-6 text-sm">
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-ink/40 dark:text-paper/40 mb-1">Company Name</span>
                        <strong className="text-gold-deep dark:text-gold font-bold">{profileSummary.companyName}</strong>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-ink/40 dark:text-paper/40 mb-1">Budget</span>
                        <strong className="font-semibold">{profileSummary.budget}</strong>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-ink/40 dark:text-paper/40 mb-1">City</span>
                        <strong className="font-semibold">{profileSummary.city}</strong>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-ink/40 dark:text-paper/40 mb-1">Mobile Number</span>
                        <strong className="font-semibold">{profileSummary.mobile}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl p-6 border border-ink/5 dark:border-white/5 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-4 border-b border-ink/5 dark:border-white/5 pb-2">Status</h3>
                      <p className="text-xs text-ink/60 dark:text-paper/60 leading-relaxed">
                        Your account has priority access. Standard inquiries are processed within 2-4 business hours.
                      </p>
                    </div>
                    <div className="mt-6 p-4 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-bold text-gold-deep dark:text-gold tracking-widest">Gifting Advisor Hotline</span>
                      <span className="text-sm font-semibold tracking-wide">+91 98840 40777</span>
                    </div>
                  </div>
                </motion.div>
              )} */}

              {/* {activeTab === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl p-6 border border-ink/5 dark:border-white/5 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold mb-6 border-b border-ink/5 dark:border-white/5 pb-2">Active Quotation Cart</h3>

                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <ShoppingBag size={48} className="text-ink/20 dark:text-paper/20 mb-4 animate-bounce" />
                      <p className="text-base text-ink/55 dark:text-paper/55">Your enquiry cart is empty.</p>
                      <Link to="/collections" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold text-ink font-semibold px-5 py-2.5 text-xs hover:bg-gold-deep hover:shadow-gold-glow transition-all">
                        Browse Collections
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cloud/50 dark:bg-ink-soft/60 border border-ink/5 dark:border-white/5">
                          <div className="flex items-center gap-4">
                            <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover border border-ink/10 dark:border-white/10" alt="" />
                            <div>
                              <h4 className="font-semibold text-sm">{item.product.title}</h4>
                              <p className="text-xs text-ink/50 dark:text-paper/50 truncate max-w-[300px] mt-1">{item.product.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:justify-end">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs text-ink/40 dark:text-paper/40">Qty:</span>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                                className="w-16 bg-white dark:bg-ink border border-ink/10 dark:border-white/15 rounded-lg py-1 px-2 text-center text-xs outline-none focus:border-gold"
                              />
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-xs text-rose-500 hover:text-rose-600 font-medium cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center border-t border-ink/5 dark:border-white/5 pt-6 mt-6">
                        <div className="text-xs text-ink/40 dark:text-paper/40">
                          Configure your quantities above. These items represent your custom corporate enquiry bundle.
                        </div>
                        <button
                          onClick={handleEnquireClick}
                          className="inline-flex items-center gap-2 rounded-xl bg-gold text-ink font-semibold px-6 py-3.5 text-xs hover:bg-gold-deep hover:shadow-gold-glow transition-all"
                        >
                          Submit Enquiry Bundle
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )} */}

              {activeTab === "enquiries" && (
                <motion.div
                  key="enquiries"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl p-6 border border-ink/5 dark:border-white/5 shadow-sm pb-4">
                    <h3 className="font-display text-xl font-semibold">Gifting Enquiry Logs</h3>
                    <span className="text-xs text-ink/40 dark:text-paper/40">Total Requests: {enquiries.length}</span>
                  </div>

                  {loadingEnquiries ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl border border-ink/5 dark:border-white/5 shadow-sm">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-deep dark:border-gold"></div>
                      <p className="mt-4 text-sm text-ink/50 dark:text-paper/50 font-medium">Loading enquiries...</p>
                    </div>
                  ) : enquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl border border-ink/5 dark:border-white/5 shadow-sm">
                      <ShoppingBag size={48} className="text-ink/20 dark:text-paper/20 mb-4 animate-bounce" />
                      <p className="text-sm text-ink/55 dark:text-paper/55">You haven't submitted any corporate enquiries yet.</p>
                      <Link to="/collections" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold text-ink font-semibold px-5 py-2.5 text-xs hover:bg-gold-deep hover:shadow-gold-glow transition-all">
                        Browse Collections
                      </Link>
                    </div>
                  ) : (
                    enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="bg-white/60 dark:bg-ink-soft/40 backdrop-blur-md rounded-3xl p-6 border border-ink/5 dark:border-white/5 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-ink/5 dark:border-white/5 pb-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{enq.id}</span>
                              <span className="text-xs text-ink/40 dark:text-paper/40">· {enq.category}</span>
                            </div>
                            <h4 className="font-semibold text-lg mt-1">{enq.title}</h4>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                              enq.status === "Approved" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                              enq.status === "Processing" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              enq.status === "Draft" && "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            )}>
                              {enq.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-ink/70 dark:text-paper/70">
                          <div>
                            <span className="block text-[10px] uppercase text-ink/40 dark:text-paper/40 mb-1">Est. Quantity</span>
                            <strong className="font-semibold text-sm">{enq.quantity} units</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-ink/40 dark:text-paper/40 mb-1">Budget Tier</span>
                            <strong className="font-semibold text-sm">{enq.budget} / unit</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-ink/40 dark:text-paper/40 mb-1">Created Date</span>
                            <span className="font-medium text-xs">{enq.createdDate}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-ink/40 dark:text-paper/40 mb-1">Updated Date</span>
                            <span className="font-semibold text-xs text-gold-deep dark:text-gold">{enq.updatedDate}</span>
                          </div>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-cloud/50 dark:bg-ink-soft/60 border border-ink/5 dark:border-white/5">
                          <span className="block text-[10px] uppercase font-bold text-ink/40 dark:text-paper/40 mb-1.5">Enquiry Instructions</span>
                          <p className="text-xs leading-relaxed italic">"{enq.notes}"</p>
                        </div>

                        <div className="flex gap-2.5 mt-6 border-t border-ink/5 dark:border-white/5 pt-4">
                          <button
                            onClick={() => openEditModal(enq)}
                            className="inline-flex items-center gap-1.5 text-xs text-gold-deep dark:text-gold font-semibold hover:underline cursor-pointer"
                          >
                            <Edit3 size={13} /> Edit Enquiry
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(enq.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-ink/65 dark:text-paper/65 font-semibold hover:text-ink dark:hover:text-paper cursor-pointer ml-auto"
                          >
                            <Download size={13} /> Download PDF
                          </button>
                          <button
                            onClick={() => handleOpenPrintPreview(enq.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-ink/65 dark:text-paper/65 font-semibold hover:text-ink dark:hover:text-paper cursor-pointer"
                          >
                            <Printer size={13} /> Print/View PDF
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

            </AnimatePresence>

            {/* Hidden Quotation Sheet for PDF Capture */}
            <div className="absolute opacity-0 pointer-events-none -z-50 select-none" style={{ top: -9999, left: -9999 }}>
              <QuotationSheet
                id="pdf-render-sheet"
                enquiry={selectedPdfEnq}
                minTotalVal={minTotalVal}
                maxTotalVal={maxTotalVal}
              />
            </div>
          </div>
        </div>

        {/* ── EDIT ENQUIRY MODAL (WITH PDF REGENERATION & NOTIFICATION TRIGGER) ── */}
        <AnimatePresence>
          {editingEnquiry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/55 p-4 backdrop-blur-md"
              onClick={() => setEditingEnquiry(null)}
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
                    <p className="eyebrow mb-2 text-[#cca028]">Enquiry Edit</p>
                    <h3 className="font-display text-3xl font-semibold text-[#0f172a] tracking-tight">
                      Edit Details ({editingEnquiry.id})
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingEnquiry(null)}
                    aria-label="Close"
                    className="text-[#0f172a] hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-[#cca028] mb-1.5">Company name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-black/15 bg-[#c2c3c8] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#cca028] placeholder:text-[#5f6368]"
                      placeholder="Company name"
                      value={editForm.companyName}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, companyName: e.target.value.replace(/[^A-Za-z0-9\s]/g, "") }))}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-[#cca028] mb-1.5">City</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-black/15 bg-[#c2c3c8] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#cca028] placeholder:text-[#5f6368]"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value.replace(/[^A-Za-z\s]/g, "") }))}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-[#cca028] mb-1.5">Budget</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-black/15 bg-[#c2c3c8] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#cca028] placeholder:text-[#5f6368]"
                      placeholder="Budget (e.g. 2000/unit)"
                      value={editForm.budget}
                      onChange={(e) => {
                        const val = e.target.value;
                        const digits = val.replace(/[^0-9]/g, "");
                        setEditForm((prev) => ({ ...prev, budget: digits ? `₹ ${digits}` : "" }));
                      }}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-[#cca028] mb-1.5">Gifting for</label>
                    <CustomDropdown
                      placeholder="Select Gifting For"
                      value={editForm.giftingFor}
                      options={[
                        { label: "Internal Employee", value: "Internal Clients" },
                        { label: "Clients / Customers", value: "External" },
                        { label: "VIP / CEO", value: "Vip" },
                        { label: "Others", value: "Others" },
                      ]}
                      onChange={(val) => setEditForm((prev) => ({ ...prev, giftingFor: val }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-[#cca028] mb-1.5">Quantity options</label>
                    <CustomDropdown
                      placeholder="Select Quantity Option"
                      value={editForm.quantityOption}
                      options={[
                        { label: "0 to 5 pcs", value: "0 to 5" },
                        { label: "5 to 10 pcs", value: "5 to 10" },
                        { label: "10 to 50 pcs", value: "10 to 50" },
                        { label: "50 to 100 pcs", value: "50 to 100" },
                        { label: "100 to 200 pcs", value: "100 to 200" },
                        { label: "200 to 500 pcs", value: "200 to 500" },
                        { label: "Above 500 pcs", value: "above 500" },
                      ]}
                      onChange={(val) => setEditForm((prev) => ({ ...prev, quantityOption: val }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-[#cca028] mb-1.5">Additional notes</label>
                    <textarea
                      className="w-full rounded-xl border border-black/15 bg-[#c2c3c8] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#cca028] placeholder:text-[#5f6368]"
                      rows={3}
                      placeholder="Additional information"
                      value={editForm.notes}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2 mt-2">
                    <button
                      type="submit"
                      className="w-full justify-center py-4 bg-[#cca028] text-[#0f172a] font-medium rounded-xl shadow-md hover:bg-[#d5a82c] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden PDF Template for editing */}
        {pdfEnquiryData && (
          <div style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "210mm",
            height: "297mm",
            zIndex: "-1"
          }}>
            <EnquiryPDFTemplate data={pdfEnquiryData} id="edit-enquiry-pdf-content" />
          </div>
        )}
      </div>
      {enquiryOpen && <CartEnquiryModal onClose={() => setEnquiryOpen(false)} cartItems={cartItems} clearCart={clearCart} />}
    </PageTransition>
  );
}
