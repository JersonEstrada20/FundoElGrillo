import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const { booking_id } = input;

    if (!booking_id) return Response.json({ error: 'booking_id required' }, { status: 400 });

    const booking = await base44.asServiceRole.entities.BookingRequest.get(booking_id);
    if (!booking) return Response.json({ error: 'Not found' }, { status: 404 });

    const users = await base44.asServiceRole.entities.User.list();
    const adminEmails = users.filter((u: any) => u.role === 'admin').map((u: any) => u.email).filter(Boolean);

    if (adminEmails.length === 0) return Response.json({ ok: true, sent: 0, reason: 'no_admins' });

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
      (booking.message ? `Mensaje: ${booking.message}\n` : '') +
      `\nRevisa la solicitud en el panel de administración → Solicitudes.`;

    let sent = 0;
    for (const email of adminEmails) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject,
          text: textBody,
        });
        sent++;
      } catch (e) {
        console.error(`Failed to email ${email}:`, (e as Error).message);
      }
    }

    return Response.json({ ok: true, sent });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}