# Martinson Vacation Rentals

A property management website: a public-facing site where guests can browse
your properties and book direct, plus a simple admin panel where you add and
edit properties yourself — no code required for day-to-day use.

- **Public site** — home page, property listings, property detail pages
  with photos/amenities, an About page, and a Contact page with a working
  inquiry form.
- **Admin panel** (`/admin`) — password-protected. Add, edit, publish/unpublish,
  reorder, and delete properties. Upload photos or paste image links. See
  contact-form messages from guests.
- **Direct booking via Hospitable** — each property has a spot to paste
  Hospitable's direct-booking widget embed code, so guests can check
  availability and book without leaving your site.

This project was built with Next.js. You don't need to know that to run it —
just follow the steps below.

## Running it on your own computer

This site runs on Cloudflare (Workers, D1 for the database, R2 for photo
storage) rather than a traditional server — see `DEPLOYMENT.md` for why and
for how to put it live. You don't need a Cloudflare account just to try it
out locally, though.

You'll need [Node.js](https://nodejs.org) installed (version 20 or newer).

1. Open a terminal in this folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Edit `.dev.vars` (already created for you) and set:
   - `ADMIN_PASSWORD` — the password you'll use to log in to `/admin`.
   - `SESSION_SECRET` — any long random string (run
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     to generate one).
4. Create the local database tables (this uses a local, on-your-computer
   copy of the database — it doesn't touch anything on Cloudflare):
   ```
   npx wrangler d1 execute martinson-vacation-rentals-db --local --file=d1/schema.sql
   ```
5. Add a few sample properties so the site isn't empty (safe to skip if
   you'd rather add your own from the start):
   ```
   npx wrangler d1 execute martinson-vacation-rentals-db --local --file=d1/seed.sql
   ```
6. Start the site:
   ```
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser. The
   admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

If you'd rather run it exactly the way it runs in production (through
Cloudflare's own local simulator, including R2 photo storage), use
`npm run preview` instead of `npm run dev` and open
[http://localhost:8787](http://localhost:8787).

## Adding your properties

1. Go to `/admin` and log in with your `ADMIN_PASSWORD`.
2. Click **Add property**.
3. Fill in the name, location, bedrooms/bathrooms/guests, description, and
   amenities.
4. Add photos — either paste an image URL (from Hospitable, your phone's
   cloud photos, etc.) or click **Upload** to upload a file directly.
5. Set **Status** to **Published** once you're ready for it to appear on the
   live site (leave it as **Draft** while you're still working on it).
6. Save. It'll immediately show up on the public site.

## Connecting Hospitable for direct booking

1. In Hospitable, open the property's **Direct Booking** site settings and
   find the **widget embed code** (usually an `<iframe>` snippet, sometimes
   a `<div>` + `<script>` pair).
2. In this site's admin panel, edit the matching property and paste that
   code into the **Direct booking embed code** field, under "Hospitable
   direct booking."
3. Save. The property's page will now show a live booking widget instead of
   the "not connected yet" placeholder.

If you don't have Hospitable's Direct Booking or Public API access yet,
that's fine — the site works normally without it, it'll just show a
placeholder in place of the booking widget until you connect it. Hospitable
support docs: [Direct Booking](https://help.hospitable.com/en/collections/3276701-direct-booking).

## Guest messages

Messages submitted through the Contact page show up under **Inquiries** in
the admin panel (with an unread badge in the nav). Nothing gets emailed to
you automatically yet — check that page periodically, or see
`DEPLOYMENT.md` if you'd like help wiring up email notifications later.

## Where things are stored

Properties and guest messages are stored in a Cloudflare D1 database (a
managed, serverless database — nothing to install or maintain), and
uploaded photos are stored in a Cloudflare R2 bucket (object storage,
similar to how photos work on any modern web app). Neither lives inside
this code folder, so there's nothing to "back up" from the folder itself —
but see `DEPLOYMENT.md` for how to export a backup of your D1 data
periodically, which is still a good habit.

## Project structure (for reference)

```
src/app/                  Pages (public site + admin panel)
src/app/admin/actions.ts  All the admin "add/edit/delete/login" logic
src/app/img/[...key]/     Serves uploaded photos back out of R2
src/components/           Reusable UI pieces
src/lib/db.ts             Gets the D1 database connection for the current request
src/lib/properties.ts     Property data logic
src/lib/inquiries.ts      Contact-form message logic
d1/schema.sql             Database table definitions
d1/seed.sql                Sample property data
wrangler.jsonc            Cloudflare Worker configuration (D1/R2 bindings, etc.)
```

See `DEPLOYMENT.md` for how to put this live on the internet.
