const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(process.cwd(), ".env.local");
const envLines = fs
  .readFileSync(envPath, "utf8")
  .split(/\r?\n/)
  .filter(Boolean);
const env = envLines.reduce((acc, line) => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) acc[m[1]] = m[2].trim();
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log("auth.admin.createUser:", typeof supabase.auth.admin?.createUser);
console.log(supabase.auth.admin?.createUser?.toString());

async function test() {
  const email = `debug+${Date.now()}@example.com`;
  const password = "Password123!";
  console.log("createUser test email:", email);
  try {
    const res = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: "Debug User", phone: "0000000000" },
      email_confirm: true,
    });
    console.log("createUser result", res);
  } catch (err) {
    console.error("createUser error", err);
  }
}

test();
