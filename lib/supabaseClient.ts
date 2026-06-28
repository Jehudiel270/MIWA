import { createClient } from "@supabase/supabase-js";
import ENV, { validateAll } from "./env";

export function getSupabase() {
  validateAll();
  return createClient(
    ENV.NEXT_PUBLIC_SUPABASE_URL!,
    ENV.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export default getSupabase;
