-- D1 schema for Martinson Vacation Rentals.
--
-- Apply once, before your first deploy (and again any time you update this
-- file), with:
--   npx wrangler d1 execute martinson-vacation-rentals-db --local --file=d1/schema.sql
--   npx wrangler d1 execute martinson-vacation-rentals-db --remote --file=d1/schema.sql
--
-- --local applies to the local D1 emulation used by `npm run dev` / `npm run
-- preview`. --remote applies to the real, deployed database in your
-- Cloudflare account. Run both. See DEPLOYMENT.md for the full walkthrough.

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms REAL NOT NULL DEFAULT 0,
  maxGuests INTEGER NOT NULL DEFAULT 0,
  amenities TEXT NOT NULL DEFAULT '[]',
  heroImage TEXT NOT NULL DEFAULT '',
  gallery TEXT NOT NULL DEFAULT '[]',
  hospitableListingId TEXT NOT NULL DEFAULT '',
  hospitableEmbedCode TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  featured INTEGER NOT NULL DEFAULT 0,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  propertyName TEXT NOT NULL DEFAULT '',
  read INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL
);
