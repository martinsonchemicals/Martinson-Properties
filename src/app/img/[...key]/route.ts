import { getCloudflareContext } from "@opennextjs/cloudflare";

// Serves images stored in the R2 bucket (binding: PHOTOS) back out
// publicly, e.g. /img/properties/<uuid>.jpg. Property photos are stored in
// R2 rather than committed to the repo or Cloudflare's asset bundle, since
// they're uploaded by admins at runtime.
//
// This route (rather than R2's own *.r2.dev public bucket URLs) is used so
// image URLs stay same-origin and don't depend on any extra dashboard
// configuration — it just works as soon as the PHOTOS binding is set up.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join("/");

  const { env } = getCloudflareContext();
  if (!env.PHOTOS) {
    return new Response("Photo storage is not configured", { status: 500 });
  }

  const object = await env.PHOTOS.get(objectKey);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  // Uploaded photos are content-addressed by a random UUID filename and
  // never overwritten in place, so it's safe to cache them for a long time.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
