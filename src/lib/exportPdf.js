import { jsPDF } from "jspdf";

export function exportToPdf(data, columns, filename) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const tableW = pageW - margin * 2;
  const colW = tableW / columns.length;
  const rowH = 7;
  let y = 18;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(filename, margin, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Generado: ${new Date().toLocaleString("es-CL")}`, margin, y);
  y += 6;

  const drawHeader = () => {
    doc.setFillColor(28, 46, 36);
    doc.rect(margin, y, tableW, rowH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    columns.forEach((col, i) => {
      doc.text(String(col.label).substring(0, 28), margin + i * colW + 1.5, y + 4.5);
    });
    y += rowH;
  };

  drawHeader();
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");

  data.forEach((row, idx) => {
    if (y > pageH - 15) {
      doc.addPage();
      y = 18;
      drawHeader();
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "normal");
    }
    if (idx % 2 === 0) {
      doc.setFillColor(245, 248, 244);
      doc.rect(margin, y, tableW, rowH, "F");
    }
    columns.forEach((col, i) => {
      doc.text(String(row[col.key] || "").substring(0, 28), margin + i * colW + 1.5, y + 4.5);
    });
    y += rowH;
  });

  doc.save(`${filename}.pdf`);
}