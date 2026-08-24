import ImageField from "./ImageField";
import GalleryField from "./GalleryField";
import type { Property } from "@/lib/properties";

export default function PropertyForm({
  action,
  property,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  property?: Property;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <section className="grid gap-5 rounded-2xl border border-ink-100 bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-ink-800">Property name</label>
          <input
            name="name"
            required
            defaultValue={property?.name}
            placeholder="Cedar Creek Cabin"
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-800">City</label>
          <input
            name="city"
            defaultValue={property?.city}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-800">State</label>
          <input
            name="state"
            defaultValue={property?.state}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-ink-800">
            Full address (private — not shown publicly)
          </label>
          <input
            name="address"
            defaultValue={property?.address}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-800">Bedrooms</label>
          <input
            type="number"
            min={0}
            name="bedrooms"
            defaultValue={property?.bedrooms ?? 0}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-800">Bathrooms</label>
          <input
            type="number"
            min={0}
            step={0.5}
            name="bathrooms"
            defaultValue={property?.bathrooms ?? 0}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-800">Max guests</label>
          <input
            type="number"
            min={0}
            name="maxGuests"
            defaultValue={property?.maxGuests ?? 0}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <div>
          <label className="text-sm font-medium text-ink-800">
            Short summary (shown on listing cards)
          </label>
          <input
            name="summary"
            defaultValue={property?.summary}
            placeholder="A quiet 3-bedroom retreat 10 minutes from downtown."
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-800">Full description</label>
          <textarea
            name="description"
            rows={6}
            defaultValue={property?.description}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-800">
            Amenities (comma-separated)
          </label>
          <input
            name="amenities"
            defaultValue={property?.amenities.join(", ")}
            placeholder="Hot tub, Pool, WiFi, Free parking, Pet friendly"
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-medium text-ink-900">Photos</h2>
        <ImageField name="heroImage" label="Cover photo" defaultValue={property?.heroImage} />
        <GalleryField name="gallery" defaultValue={property?.gallery} />
      </section>

      <section className="space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="font-serif text-lg font-medium text-ink-900">
          Hospitable direct booking
        </h2>
        <p className="text-sm text-ink-500">
          In Hospitable, open this listing&apos;s Direct Booking site settings
          and copy the widget embed code — paste it below to enable live
          booking on this property&apos;s page.
        </p>
        <div>
          <label className="text-sm font-medium text-ink-800">
            Hospitable listing ID (optional, for your reference)
          </label>
          <input
            name="hospitableListingId"
            defaultValue={property?.hospitableListingId}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-800">
            Direct booking embed code
          </label>
          <textarea
            name="hospitableEmbedCode"
            rows={4}
            defaultValue={property?.hospitableEmbedCode}
            placeholder='<iframe src="https://booking.hospitable.com/..." ...></iframe>'
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-xs focus:border-clay-500 focus:outline-none"
          />
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-6 rounded-2xl border border-ink-100 bg-white p-6">
        <div>
          <label className="text-sm font-medium text-ink-800">Status</label>
          <select
            name="status"
            defaultValue={property?.status ?? "draft"}
            className="mt-1 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
          >
            <option value="draft">Draft (hidden from site)</option>
            <option value="published">Published (visible on site)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={property?.featured}
            className="h-4 w-4 rounded border-ink-300"
          />
          Feature on homepage
        </label>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-ink-800 px-7 py-3 text-sm font-semibold text-sand-50 hover:bg-ink-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
