// RUT chileno: formato y validación con dígito verificador (algoritmo del módulo 11)

/** Limpia el RUT removiendo puntos, guiones y espacios → "123456789" */
export function cleanRut(rut) {
  return (rut || "").replace(/[.\-\s]/g, "").toUpperCase();
}

/** Formatea un RUT al patrón canónico "12.345.678-9" */
export function formatRut(rut) {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  let formatted = "";
  for (let i = body.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) formatted = "." + formatted;
    formatted = body[i] + formatted;
  }
  return `${formatted}-${dv}`;
}

/** Calcula el dígito verificador esperado para el cuerpo numérico del RUT */
function calcDv(body) {
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const mod = 11 - (sum % 11);
  if (mod === 11) return "0";
  if (mod === 10) return "K";
  return String(mod);
}

/** Valida un RUT chileno completo (cuerpo + dígito verificador) */
export function isValidRut(rut) {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  return calcDv(body) === dv;
}