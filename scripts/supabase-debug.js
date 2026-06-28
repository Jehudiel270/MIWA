const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const env = envContent
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim();
    return acc;
  }, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
console.log("SUPABASE_URL", !!supabaseUrl);
console.log("SUPABASE_SERVICE_ROLE_KEY", !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log("auth exists", typeof supabase.auth);
console.log("auth.admin exists", !!supabase.auth?.admin);
console.log("createUser exists", typeof supabase.auth?.admin?.createUser);
console.log("signUp exists", typeof supabase.auth?.signUp);

try {
  const userMetadataMethods = Object.keys(supabase.auth || {}).filter(
    (k) => k.includes("create") || k.includes("sign"),
  );
  console.log("auth methods", userMetadataMethods);
} catch (e) {
  console.error("error listing auth methods", e);
}
