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

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
        new Date(value),
      )
    : "—";

export function printPurchaseBill(order) {
  const billWindow = window.open("", "_blank", "width=960,height=720");

  if (!billWindow) {
    throw new Error(
      "The bill window was blocked. Allow pop-ups and try again.",
    );
  }

  const rows = order.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(item.medicine_name)}</strong></td>
          <td class="number">${item.quantity_ordered}</td>
          <td class="number">${item.quantity_received}</td>
          <td class="amount">${currency(item.unit_cost)}</td>
          <td class="amount">${currency(item.quantity_ordered * item.unit_cost)}</td>
        </tr>`,
    )
    .join("");

  billWindow.document.write(`<!doctype html>
    <html><head><title>Purchase Bill ${escapeHtml(order.po_number)}</title>
      <style>
        @page { size: A4 portrait; margin: 16mm; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.45; }
        .document { max-width: 180mm; margin: 0 auto; }
        header { display: flex; justify-content: space-between; gap: 32px; border-bottom: 2px solid #111; padding-bottom: 18px; }
        h1 { margin: 0; font-size: 25px; letter-spacing: -0.4px; }
        h2 { margin: 4px 0 0; font-size: 13px; font-weight: 400; color: #444; }
        .bill-title { text-align: right; }
        .bill-title strong { display: block; font-size: 22px; }
        .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
        .meta-box { border: 1px solid #bbb; padding: 13px; }
        .label { display: block; margin-bottom: 4px; color: #555; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        p { margin: 2px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 22px; }
        th { background: #eee; font-size: 10px; letter-spacing: 0.06em; text-align: left; text-transform: uppercase; }
        th, td { border: 1px solid #bbb; padding: 10px; vertical-align: top; }
        .number, .amount { text-align: right; white-space: nowrap; }
        .summary { display: flex; justify-content: flex-end; margin-top: 18px; }
        .summary table { width: 70mm; margin: 0; }
        .summary td { border-width: 0 0 1px; padding: 7px 0; }
        .summary .total td { border-top: 2px solid #111; border-bottom: 0; font-size: 15px; font-weight: 700; padding-top: 10px; }
        footer { margin-top: 38px; border-top: 1px solid #bbb; padding-top: 12px; color: #555; font-size: 10px; }
        @media screen { body { padding: 24px; background: #f5f5f5; } .document { padding: 20px; background: #fff; box-shadow: 0 1px 4px #bbb; } }
      </style>
    </head><body><main class="document">
      <header>
        <div><h1>MediFlow Pharmacy</h1><h2>Procurement & Inventory Management</h2></div>
        <div class="bill-title"><strong>Purchase Bill</strong><span>${escapeHtml(order.po_number)}</span></div>
      </header>
      <section class="meta">
        <div class="meta-box"><span class="label">Supplier</span><p><strong>${escapeHtml(order.supplier_name)}</strong></p><p>Purchase status: ${escapeHtml(order.status)}</p></div>
        <div class="meta-box"><span class="label">Order details</span><p><strong>Order date:</strong> ${escapeHtml(formatDate(order.order_date))}</p><p><strong>Expected delivery:</strong> ${escapeHtml(formatDate(order.expected_delivery_date))}</p><p><strong>Recorded by:</strong> ${escapeHtml(order.created_by_name)}</p></div>
      </section>
      <table><thead><tr><th>#</th><th>Medicine</th><th class="number">Ordered</th><th class="number">Received</th><th class="amount">Unit cost</th><th class="amount">Line total</th></tr></thead><tbody>${rows}</tbody></table>
      <section class="summary"><table><tr><td>Purchase total</td><td class="amount">${currency(order.total_amount)}</td></tr><tr class="total"><td>Amount due</td><td class="amount">${currency(order.total_amount)}</td></tr></table></section>
      <footer>This bill was generated from the MediFlow Pharmacy Management System.</footer>
    </main><script>window.onload = () => { window.focus(); window.print(); };</script></body></html>`);
  billWindow.document.close();
}
