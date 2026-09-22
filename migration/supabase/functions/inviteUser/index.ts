import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export default async function (req: Request): Promise<Response> {
  try {
    // Verificar que el que llama es admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (callerProfile?.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const input = await req.json();
    const { email, role } = input;

    if (!email || !role) return Response.json({ error: "email and role required" }, { status: 400 });
    if (!["admin", "user", "recepcion"].includes(role)) return Response.json({ error: "Invalid role" }, { status: 400 });

    // Invitar usuario vía Supabase Auth
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) throw error;

    // Crear perfil con el rol asignado
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        role,
      });
    }

    return Response.json({ ok: true, user: data.user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}