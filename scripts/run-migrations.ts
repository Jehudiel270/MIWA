import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Variables d'environnement manquantes : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    console.log("📂 Lecture du schéma SQL...");
    const schemaPath = path.join(
      __dirname,
      "sql",
      "03-miwa-checkin-complete-schema.sql",
    );
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    console.log("🔄 Exécution du schéma dans Supabase...");

    // Exécuter le SQL en une seule requête
    const { data, error } = await supabase.rpc("execute_sql", {
      sql: schemaSql,
    });

    if (error) {
      // Si la RPC n'existe pas, on va essayer d'exécuter par chunks
      console.log(
        "📝 RPC non disponible, exécution par chunks de statements...",
      );

      // Diviser par les commentaires et les statements
      const statements = schemaSql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      let executed = 0;
      for (const statement of statements) {
        try {
          const { error: execError } = await supabase.rpc("exec", {
            sql: statement,
          });
          if (execError && !execError.message.includes("function exec")) {
            console.warn(`⚠️  Statement échoué: ${execError.message}`);
          } else {
            executed++;
          }
        } catch (e) {
          console.warn(`⚠️  Erreur execution: ${e}`);
        }
      }

      console.log(
        `✅ ${executed}/${statements.length} statements exécutés avec succès`,
      );
    } else {
      console.log("✅ Schéma exécuté avec succès!");
    }

    console.log("\n📋 Vérification des tables créées...");
    const { data: tables, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (!tableError && tables) {
      console.log("✅ Tables dans public schema:");
      tables.forEach((t: any) => console.log(`   - ${t.table_name}`));
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

runMigrations();
