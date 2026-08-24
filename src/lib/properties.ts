import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export type PropertyStatus = "published" | "draft";

export interface Property {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  summary: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  heroImage: string;
  gallery: string[];
  hospitableListingId: string;
  hospitableEmbedCode: string;
  status: PropertyStatus;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// The row shape as D1 (SQLite) actually stores it (JSON columns as text, booleans as 0/1).
interface PropertyRow {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  summary: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string;
  heroImage: string;
  gallery: string;
  hospitableListingId: string;
  hospitableEmbedCode: string;
  status: string;
  featured: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function rowToProperty(row: PropertyRow): Property {
  return {
    ...row,
    amenities: safeParseArray(row.amenities),
    gallery: safeParseArray(row.gallery),
    status: row.status === "published" ? "published" : "draft",
    featured: !!row.featured,
  };
}

function safeParseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 80) || "property"
  );
}

export async function makeUniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const db = getDb();
  const base = slugify(name);
  let candidate = base;
  let n = 2;
  while (true) {
    const existing = await db
      .prepare("SELECT id FROM properties WHERE slug = ?")
      .bind(candidate)
      .first<{ id: string }>();
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

export interface ListOptions {
  onlyPublished?: boolean;
}

export async function getAllProperties(opts: ListOptions = {}): Promise<Property[]> {
  const db = getDb();
  const { results } = opts.onlyPublished
    ? await db
        .prepare(
          "SELECT * FROM properties WHERE status = 'published' ORDER BY featured DESC, sortOrder ASC, createdAt DESC"
        )
        .all<PropertyRow>()
    : await db
        .prepare("SELECT * FROM properties ORDER BY sortOrder ASC, createdAt DESC")
        .all<PropertyRow>();
  return results.map(rowToProperty);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM properties WHERE slug = ?")
    .bind(slug)
    .first<PropertyRow>();
  return row ? rowToProperty(row) : null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM properties WHERE id = ?")
    .bind(id)
    .first<PropertyRow>();
  return row ? rowToProperty(row) : null;
}

export interface PropertyInput {
  name: string;
  city: string;
  state: string;
  address: string;
  summary: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  heroImage: string;
  gallery: string[];
  hospitableListingId: string;
  hospitableEmbedCode: string;
  status: PropertyStatus;
  featured: boolean;
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const slug = await makeUniqueSlug(input.name);
  const maxSort = await db
    .prepare("SELECT MAX(sortOrder) as m FROM properties")
    .first<{ m: number | null }>();

  await db
    .prepare(
      `INSERT INTO properties
        (id, slug, name, city, state, address, summary, description, bedrooms, bathrooms, maxGuests,
         amenities, heroImage, gallery, hospitableListingId, hospitableEmbedCode, status, featured,
         sortOrder, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      slug,
      input.name,
      input.city,
      input.state,
      input.address,
      input.summary,
      input.description,
      input.bedrooms,
      input.bathrooms,
      input.maxGuests,
      JSON.stringify(input.amenities),
      input.heroImage,
      JSON.stringify(input.gallery),
      input.hospitableListingId,
      input.hospitableEmbedCode,
      input.status,
      input.featured ? 1 : 0,
      (maxSort?.m ?? 0) + 1,
      now,
      now
    )
    .run();

  return (await getPropertyById(id))!;
}

export async function updateProperty(
  id: string,
  input: PropertyInput
): Promise<Property | null> {
  const db = getDb();
  const existing = await getPropertyById(id);
  if (!existing) return null;
  const slug =
    existing.name === input.name ? existing.slug : await makeUniqueSlug(input.name, id);
  const now = new Date().toISOString();

  await db
    .prepare(
      `UPDATE properties SET
        slug = ?, name = ?, city = ?, state = ?, address = ?,
        summary = ?, description = ?, bedrooms = ?, bathrooms = ?,
        maxGuests = ?, amenities = ?, heroImage = ?, gallery = ?,
        hospitableListingId = ?, hospitableEmbedCode = ?,
        status = ?, featured = ?, updatedAt = ?
       WHERE id = ?`
    )
    .bind(
      slug,
      input.name,
      input.city,
      input.state,
      input.address,
      input.summary,
      input.description,
      input.bedrooms,
      input.bathrooms,
      input.maxGuests,
      JSON.stringify(input.amenities),
      input.heroImage,
      JSON.stringify(input.gallery),
      input.hospitableListingId,
      input.hospitableEmbedCode,
      input.status,
      input.featured ? 1 : 0,
      now,
      id
    )
    .run();

  return getPropertyById(id);
}

export async function deleteProperty(id: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM properties WHERE id = ?").bind(id).run();
}

export async function reorderProperty(id: string, direction: "up" | "down"): Promise<void> {
  const db = getDb();
  const all = await getAllProperties();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return;

  const a = all[index];
  const b = all[swapWith];
  const now = new Date().toISOString();
  // Run both updates as a single atomic batch so a partial failure can't
  // leave two properties with the same sortOrder.
  await db.batch([
    db
      .prepare("UPDATE properties SET sortOrder = ?, updatedAt = ? WHERE id = ?")
      .bind(b.sortOrder, now, a.id),
    db
      .prepare("UPDATE properties SET sortOrder = ?, updatedAt = ? WHERE id = ?")
      .bind(a.sortOrder, now, b.id),
  ]);
}
