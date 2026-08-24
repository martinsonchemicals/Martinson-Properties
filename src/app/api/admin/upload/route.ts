import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isLoggedIn } from "@/lib/auth";

// Saves an uploaded image to the R2 bucket (binding: PHOTOS) and returns a
// public URL served back out by src/app/img/[...key]/route.ts. R2 keeps
// this working the same way in local dev (via wrangler's local R2
// emulation) and once actually deployed to Cloudflare — unlike the old
// local-filesystem version, which only worked on hosts with a persistent
// disk.
export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  if (!env.PHOTOS) {
    return NextResponse.json(
      { error: "Photo storage is not configured (missing R2 binding PHOTOS)" },
      { status: 500 }
    );
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `properties/${randomUUID()}.${ext || "jpg"}`;

  await env.PHOTOS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return NextResponse.json({ url: `/img/${key}` });
}
