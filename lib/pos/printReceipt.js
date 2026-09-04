const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
  }).format(Number(value));

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function printReceipt({
  sale,
  items,
  customerName,
  customerPhone,
  settings,
}) {
  const receiptWindow = window.open("", "_blank", "width=420,height=720");

  if (!receiptWindow) {
    throw new Error(
      "The receipt window was blocked. Allow pop-ups and try again.",
    );
  }

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${item.quantity} × ${currency(item.price)}</span>
          </td>
          <td class="amount">${currency(item.price * item.quantity)}</td>
        </tr>`,
    )
    .join("");

  const saleDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(sale.created_at));

  receiptWindow.document.write(`<!doctype html>
    <html><head><title>Receipt ${escapeHtml(sale.invoice_number)}</title>
      <style>
        @page { size: 80mm auto; margin: 4mm; }
        * { box-sizing: border-box; }
        body { width: 72mm; margin: 0 auto; color: #000; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.4; }
        header, .center { text-align: center; }
        h1 { font-size: 18px; margin: 0; }
        p { margin: 3px 0; }
        .muted { color: #444; }
        .rule { border-top: 1px dashed #000; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 5px 0; vertical-align: top; }
        td span { display: block; color: #444; }
        .amount { text-align: right; white-space: nowrap; }
        .totals td { padding: 2px 0; }
        .total { font-size: 14px; font-weight: 700; }
        @media screen { body { padding: 16px; } }
      </style>
    </head><body>
      <header><h1>${escapeHtml(settings?.pharmacy_name || "MediFlow Pharmacy")}</h1><p class="muted">Point of Sale Receipt</p>${settings?.address ? `<p class="muted">${escapeHtml(settings.address)}</p>` : ""}${settings?.phone ? `<p class="muted">${escapeHtml(settings.phone)}</p>` : ""}</header>
      <div class="rule"></div>
      <p><strong>Invoice:</strong> ${escapeHtml(sale.invoice_number)}</p>
      <p><strong>Date:</strong> ${escapeHtml(saleDate)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(customerName || sale.customer_name)}</p>
      ${customerPhone || sale.customer_phone ? `<p><strong>Phone:</strong> ${escapeHtml(customerPhone || sale.customer_phone)}</p>` : ""}
      <p><strong>Payment:</strong> ${escapeHtml(sale.payment_method)}</p>
      <div class="rule"></div>
      <table>${itemRows}</table>
      <div class="rule"></div>
      <table class="totals">
        <tr><td>Subtotal</td><td class="amount">${currency(sale.subtotal)}</td></tr>
        ${Number(sale.discount_amount) > 0 ? `<tr><td>Discount</td><td class="amount">−${currency(sale.discount_amount)}</td></tr>` : ""}
        <tr><td>Tax</td><td class="amount">${currency(sale.tax_amount)}</td></tr>
        <tr class="total"><td>Total</td><td class="amount">${currency(sale.grand_total)}</td></tr>
      </table>
      <div class="rule"></div>
      <p class="center">${escapeHtml(settings?.receipt_footer || "Thank you for choosing MediFlow Pharmacy.")}</p>
      <p class="center muted">Please keep this receipt for your records.</p>
      <script>window.onload = () => { window.focus(); window.print(); };</script>
    </body></html>`);
  receiptWindow.document.close();
}
