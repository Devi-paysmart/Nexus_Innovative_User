import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { QuotationSheet } from "../components/profile/QuotationSheet";
import type { Enquiry } from "../components/profile/QuotationSheet";

export function QuotationPDFPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);

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

  // Fetch enquiry from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nexus_dummy_enquiries");
    if (saved) {
      try {
        const list: Enquiry[] = JSON.parse(saved);
        const found = list.find((e) => e.id === id);
        if (found) {
          setEnquiry(found);
        }
      } catch (err) {
        console.error("Error parsing enquiries from localStorage", err);
      }
    }
  }, [id]);

  // Handle automatic print trigger
  useEffect(() => {
    if (enquiry && searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // Give enough time for fonts/renders to stabilize
      return () => clearTimeout(timer);
    }
  }, [enquiry, searchParams]);

  if (!enquiry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
        <h2 className="text-xl font-bold mb-2">Quotation Not Found</h2>
        <p className="text-sm text-slate-550 mb-6">Could not retrieve enquiry reference: {id}</p>
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 bg-gold hover:bg-gold-deep text-ink font-semibold rounded-lg text-sm transition-colors cursor-pointer"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  // Parse budget range
  const parseBudgetRange = (budgetStr: string): [number, number] => {
    if (budgetStr.includes("-")) {
      const parts = budgetStr.replace(/[₹$\s]/g, "").split("-");
      return [Number(parts[0]) || 10, Number(parts[1]) || 50];
    } else {
      const base = Number(budgetStr.replace(/[₹$\s+]/g, "")) || 150;
      return [base, base * 1.5];
    }
  };

  const [minPrice, maxPrice] = parseBudgetRange(enquiry.budget);
  const minTotalVal = enquiry.quantity * minPrice;
  const maxTotalVal = enquiry.quantity * maxPrice;

  const handleDownloadPDF = () => {
    const element = document.getElementById("quotation-sheet-capture");
    if (!element) return;

    const opt = {
      margin:       0,
      filename:     `Nexus_Quotation_${enquiry.id}.pdf`,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: "#ffffff"
      },
      jsPDF:        { unit: "px", format: [794, 1000], orientation: "portrait" }
    };

    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      alert("PDF library is still loading. Please try again in a moment.");
      return;
    }

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 flex flex-col items-center justify-start print:bg-white print:py-0 print:px-0">
      
      {/* Print Page Toolbar */}
      <div className="w-[794px] mb-6 flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm print:hidden">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Profile
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold text-ink font-semibold px-4.5 py-2 text-xs hover:bg-gold-deep transition-all cursor-pointer shadow-sm hover:shadow-gold-glow"
          >
            <Download size={13} /> Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold px-4.5 py-2 text-xs hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Render Quotation Sheet */}
      <div id="quotation-sheet-capture" className="print:shadow-none shadow-2xl">
        <QuotationSheet
          enquiry={enquiry}
          minTotalVal={minTotalVal}
          maxTotalVal={maxTotalVal}
        />
      </div>
    </div>
  );
}
