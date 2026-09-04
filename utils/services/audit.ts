import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface AuditLogParams {
  userId?: string;
  action: string;
  entityName: string;
  entityId: string;
  payload?: any;
}

export async function logAuditEvent({
  userId,
  action,
  entityName,
  entityId,
  payload = {},
}: AuditLogParams) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    await supabase.from("audit_logs").insert({
      user_id: userId || null,
      action,
      entity_name: entityName,
      entity_id: entityId,
      payload,
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}
