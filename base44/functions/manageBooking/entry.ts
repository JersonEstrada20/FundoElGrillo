import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const input = await req.json();
    const { bookingId, status } = input;

    if (!bookingId || !['confirmada', 'rechazada', 'pendiente'].includes(status)) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    const booking = await base44.asServiceRole.entities.BookingRequest.get(bookingId);
    if (!booking) return Response.json({ error: 'Not found' }, { status: 404 });

    await base44.asServiceRole.entities.BookingRequest.update(bookingId, { status });

    // Enviar email solo al confirmar o rechazar
    if (status === 'confirmada' || status === 'rechazada') {
      const subject = status === 'confirmada'
        ? 'Su reserva en Cabañas Fundo El Grillo ha sido confirmada'
        : 'Actualización de su solicitud de reserva — Cabañas Fundo El Grillo';

      const textBody = status === 'confirmada'
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
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.email,
          subject,
          text: textBody,
        });
      } catch (emailErr) {
        // El estado se actualizó; el email puede fallar si no hay dominio custom configurado
        console.error('Email send failed:', emailErr.message);
      }
    }

    return Response.json({ ok: true, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}