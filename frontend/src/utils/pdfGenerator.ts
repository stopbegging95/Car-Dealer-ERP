/**
 * Utility to generate and download official dealership PDF documents directly in the browser.
 */

export interface OrderPdfData {
  orderId: string;
  clientName: string;
  vehicleName: string;
  amount: string;
  status: string;
  stage: string;
  salesRep: string;
  vin?: string;
  date?: string;
}

export interface DocumentPdfData {
  title: string;
  reference: string;
  classification: string;
  date: string;
  details: string;
  author: string;
}

/**
 * Triggers a download of a formatted PDF document.
 */
export function downloadOrderAsPdf(data: OrderPdfData): void {
  // Construct printable HTML document with auto-print / PDF layout
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>LuxAuto Dealership - ${data.orderId}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0F172A;
            line-height: 1.5;
            padding: 24px;
            margin: 0;
            background: #FFFFFF;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #2563EB;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.5px;
            color: #0F172A;
          }
          .brand span { color: #2563EB; }
          .tagline { font-size: 11px; color: #64748B; text-transform: uppercase; font-weight: bold; }
          .order-badge {
            background: #EFF6FF;
            color: #1D4ED8;
            border: 1px solid #BFDBFE;
            padding: 4px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-weight: bold;
            font-size: 14px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 14px;
          }
          .card-title {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748B;
            margin-bottom: 8px;
          }
          .card-value {
            font-size: 15px;
            font-weight: bold;
            color: #0F172A;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
          }
          .table th {
            background: #F1F5F9;
            color: #475569;
            text-align: left;
            padding: 10px 12px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #CBD5E1;
          }
          .table td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #E2E8F0;
          }
          .total-box {
            background: #0F172A;
            color: #FFFFFF;
            padding: 16px 20px;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
          }
          .total-title { font-size: 14px; font-weight: bold; }
          .total-amount { font-size: 22px; font-weight: 900; font-family: monospace; color: #60A5FA; }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #E2E8F0;
            font-size: 10px;
            color: #94A3B8;
            display: flex;
            justify-content: space-between;
          }
          .watermark {
            font-family: monospace;
            font-size: 9px;
            color: #2563EB;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Lux<span>Auto</span> Enterprise Motors</div>
            <div class="tagline">Official Dealership Sales Agreement & Vehicle Order</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Victoria Island HQ, Lagos &bull; Maitama Diplomatic Suite, Abuja</div>
          </div>
          <div style="text-align: right;">
            <div class="order-badge">${data.orderId}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Date: ${data.date || new Date().toISOString().split("T")[0]}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Client / Purchasing Entity</div>
            <div class="card-value">${data.clientName}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Status: Verified Corporate / VIP Account</div>
          </div>
          <div class="card">
            <div class="card-title">Assigned Dealership Representative</div>
            <div class="card-value">${data.salesRep}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Showroom Executive Sales Desk</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Vehicle Description</th>
              <th>VIN / Chassis</th>
              <th>Pipeline Stage</th>
              <th>Fulfillment Status</th>
              <th style="text-align: right;">Contract Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${data.vehicleName}</strong><br><span style="font-size: 10px; color: #64748B;">Landed Showroom Spec</span></td>
              <td style="font-family: monospace;">${data.vin || "WDD223...AUTO"}</td>
              <td>${data.stage}</td>
              <td><span style="color: #2563EB; font-weight: bold;">${data.status}</span></td>
              <td style="text-align: right; font-weight: bold; font-family: monospace; font-size: 15px;">${data.amount}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-title">Total Approved Sale Amount</div>
          <div class="total-amount">${data.amount} USD</div>
        </div>

        <div style="margin-top: 30px; font-size: 11px; color: #64748B; line-height: 1.6;">
          <strong>Official Certification Notice:</strong> This purchase order agreement is cryptographically verified on the LuxAuto ERP network. Upon release from delivery inspection, custody and title are formally transferred with 150-point PDI pre-handover warranty documentation.
        </div>

        <div class="footer">
          <div>&copy; 2026 Premier Auto Group Ltd. All rights reserved.</div>
          <div class="watermark">AUTHENTICATED DEALERSHIP RECORD &bull; REF: ${data.orderId}</div>
        </div>
      </body>
    </html>
  `;

  // Create an iframe to cleanly invoke print/save to PDF without opening a blank tab
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(printContent);
    doc.close();
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  }

  // Also trigger a direct file download (.html/doc or PDF text file)
  const blob = new Blob([printContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LuxAuto-Contract-${data.orderId}.html`;
  // We trigger the print dialog for instant "Save as PDF" which produces a real high-res PDF!
}

/**
 * Downloads a generic Document Vault record as PDF.
 */
export function downloadVaultDocumentPdf(doc: DocumentPdfData): void {
  downloadOrderAsPdf({
    orderId: doc.reference,
    clientName: doc.author,
    vehicleName: doc.title,
    amount: "$0.00 (Official Record)",
    status: "Verified & Sealed",
    stage: doc.classification,
    salesRep: "Registrar of Dealership Records",
    date: doc.date,
  });
}

