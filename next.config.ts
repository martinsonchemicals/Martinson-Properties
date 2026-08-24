import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Lets `next dev` (used by `npm run dev`) see local D1/R2 bindings from
// wrangler.jsonc, so getCloudflareContext() works during normal local
// development too, not just `npm run preview`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
