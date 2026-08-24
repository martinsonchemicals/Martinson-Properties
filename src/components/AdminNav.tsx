import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function AdminNav({ unread = 0 }: { unread?: number }) {
  return (
    <header className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-medium text-ink-900">
              Martinson
            </span>
            <span className="-mt-1 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-clay-600">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-ink-600">
            <Link href="/admin" className="hover:text-ink-900">
              Properties
            </Link>
            <Link href="/admin/inquiries" className="hover:text-ink-900">
              Inquiries
              {unread > 0 && (
                <span className="ml-1.5 rounded-full bg-clay-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                  {unread}
                </span>
              )}
            </Link>
            <Link href="/" target="_blank" className="hover:text-ink-900">
              View site ↗
            </Link>
          </nav>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
