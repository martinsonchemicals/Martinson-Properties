# Putting this site live on Cloudflare

This site runs entirely on Cloudflare: **Workers** hosts the app itself,
**D1** is the database (properties + guest messages), and **R2** stores
uploaded photos. Since `martinsonproperties.com`'s DNS already lives on
Cloudflare, this keeps everything — domain, hosting, database, and photo
storage — in one account and one dashboard.

Everything below is done through the Cloudflare dashboard in your browser.
The only exception is applying the two `.sql` files (schema and sample
data) to your database, which needs one command in a terminal — step-by-step
instructions for that are included.

You'll need:
- A Cloudflare account (you already have one, from setting up
  `martinsonproperties.com`'s DNS).
- The GitHub repository you already created for this site.
- [Node.js](https://nodejs.org) installed on your computer (version 20 or
  newer) — only needed for the one database-setup command in Step 3.

---

## Step 1: Get this code into your GitHub repository

This folder has been updated since whatever you originally uploaded (it's
now built for Cloudflare instead of a generic Node host). Replace the
contents of your existing GitHub repository with everything in this folder.

**If you're comfortable with git**, the fastest way:
```
cd path/to/this/folder
git init
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git add .
git commit -m "Migrate to Cloudflare (Workers + D1 + R2)"
git branch -M main
git push -u origin main --force
```
(Use `--force` only if the repo currently has old/placeholder content you
want to fully replace. Drop it if you want a normal merge instead.)

**If you'd rather not use git commands**, delete the existing files in your
GitHub repository through the GitHub website (select all → delete), then
use **Add file → Upload files** to drag in this folder's contents. Skip the
`node_modules` folder if you have one locally — it's automatically
reinstalled during deployment and is far too large to upload. `.wrangler`
and `.open-next` (if present) can be skipped too; they're just local build
output.

---

## Step 2: Create the database and photo storage

1. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to
   **Storage & Databases** in the left sidebar.
2. Click **D1 SQL Database** → **Create database**. Name it
   `martinson-vacation-rentals-db` (matching the name already in
   `wrangler.jsonc` keeps things simple, though the name itself doesn't
   technically have to match). Click **Create**.
3. On the new database's page, copy its **Database ID** (a long string of
   letters and numbers near the top) — you'll need it in Step 4.
4. Back in **Storage & Databases**, click **R2 Object Storage** → **Create
   bucket**. Name it `martinson-vacation-rentals-photos` (same note as
   above — matching the name in `wrangler.jsonc` is simplest). Location: Automatic. Click
   **Create bucket**.

You don't need to configure anything else on the R2 bucket — the site
serves photos back out itself, so there's no need to enable public bucket
access.

---

## Step 3: Create the database tables

D1 needs its tables created once before the site can use it. From a
terminal, in this project folder:

```
npm install
npx wrangler login
```

`wrangler login` opens a browser tab asking you to authorize access to your
Cloudflare account — approve it, then return to the terminal.

Then run:
```
npx wrangler d1 execute martinson-vacation-rentals-db --remote --file=d1/schema.sql
```

(Optional) Add a few sample properties so the site isn't empty at first —
skip this if you'd rather add your own properties from the start:
```
npx wrangler d1 execute martinson-vacation-rentals-db --remote --file=d1/seed.sql
```

`--remote` here means "the real database in my Cloudflare account," as
opposed to `--local`, which only affects a copy on your own computer used
during development.

---

## Step 4: Point `wrangler.jsonc` at your real database

Open `wrangler.jsonc` in this folder and find this section:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "martinson-vacation-rentals-db",
    "database_id": "REPLACE_WITH_YOUR_D1_DATABASE_ID"
  }
],
```
Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the Database ID you copied
in Step 2. If you named your R2 bucket something other than
`martinson-vacation-rentals-photos`, update `bucket_name` under
`r2_buckets` to match as well.

Save the file, then commit and push this change to GitHub (same as Step 1
— either `git add wrangler.jsonc && git commit -m "Add D1 database ID" &&
git push`, or re-upload the file through GitHub's website).

---

## Step 5: Connect the repo to Cloudflare Workers

1. In the Cloudflare dashboard, go to **Compute (Workers)** → **Workers &
   Pages** → **Create** → **Import a repository** (sometimes labeled
   **Connect to Git**).
2. Authorize Cloudflare to access your GitHub account if prompted, then
   select your repository.
3. On the build settings screen:
   - **Build command**: `npx opennextjs-cloudflare build`
   - Leave the **Deploy command** as whatever Cloudflare fills in by
     default (it will run `wrangler deploy`, which reads `wrangler.jsonc`
     automatically).
4. Click **Save and Deploy**. The first build takes a few minutes — you can
   watch its progress live in the dashboard.

If the build fails, the error log will usually point at a missing
environment variable — that's expected, since you haven't set
`ADMIN_PASSWORD` and `SESSION_SECRET` yet. Continue to Step 6, then
re-deploy (Workers & Pages → your worker → **Deployments** → **Retry
deployment**, or just push any small commit).

---

## Step 6: Set your admin password and session secret

1. Go to your Worker's page → **Settings** → **Variables and Secrets**.
2. Add two entries, both as type **Secret** (not plain text — this keeps
   them encrypted and hidden in the dashboard):
   - `ADMIN_PASSWORD` — the password you'll use to log in to `/admin`.
     Pick something only you know.
   - `SESSION_SECRET` — any long random string. Generate one by running
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     in a terminal, or use a password manager's generator.
3. Save. Redeploy if this was your first time setting these (Cloudflare
   usually prompts you to redeploy automatically after saving new
   variables).

---

## Step 7: Connect martinsonproperties.com

1. On your Worker's page, go to **Settings** → **Domains & Routes** → **Add**.
2. Choose **Custom domain**, and enter `martinsonproperties.com` (and
   repeat for `www.martinsonproperties.com` if you want both to work).
   Since this domain's DNS already lives in this same Cloudflare account,
   the connection happens automatically — no separate DNS records to add
   by hand.
3. Give it a minute or two to activate, then visit
   `https://martinsonproperties.com` to confirm the live site loads.

---

## Step 8: Verify everything works end-to-end

1. Visit `https://martinsonproperties.com/admin`, log in with the
   `ADMIN_PASSWORD` you set in Step 6.
2. Add a property, including uploading a photo, and confirm it appears on
   the public site.
3. Submit a test message through `/contact`, then confirm it shows up
   under **Inquiries** in the admin panel.
4. Delete your test property/message once you've confirmed things work.

---

## Updating the site later

**Code changes** (not everyday content — that's always done through
`/admin`): push to your GitHub repository's `main` branch. Cloudflare
rebuilds and redeploys automatically within a minute or two.

**Database schema changes**: if a future update adds new fields, you'll
re-run the updated `d1/schema.sql` against your `--remote` database the
same way as Step 3 — I'll flag if and when that's ever needed.

## Backing up your data

Your properties and guest messages live in D1, and photos live in R2 —
neither is part of the code, so back them up separately and periodically:

```
npx wrangler d1 export martinson-vacation-rentals-db --remote --output=backup.sql
```

This writes a full SQL dump of your live database to `backup.sql` on your
computer. There isn't a one-command equivalent for R2 photos; if you want
a full photo backup, the Cloudflare dashboard's R2 bucket page lets you
download objects individually, or you can use a tool like
[`rclone`](https://rclone.org/s3/#cloudflare-r2) configured for R2.

## Getting a real Hospitable connection

Once you have your Hospitable **Personal Access Token** (Settings → Apps →
API access, on Hospitable's Host/Professional/Mogul plans) and have set up
a Direct Booking site for a listing, copy that listing's embed widget code
into the property's **Direct booking embed code** field in `/admin`. See
the README for details.
