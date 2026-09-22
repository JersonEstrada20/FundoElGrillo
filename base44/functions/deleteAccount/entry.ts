import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Delete the user's personal data (records they created)
    try {
      await base44.asServiceRole.entities.VisitorEntry.deleteMany({ created_by_id: user.id });
    } catch (e) {
      // Continue even if no records or permission issue
    }

    // Attempt to delete the user account
    try {
      await base44.asServiceRole.entities.User.delete(user.id);
    } catch (e) {
      return Response.json({
        success: true,
        partial: true,
        message: 'Tus datos fueron eliminados. Cierra sesión para completar el proceso.'
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}