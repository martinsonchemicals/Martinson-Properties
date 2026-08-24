import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-sand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <span className="font-serif text-lg font-medium text-sand-50">
            Martinson Vacation Rentals
          </span>
          <p className="mt-3 max-w-xs text-sm text-ink-200">
            Professionally managed vacation rentals. Book direct with us and
            skip the third-party platform fees.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-300">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/properties" className="text-ink-200 hover:text-sand-50">
                All properties
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink-200 hover:text-sand-50">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-ink-200 hover:text-sand-50">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-300">
            Own a property?
          </h3>
          <p className="mt-4 max-w-xs text-sm text-ink-200">
            We manage vacation rentals end-to-end for property owners.{" "}
            <Link href="/contact" className="text-clay-400 hover:text-clay-300">
              Get in touch
            </Link>{" "}
            to learn more.
          </p>
        </div>
      </div>

      <div className="border-t border-ink-800 px-6 py-6 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Martinson Vacation Rentals. All rights
        reserved.
      </div>
    </footer>
  );
}
