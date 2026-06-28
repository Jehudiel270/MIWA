import { createClient } from "@/lib/supabaseServer";

export async function checkAdminRole() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { isAdmin: false, error: "Unauthorized" };
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (userError || !user || user.role !== "admin") {
    return { isAdmin: false, error: "Not an admin" };
  }

  return { isAdmin: true, userId: authData.user.id };
}

export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>,
  metadata?: Record<string, any>,
) {
  const supabase = await createClient();
  await supabase.from("admin_logs").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details: {
      ...details,
      ...metadata,
    },
  });
}
