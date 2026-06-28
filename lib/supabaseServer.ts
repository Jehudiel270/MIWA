import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ENV, validateAll } from "./env";

validateAll();

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    ENV.NEXT_PUBLIC_SUPABASE_URL!,
    ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) =>
          c.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  );
}
