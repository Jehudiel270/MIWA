type EnvSpec = {
  name: string;
  value?: string | undefined | null;
  required?: boolean;
};

function getEnv(name: string, required = false): string | undefined {
  const v = process.env[name];
  if (required && (v === undefined || v === null || v === "")) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

export const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: getEnv("NEXT_PUBLIC_SUPABASE_URL", true),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", true),
  SUPABASE_SERVICE_ROLE_KEY: getEnv("SUPABASE_SERVICE_ROLE_KEY", true),
  DATABASE_URL: getEnv("DATABASE_URL", true),
  NEXT_PUBLIC_APP_URL: getEnv("NEXT_PUBLIC_APP_URL", false) || undefined,
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME", false) || undefined,
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY", false) || undefined,
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET", false) || undefined,
};

export function validateAll() {
  // iterate to trigger any missing required env errors
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
  ];
  const missing: string[] = [];
  for (const name of required) {
    const v = process.env[name];
    if (v === undefined || v === null || v === "") missing.push(name);
  }
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export default ENV;
