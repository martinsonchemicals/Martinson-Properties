import { Mail, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { submitInquiryAction } from "./actions";

export const metadata = {
  title: "Contact | Martinson Vacation Rentals",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error === "1";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-600">
              Contact
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-ink-900">
              Let&apos;s talk
            </h1>
            <p className="mt-4 text-ink-600">
              Questions about a stay, or interested in having us manage your
              property? Send us a message and we&apos;ll get back to you
              shortly.
            </p>

            <div className="mt-8 space-y-3 text-sm text-ink-700">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-clay-600" />
                stay@martinsonvacationrentals.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-clay-600" />
                (555) 010-0100
              </p>
            </div>
            <p className="mt-4 text-xs text-ink-400">
              (Update the email and phone number above once the site is set
              up — see the README.)
            </p>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            {sent ? (
              <div className="rounded-xl bg-ink-50 p-6 text-center">
                <h2 className="font-serif text-xl font-medium text-ink-900">
                  Message sent
                </h2>
                <p className="mt-2 text-sm text-ink-600">
                  Thanks for reaching out — we&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form action={submitInquiryAction} className="space-y-4">
                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    Please fill in your name, email, and a message.
                  </p>
                )}
                <div>
                  <label className="text-sm font-medium text-ink-800">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-800">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-800">
                    Phone (optional)
                  </label>
                  <input
                    name="phone"
                    className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-800">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-ink-800 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-ink-700"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
