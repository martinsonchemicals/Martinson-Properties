import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const SESSION_COOKIE = "mvr_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

// Cloudflare Workers don't reliably expose wrangler.jsonc `vars` / dashboard
// secrets via plain `process.env` at runtime (only guaranteed at build time
// for NEXT_PUBLIC_* vars). getCloudflareContext().env is the documented,
// guaranteed-correct way to read them from server code, and it also picks
// up .dev.vars automatically during local `next dev` / `wrangler dev`.
function getEnvVar(name: "SESSION_SECRET" | "ADMIN_PASSWORD"): string | undefined {
  try {
    const { env } = getCloudflareContext();
    if (env[name]) return env[name];
  } catch {
    // Not running in a Cloudflare context (e.g. a plain `next build` type
    // check) — fall through to process.env below.
  }
  return process.env[name];
}

function getSecret(): string {
  // Falls back to a default so the site still runs out of the box, but you
  // should set SESSION_SECRET (and ADMIN_PASSWORD) yourself before this
  // site is reachable by anyone else. See .env.example / .dev.vars.
  return getEnvVar("SESSION_SECRET") || "martinson-vacation-rentals-dev-secret";
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionValue(): string {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${expires}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return true;
}

export function checkPassword(candidate: string): boolean {
  const actual = getEnvVar("ADMIN_PASSWORD") || "changeme";
  // Constant-time-ish comparison for a small string; this is a
  // single-admin site so a full auth system would be overkill.
  const a = Buffer.from(candidate.padEnd(64, " "));
  const b = Buffer.from(actual.padEnd(64, " "));
  return a.length === b.length && timingSafeEqual(a, b) && candidate === actual;
}

export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

async function isHttpsRequest(): Promise<boolean> {
  // Most hosts (Render, Railway, Vercel, a Nginx/Caddy reverse proxy, etc.)
  // terminate HTTPS in front of the app and forward this header. Trust it
  // when present. If it's absent, fall back to treating the connection as
  // whatever it actually is — this keeps admin login working out of the
  // box on a bare `next start` over plain HTTP (e.g. while first setting a
  // deployment up, or on an internal network) instead of silently breaking
  // it, since a cookie marked "secure" is simply never sent over HTTP.
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto");
  if (proto) return proto === "https";
  return false;
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: await isHttpsRequest(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Call at the top of any protected server component/page. */
export async function requireAdmin(): Promise<void> {
  if (!(await isLoggedIn())) {
    redirect("/admin/login");
  }
}
