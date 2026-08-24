import { notFound } from "next/navigation";
import { BedDouble, Bath, Users, MapPin, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HospitableEmbed from "@/components/HospitableEmbed";
import { getPropertyBySlug } from "@/lib/properties";

// See src/app/page.tsx for why this must be force-dynamic under D1.
export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return {
    title: `${property.name} | Martinson Vacation Rentals`,
    description: property.summary || property.description,
  };
}

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property || property.status !== "published") {
    notFound();
  }

  const gallery = property.gallery.length > 0 ? property.gallery : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <p className="flex items-center gap-1.5 text-sm text-ink-500">
            <MapPin className="h-4 w-4" />
            {[property.city, property.state].filter(Boolean).join(", ")}
          </p>
          <h1 className="mt-1 font-serif text-3xl font-medium text-ink-900 sm:text-4xl">
            {property.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-ink-600">
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-clay-600" />
              {property.bedrooms} bedrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-clay-600" />
              {property.bathrooms} bathrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-clay-600" />
              Sleeps {property.maxGuests}
            </span>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl px-6">
          <div className="grid gap-2 overflow-hidden rounded-3xl sm:grid-cols-4 sm:grid-rows-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.heroImage || FALLBACK_IMAGE}
              alt={property.name}
              className="col-span-4 aspect-[16/9] w-full object-cover sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full"
            />
            {gallery.slice(0, 4).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${property.name} photo ${i + 2}`}
                className="hidden aspect-square w-full object-cover sm:block"
              />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-medium text-ink-900">
              About this property
            </h2>
            <p className="mt-4 whitespace-pre-line text-ink-700">
              {property.description || property.summary}
            </p>

            {property.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-medium text-ink-900">
                  Amenities
                </h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-ink-700"
                    >
                      <Check className="h-4 w-4 shrink-0 text-clay-600" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <h2 className="font-serif text-xl font-medium text-ink-900">
                Book direct
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Real-time availability and pricing, powered by Hospitable.
              </p>
              <div className="mt-4">
                <HospitableEmbed code={property.hospitableEmbedCode} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
