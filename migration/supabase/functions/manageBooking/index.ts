import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
    const senderName = Deno.env.get("BREVO_SENDER_NAME") || "Cabañas Fundo El Grillo";
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Falta la configuración de Supabase.");
    if (!brevoApiKey || !senderEmail) throw new Error("Falta configurar el correo saliente.");
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "No autorizado." }, 401);
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.slice(7));
    if (userError || !user) return json({ error: "No autorizado." }, 401);
    const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profileError || !["admin", "recepcion", "recepcionista"].includes(profile?.role)) return json({ error: "No tienes permiso para gestionar solicitudes." }, 403);
    const { bookingId, status } = await req.json();
    if (!bookingId || !["confirmada", "rechazada", "pendiente"].includes(status)) return json({ error: "Datos de solicitud inválidos." }, 400);
    const { data: booking, error: bookingError } = await supabase.from("booking_request").select("*").eq("id", bookingId).single();
    if (bookingError || !booking) return json({ error: "Solicitud no encontrada." }, 404);
    const { error: updateError } = await supabase.from("booking_request").update({ status }).eq("id", bookingId);
    if (updateError) throw updateError;
    if (status === "pendiente") return json({ ok: true, status, emailSent: false });
    const confirmed = status === "confirmada";
    const subject = confirmed ? "Su reserva en Cabañas Fundo El Grillo ha sido confirmada" : "Actualización de su solicitud de reserva — Cabañas Fundo El Grillo";
    const text = confirmed
      ? `Estimado/a ${booking.name},\n\nNos alegra confirmar su reserva en Cabañas Fundo El Grillo.\n\nDetalles de la reserva:\n- Cabaña / Salón: ${booking.cabin}\n- Fecha de llegada: ${booking.arrival_date}\n- Fecha de salida: ${booking.departure_date}\n- Personas: ${booking.guests}\n\nNos pondremos en contacto con usted para coordinar los detalles del pago y la llegada.\n\n¡Gracias por elegirnos!\n\nCabañas Fundo El Grillo\nQuebrada del Ají · Quillota`
      : `Estimado/a ${booking.name},\n\nLamentamos informarle que no fue posible confirmar su solicitud de reserva para ${booking.cabin} entre el ${booking.arrival_date} y el ${booking.departure_date}.\n\nLo invitamos a contactarnos para explorar fechas alternativas.\n\nCabañas Fundo El Grillo\nQuebrada del Ají · Quillota`;
    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoApiKey, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ sender: { email: senderEmail, name: senderName }, to: [{ email: booking.email, name: booking.name }], subject, textContent: text }),
    });
    if (!emailResponse.ok) {
      console.error("Brevo error:", await emailResponse.text());
      return json({ error: "Se actualizó la solicitud, pero no se pudo enviar el correo." }, 502);
    }
    return json({ ok: true, status, emailSent: true });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Error inesperado." }, 500);
  }
});
