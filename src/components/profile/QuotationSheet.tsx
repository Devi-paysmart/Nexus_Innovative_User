import React from "react";

export interface Enquiry {
  id: string;
  title: string;
  category: string;
  quantity: number;
  budget: string;
  status: "Approved" | "Processing" | "Draft";
  createdDate: string;
  updatedDate: string;
  notes: string;
  clientName?: string;
  clientEmail?: string;
  companyName?: string;
  city?: string;
  mobile?: string;
  enquirePdf?: string;
}

interface QuotationSheetProps {
  enquiry: Enquiry;
  minTotalVal: number;
  maxTotalVal: number;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function QuotationSheet({
  enquiry,
  minTotalVal,
  maxTotalVal,
  id,
  className,
  style,
}: QuotationSheetProps) {
  return (
    <div
      id={id}
      style={style}
      className={`w-[794px] h-[1000px] bg-white text-[#0f172a] p-12 shadow-2xl relative border-none flex flex-col justify-between select-none transition-transform duration-200 ${
        className || ""
      }`}
    >
      {/* PDF Header */}
      <div>
        <div className="flex justify-between items-start border-b border-gold pb-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Nexus Logo"
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
            <div>
              <div className="font-sans font-bold text-2xl tracking-tight text-[#0f172a]">
                NEXUS INNOVATIVE
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                Corporate Gifting Solutions
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-sans font-semibold text-lg text-gold-deep uppercase tracking-wide">
              Quotation Request
            </h2>
            <div className="text-[11px] text-slate-500 mt-1">
              Reference: {enquiry.id}
            </div>
            <div className="text-[11px] text-slate-500">
              Date: {enquiry.updatedDate || enquiry.createdDate}
            </div>
          </div>
        </div>

        {/* PDF Info Grid */}
        <div className="grid grid-cols-2 gap-8 text-xs mb-8">
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">
              Prepared For:
            </span>
            <strong className="text-sm text-slate-800">{enquiry.clientName || "Client"}</strong>
            <br />
            {enquiry.clientEmail || "Email not provided"}
            <br />
            {enquiry.mobile || "Mobile not provided"}
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">
              Company Location:
            </span>
            <strong className="text-slate-800">{enquiry.companyName || "Company not specified"}</strong>
            <br />
            {enquiry.city || "City not specified"}
          </div>
        </div>

        {/* PDF Table */}
        <div className="mb-8">
          <span className="block text-[9px] uppercase font-bold text-slate-400 mb-2">
            Item Specifications:
          </span>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left font-bold text-slate-600 bg-slate-50">
                <th className="p-3">Specification Item</th>
                <th className="p-3 text-right">Category</th>
                <th className="p-3 text-right">Est. Quantity</th>
                <th className="p-3 text-right">Target Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-3 font-semibold text-slate-800">{enquiry.title}</td>
                <td className="p-3 text-right text-slate-500">{enquiry.category}</td>
                <td className="p-3 text-right text-slate-800">
                  {enquiry.quantity} units
                </td>
                <td className="p-3 text-right text-slate-800">
                  {enquiry.budget}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Special Instructions */}
        <div className="mb-8">
          <span className="block text-[9px] uppercase font-bold text-slate-400 mb-2">
            Special Gifting Requirements:
          </span>
          <p className="text-xs italic bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed text-slate-700">
            {enquiry.notes ? `"${enquiry.notes}"` : "No special instructions provided."}
          </p>
        </div>
      </div>

      {/* PDF Footer Valuation */}
      <div>
        <div className="flex justify-between items-end border-t border-slate-200 pt-6">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              Authorized Representative:
            </div>
            <div className="font-sans font-medium text-sm mt-1 border-b border-slate-300 w-48 pb-1 italic text-slate-600">
              {enquiry.clientName || "Client Representative"}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              Signature for {enquiry.companyName || "Corporate Partner"}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              Estimated Budget Valuation
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              ₹{minTotalVal.toLocaleString()} - ₹{maxTotalVal.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              Standard Corporate Partner Rates Applied
            </div>
          </div>
        </div>

        <div className="text-[9.5px] text-center text-slate-400 mt-12 border-t border-slate-100 pt-4">
          This is a client-side digital document copy. All information matches verified
          databases at Nexus Innovative.
        </div>
      </div>
    </div>
  );
}
