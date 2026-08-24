import Link from "next/link";
import { BedDouble, Bath, Users, MapPin } from "lucide-react";
import type { Property } from "@/lib/properties";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.heroImage || FALLBACK_IMAGE}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {property.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-clay-500 px-3 py-1 text-xs font-semibold text-white shadow">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-lg font-medium text-ink-900">
            {property.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
            <MapPin className="h-3.5 w-3.5" />
            {[property.city, property.state].filter(Boolean).join(", ")}
          </p>
        </div>

        {property.summary && (
          <p className="line-clamp-2 text-sm text-ink-600">{property.summary}</p>
        )}

        <div className="mt-auto flex items-center gap-4 border-t border-ink-100 pt-3 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-clay-600" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-clay-600" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-clay-600" />
            {property.maxGuests}
          </span>
        </div>
      </div>
    </Link>
  );
}
