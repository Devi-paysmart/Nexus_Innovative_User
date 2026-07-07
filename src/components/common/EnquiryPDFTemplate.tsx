import type { CartItem } from "../../context/CartContext";

export interface EnquiryPDFData {
  enquiryId?: string;
  name: string;
  email: string;
  company: string;
  mobile: string;
  city: string;
  budget: string;
  giftingFor: string;
  quantity: string;
  notes?: string;
  items: CartItem[];
  submittedDate: string;
}

interface EnquiryPDFTemplateProps {
  data: EnquiryPDFData;
  id?: string;
}

// Reusable "don't slice me" style for html2pdf's CSS-mode page breaks
const noBreak: React.CSSProperties = {
  breakInside: "avoid",
  pageBreakInside: "avoid",
};

export function EnquiryPDFTemplate({ data, id = "enquiry-pdf" }: EnquiryPDFTemplateProps) {
  const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      id={id}
      style={{
        width: "210mm",
        minHeight: "296mm",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        padding: "48px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
        margin: "0",
        border: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header — fixed so it can't overflow the 210mm width */}
      <div
        style={{
          ...noBreak,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          borderBottom: "2px solid #cca028",
          paddingBottom: "24px",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0, flex: "0 1 auto" }}>
          <img
            src="/logo.png"
            alt="Nexus Logo"
            style={{ height: "48px", width: "auto", objectFit: "contain" }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", letterSpacing: "0.02em", color: "#0f172a", whiteSpace: "nowrap" }}>
              NEXUS INNOVATIVE
            </div>
            <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.08em", marginTop: "4px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Corporate Gifting Solutions
            </div>
          </div>
        </div>
        <div style={{ minWidth: 0, flex: "0 0 auto", textAlign: "right" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#cca028", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, whiteSpace: "nowrap" }}>
            Enquiry Confirmation
          </h2>
          {data.enquiryId && (
            <div style={{ fontSize: "11px", fontWeight: "bold", color: "#0f172a", marginTop: "6px", whiteSpace: "nowrap" }}>
              ID: {data.enquiryId}
            </div>
          )}
          <div style={{ fontSize: "10px", color: "#64748b", marginTop: "6px", whiteSpace: "nowrap" }}>
            Date: {data.submittedDate}
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div style={{ ...noBreak, marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", letterSpacing: "0.05em", marginBottom: "8px", textTransform: "uppercase" }}>
          Client Information
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "12px", lineHeight: "1.8" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>NAME</div>
            <div style={{ color: "#0f172a", fontWeight: "500", wordBreak: "break-word" }}>{data.name}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>EMAIL</div>
            <div style={{ color: "#0f172a", fontWeight: "500", wordBreak: "break-word" }}>{data.email}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>MOBILE</div>
            <div style={{ color: "#0f172a", fontWeight: "500" }}>{data.mobile}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>CITY</div>
            <div style={{ color: "#0f172a", fontWeight: "500", wordBreak: "break-word" }}>{data.city}</div>
          </div>
          <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>COMPANY</div>
            <div style={{ color: "#0f172a", fontWeight: "500", wordBreak: "break-word" }}>{data.company}</div>
          </div>
        </div>
      </div>

      {/* Enquiry Details */}
      <div style={{ ...noBreak, marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", letterSpacing: "0.05em", marginBottom: "8px", textTransform: "uppercase" }}>
          Enquiry Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "12px", lineHeight: "1.8" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>BUDGET</div>
            <div style={{ color: "#0f172a", fontWeight: "500" }}>{data.budget}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>GIFTING FOR</div>
            <div style={{ color: "#0f172a", fontWeight: "500", wordBreak: "break-word" }}>{data.giftingFor}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>QUANTITY RANGE</div>
            <div style={{ color: "#0f172a", fontWeight: "500" }}>{data.quantity}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>TOTAL ITEMS</div>
            <div style={{ color: "#0f172a", fontWeight: "500" }}>{totalItems}</div>
          </div>
        </div>
        {data.notes && (
          <div style={{ ...noBreak, marginTop: "16px" }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: "600", marginBottom: "4px" }}>ADDITIONAL NOTES</div>
            <div style={{ color: "#0f172a", fontWeight: "400", fontSize: "11px", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {data.notes}
            </div>
          </div>
        )}
      </div>

      {/* Products Ordered */}
      <div style={{ ...noBreak, marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", letterSpacing: "0.05em", marginBottom: "8px", textTransform: "uppercase" }}>
          Selected Products
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "80%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "8px 0", textAlign: "left", color: "#64748b", fontWeight: "600", fontSize: "9px", textTransform: "uppercase" }}>
                Product
              </th>
              <th style={{ padding: "8px 0", textAlign: "center", color: "#64748b", fontWeight: "600", fontSize: "9px", textTransform: "uppercase" }}>
                Qty
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} style={{ ...noBreak, borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 0", color: "#0f172a", fontWeight: "500", wordBreak: "break-word" }}>
                  {item.product.title}
                </td>
                <td style={{ padding: "10px 0", textAlign: "center", color: "#0f172a" }}>
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ ...noBreak, marginTop: "auto", paddingTop: "24px", borderTop: "1px solid #e2e8f0", fontSize: "10px", color: "#64748b", textAlign: "center" }}>
        <p style={{ margin: "0 0 8px 0" }}>
          This enquiry has been submitted to our gifting consultants.
        </p>
        <p style={{ margin: "0" }}>
          We will reach out shortly with a personalized quotation.
        </p>
        <div style={{ marginTop: "16px", fontSize: "9px", color: "#94a3b8" }}>
          Nexus Innovative | Premium Corporate Gifting
        </div>
      </div>
    </div>
  );
}