import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { getAllProperties } from "@/lib/properties";

// See src/app/page.tsx for why this must be force-dynamic under D1.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Properties | Martinson Vacation Rentals",
};

export default async function PropertiesPage() {
  const properties = await getAllProperties({ onlyPublished: true });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-ink-100 bg-white py-14">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-600">
              All properties
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-ink-900">
              Find your stay
            </h1>
            <p className="mt-3 max-w-xl text-ink-600">
              Every home below is managed directly by us — book here and
              you&apos;re talking to the people who actually run the
              property.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          {properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-sand-50 p-10 text-center text-ink-500">
              No properties are published yet. Check back soon.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
