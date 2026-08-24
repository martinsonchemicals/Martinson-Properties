import Link from "next/link";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-xl font-medium text-ink-900">
            Martinson
          </span>
          <span className="-mt-1 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-clay-600">
            Vacation Rentals
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-clay-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/properties"
          className="rounded-full bg-ink-800 px-5 py-2 text-sm font-medium text-sand-50 transition-colors hover:bg-ink-700"
        >
          Book direct
        </Link>
      </div>

      <nav className="flex items-center gap-6 overflow-x-auto border-t border-ink-100 px-6 py-2 sm:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm font-medium text-ink-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
