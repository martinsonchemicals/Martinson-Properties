import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { loginAction } from "../actions";

export const metadata = {
  title: "Admin login | Martinson Vacation Rentals",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (await isLoggedIn()) {
    redirect("/admin");
  }
  const params = await searchParams;
  const error = params.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-600">
          Martinson Vacation Rentals
        </p>
        <h1 className="mt-2 font-serif text-2xl font-medium text-ink-900">
          Admin sign in
        </h1>

        <form action={loginAction} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              That password isn&apos;t right. Try again.
            </p>
          )}
          <div>
            <label className="text-sm font-medium text-ink-800">Password</label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-clay-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-ink-800 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-ink-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
