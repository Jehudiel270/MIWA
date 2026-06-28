import * as fs from "fs";
import * as path from "path";

const Pool = require("pg").Pool;

async function runSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl || !dbPassword) {
    console.error("❌ Variables manquantes:");
    console.error(
      "   - NEXT_PUBLIC_SUPABASE_URL (depuis .env.local: ✓ existe)",
    );
    console.error(
      "   - SUPABASE_DB_PASSWORD (MANQUANTE - récupère du Dashboard Supabase)",
    );
    console.error("");
    console.error("📖 Comment obtenir SUPABASE_DB_PASSWORD:");
    console.error("   1. Va à https://app.supabase.com");
    console.error("   2. Sélectionne ton projet");
    console.error("   3. Settings → Database");
    console.error("   4. Copie le mot de passe dans SUPABASE_DB_PASSWORD=...");
    process.exit(1);
  }

  const urlObj = new URL(supabaseUrl);
  const host = urlObj.hostname;
  const projectId = host.split(".")[0];

  const schemaPath = path.join(
    process.cwd(),
    "scripts",
    "sql",
    "03-miwa-checkin-complete-schema.sql",
  );

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Fichier schéma non trouvé: ${schemaPath}`);
    process.exit(1);
  }

  const pool = new Pool({
    host,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: dbPassword,
  });

  try {
    console.log(`🔗 Connexion à Supabase (${projectId})...`);
    const client = await pool.connect();

    console.log("📝 Lecture du schéma SQL...");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    console.log(
      "⏳ Exécution du schéma (cela peut prendre quelques secondes)...",
    );
    await client.query(schema);

    console.log("\n✨ SUCCÈS! Le schéma Miwa Check-In est créé!");
    console.log("📋 Tables principales:");
    console.log("   ✓ users");
    console.log("   ✓ establishments");
    console.log("   ✓ rooms");
    console.log("   ✓ hotel_bookings");
    console.log("   ✓ payments");
    console.log("   ✓ + 10 autres tables");
    console.log(
      "\n🧹 Prochaine étape: nettoie les comptes de test en Supabase Dashboard",
    );
    console.log("   → Authentication → Users → Supprime les anciens tests");
    console.log("\n✅ Ensuite redémarre: npm run dev");

    client.release();
  } catch (error: any) {
    console.error("❌ Erreur lors de l'exécution du schéma:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSchema();
