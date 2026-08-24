import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About | Martinson Vacation Rentals",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-600">
            About us
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium text-ink-900">
            Hospitality, done properly.
          </h1>

          <div className="mt-8 space-y-5 text-ink-700">
            <p>
              Martinson Vacation Rentals manages a growing collection of
              vacation homes on behalf of property owners who want their
              guests to have a great stay — without the guesswork of running
              it themselves.
            </p>
            <p>
              We handle the day-to-day: guest communication, cleaning and
              turnover coordination, dynamic pricing, and direct bookings.
              Every property listed here is managed to the same standard,
              whether it&apos;s a downtown loft or a mountain retreat.
            </p>
            <p>
              Booking direct with us means no third-party platform fees, and
              a real person to talk to before, during, and after your stay.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="font-serif text-xl font-medium text-ink-900">
              Property owners
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              If you own a vacation rental and want it professionally
              managed — including a direct booking channel like this one —
              we&apos;d love to talk.{" "}
              <a href="/contact" className="text-clay-600 underline">
                Reach out here
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
