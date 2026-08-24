import { getCloudflareContext } from "@opennextjs/cloudflare";

// The database is a Cloudflare D1 instance (serverless SQLite). Unlike the
// old better-sqlite3 setup, there's no local file and no connection to
// open — each call just grabs the binding for the current request from the
// Worker's environment. D1's schema is created once, up front, via
// `schema.sql` (see README/DEPLOYMENT for the `wrangler d1 execute` command)
// rather than a `CREATE TABLE IF NOT EXISTS` on every request.
//
// During local development (`next dev` or `npm run preview`), this
// transparently talks to a local D1 emulation backed by wrangler.jsonc's
// `d1_databases` config — no real Cloudflare account needed until you
// actually deploy.
export function getDb(): D1Database {
  const { env } = getCloudflareContext();
  if (!env.DB) {
    throw new Error(
      "D1 binding 'DB' is not available. Make sure wrangler.jsonc has a d1_databases " +
        "entry named DB, and that you're running via `next dev`/`npm run preview` " +
        "(not a plain Node script) so Cloudflare bindings are wired up."
    );
  }
  return env.DB;
}
