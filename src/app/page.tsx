import Link from "next/link";
import { ShieldCheck, BadgePercent, Headset, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { getAllProperties } from "@/lib/properties";

// This page reads from D1 (via getCloudflareContext()), which can only be
// called per-request, not while prerendering a static page at build time —
// so this route always renders dynamically, on each request, in the
// Worker. That also means admin edits show up immediately without needing
// a separate revalidation step.
export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop";

const perks = [
  {
    icon: BadgePercent,
    title: "No platform fees",
    body: "Book straight through us and skip the service fees third-party sites tack on.",
  },
  {
    icon: Headset,
    title: "A real person, always",
    body: "Questions before or during your stay go straight to our management team, not a call center.",
  },
  {
    icon: ShieldCheck,
    title: "Professionally managed",
    body: "Every property is inspected, cleaned, and maintained to the same standard, every stay.",
  },
];

export default async function HomePage() {
  const properties = await getAllProperties({ onlyPublished: true });
  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const spotlight = featured.length > 0 ? featured : properties.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative flex min-h-[70vh] items-end overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt="A Martinson Vacation Rentals property"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-ink-950/10" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-400">
              Martinson Vacation Rentals
            </p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-medium text-sand-50 sm:text-5xl">
              Handpicked stays, booked direct.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-sand-100">
              A curated collection of professionally managed vacation homes.
              Book with the people who actually manage the property — no
              middleman, no markup.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="rounded-full bg-clay-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay-600"
              >
                Browse properties
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-sand-100/40 px-7 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-sand-50/10"
              >
                List your property with us
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="flex flex-col gap-3">
                <perk.icon className="h-6 w-6 text-clay-600" />
                <h3 className="font-serif text-lg font-medium text-ink-900">
                  {perk.title}
                </h3>
                <p className="text-sm text-ink-600">{perk.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-100 bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-clay-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured stays
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-ink-900">
                  A few of our favorites
                </h2>
              </div>
              <Link
                href="/properties"
                className="hidden text-sm font-medium text-clay-600 hover:text-clay-700 sm:block"
              >
                View all properties →
              </Link>
            </div>

            {spotlight.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {spotlight.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-ink-200 bg-sand-50 p-10 text-center text-ink-500">
                No properties are published yet. Add your first one from the{" "}
                <Link href="/admin" className="text-clay-600 underline">
                  admin panel
                </Link>
                .
              </div>
            )}

            <div className="mt-10 text-center sm:hidden">
              <Link href="/properties" className="text-sm font-medium text-clay-600">
                View all properties →
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl bg-ink-800 px-8 py-12 text-center text-sand-50 sm:px-16">
            <h2 className="font-serif text-3xl font-medium">
              Own a vacation rental?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-200">
              Martinson Vacation Rentals handles guest communication,
              cleaning coordination, pricing, and direct bookings so you
              don&apos;t have to.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-clay-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay-600"
            >
              Talk to our team
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
