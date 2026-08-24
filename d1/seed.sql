-- Sample property data so the site isn't empty on first run. Safe to run
-- once against a fresh database; re-running will fail on the UNIQUE slug
-- constraint rather than creating duplicates (that's intentional -- edit or
-- delete these sample listings from the admin panel instead of re-seeding).
--
--   npx wrangler d1 execute martinson-vacation-rentals-db --local --file=d1/seed.sql
--   npx wrangler d1 execute martinson-vacation-rentals-db --remote --file=d1/seed.sql

INSERT INTO properties
  (id, slug, name, city, state, address, summary, description, bedrooms, bathrooms, maxGuests,
   amenities, heroImage, gallery, hospitableListingId, hospitableEmbedCode, status, featured,
   sortOrder, createdAt, updatedAt)
VALUES
(
  '617c223f-2cbf-4735-95d0-d3b4a8bbf2a7',
  'cedar-creek-cabin',
  'Cedar Creek Cabin',
  'Gatlinburg',
  'TN',
  '123 Cedar Creek Rd, Gatlinburg, TN',
  'A cozy 3-bedroom cabin with a private hot tub and mountain views.',
  'Tucked into the hills just minutes from downtown, Cedar Creek Cabin sleeps 8 comfortably across three bedrooms. Wake up to mountain views from the wraparound deck, unwind in the private hot tub, and gather around the stone fireplace in the evening. Fully stocked kitchen, high-speed WiFi, and a dedicated workspace make it equally suited to a weekend getaway or a longer stay.

This is sample content -- edit or replace it from the admin panel.',
  3, 2, 8,
  '["Hot tub","Free parking","WiFi","Fireplace","Mountain view","Full kitchen"]',
  'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop"]',
  '', '', 'published', 1, 1,
  '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'
),
(
  'cd547250-66be-440f-acfe-2094501882d3',
  'harbor-view-loft',
  'Harbor View Loft',
  'Charleston',
  'SC',
  '45 Harbor St, Charleston, SC',
  'A bright 2-bedroom loft in the heart of historic downtown.',
  'Harbor View Loft puts you steps from Charleston''s best restaurants and shops, with a private balcony overlooking the water. Two bedrooms, a full kitchen, and thoughtful modern furnishings make this an easy home base for exploring the city.

This is sample content -- edit or replace it from the admin panel.',
  2, 1.5, 4,
  '["WiFi","Washer/dryer","Balcony","Walk to downtown","Air conditioning"]',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop',
  '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"]',
  '', '', 'published', 1, 2,
  '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'
),
(
  '2ce9d668-16d2-4488-9443-adb3e95f9d2f',
  'desert-sage-retreat',
  'Desert Sage Retreat',
  'Sedona',
  'AZ',
  '',
  'A draft listing -- not yet visible on the public site.',
  'This property is still being set up. It won''t appear on the public site until its status is changed to Published in the admin panel.',
  4, 3, 10,
  '["Pool","Desert views","Fire pit"]',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
  '[]',
  '', '', 'draft', 0, 3,
  '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'
);
