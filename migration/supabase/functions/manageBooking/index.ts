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
    // Verificar auth del usuario que llama
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // Verificar rol admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const input = await req.json();
    const { bookingId, status } = input;

    if (!bookingId || !["confirmada", "rechazada", "pendiente"].includes(status)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { data: booking } = await supabase
      .from("booking_request")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    await supabase.from("booking_request").update({ status }).eq("id", bookingId);

    // Enviar email solo al confirmar o rechazar
    if (status === "confirmada" || status === "rechazada") {
      const subject = status === "confirmada"
        ? "Su reserva en Cabañas Fundo El Grillo ha sido confirmada"
        : "Actualización de su solicitud de reserva — Cabañas Fundo El Grillo";

      const textBody = status === "confirmada"
        ? `Estimado/a ${booking.name},\n\n` +
          `Nos alegra confirmar su reserva en Cabañas Fundo El Grillo.\n\n` +
          `Detalles de la reserva:\n` +
          `- Cabaña / Salón: ${booking.cabin}\n` +
          `- Fecha de llegada: ${booking.arrival_date}\n` +
          `- Fecha de salida: ${booking.departure_date}\n` +
          `- Personas: ${booking.guests}\n\n` +
          `Nos pondremos en contacto con usted para coordinar los detalles del pago y la llegada.\n\n` +
          `¡Gracias por elegirnos!\n\n` +
          `Cabañas Fundo El Grillo\nQuebrada del Ají · Quillota`
        : `Estimado/a ${booking.name},\n\n` +
          `Lamentamos informarle que no fue posible confirmar su solicitud de reserva para ${booking.cabin} ` +
          `entre el ${booking.arrival_date} y el ${booking.departure_date}.\n\n` +
          `Lo invitamos a contactarnos para explorar fechas alternativas.\n\n` +
          `Cabañas Fundo El Grillo\nQuebrada del Ají · Quillota`;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: booking.email,
            subject,
            text: textBody,
          }),
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr.message);
      }
    }

    return Response.json({ ok: true, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}