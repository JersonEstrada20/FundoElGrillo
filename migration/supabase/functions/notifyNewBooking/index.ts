import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !fromEmail) throw new Error("Falta configurar el correo saliente.");
    const { booking_id } = await req.json();
    if (!booking_id) return json({ error: "booking_id es requerido." }, 400);
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: booking, error: bookingError } = await supabase.from("booking_request").select("*").eq("id", booking_id).single();
    if (bookingError || !booking) return json({ error: "Solicitud no encontrada." }, 404);
    const { data: staff } = await supabase.from("profiles").select("email").in("role", ["admin", "recepcion", "recepcionista"]).not("email", "is", null);
    const recipients = [...new Set((staff || []).map(({ email }) => email).filter(Boolean))];
    if (!recipients.length) return json({ ok: true, sent: 0 });
    const text = `Nueva solicitud de reserva recibida desde el sitio web.\n\nNombre: ${booking.name}\nEmail: ${booking.email}\nTeléfono: ${booking.phone}\nCabaña: ${booking.cabin}\nLlegada: ${booking.arrival_date}\nSalida: ${booking.departure_date}\nPersonas: ${booking.guests}\n${booking.message ? `Mensaje: ${booking.message}\n` : ""}\nRevisa la solicitud en el panel → Solicitudes.`;
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: fromEmail, to: recipients, subject: `Nueva solicitud de reserva — ${booking.cabin}`, text }) });
    if (!response.ok) throw new Error(`No se pudo enviar la notificación: ${await response.text()}`);
    return json({ ok: true, sent: recipients.length });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Error inesperado." }, 500);
  }
});
