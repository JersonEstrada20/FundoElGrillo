// Exporta un arreglo de objetos a CSV y dispara la descarga en el navegador

function escapeCsv(value) {
  const s = value == null ? "" : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * @param {Array<Object>} rows - filas a exportar
 * @param {Array<{key: string, label: string}>} columns - definición de columnas
 * @param {string} filename - nombre del archivo (sin extensión)
 */
export function exportToCsv(rows, columns, filename = "export") {
  const header = columns.map((c) => escapeCsv(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsv(row[c.key])).join(","))
    .join("\n");
  const csv = "\uFEFF" + header + "\n" + body; // BOM para que Excel lea UTF-8

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}