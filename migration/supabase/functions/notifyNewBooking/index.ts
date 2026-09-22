import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Fundo El Grillo <noreply@fundoelgrillo.cl>";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export default async function (req: Request): Promise<Response> {
  try {
    const input = await req.json();
    const { booking_id } = input;

    if (!booking_id) return Response.json({ error: "booking_id required" }, { status: 400 });

    const { data: booking } = await supabase
      .from("booking_request")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    // Obtener emails de admins
    const { data: admins } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "admin")
      .not("email", "is", null);

    const adminEmails = (admins || []).map((a: any) => a.email).filter(Boolean);
    if (adminEmails.length === 0) return Response.json({ ok: true, sent: 0, reason: "no_admins" });

    const subject = `Nueva solicitud de reserva — ${booking.cabin}`;
    const textBody =
      `Nueva solicitud de reserva recibida desde el sitio web.\n\n` +
      `Nombre: ${booking.name}\n` +
      `Email: ${booking.email}\n` +
      `Teléfono: ${booking.phone}\n` +
      `Cabaña: ${booking.cabin}\n` +
      `Llegada: ${booking.arrival_date}\n` +
      `Salida: ${booking.departure_date}\n` +
      `Personas: ${booking.guests}\n` +
      (booking.message ? `Mensaje: ${booking.message}\n` : "") +
      `\nRevisa la solicitud en el panel de administración → Solicitudes.`;

    let sent = 0;
    for (const email of adminEmails) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: email,
            subject,
            text: textBody,
          }),
        });
        sent++;
      } catch (e) {
        console.error(`Failed to email ${email}:`, e.message);
      }
    }

    return Response.json({ ok: true, sent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}