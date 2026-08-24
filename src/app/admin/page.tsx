import Link from "next/link";
import { ArrowUp, ArrowDown, Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllProperties } from "@/lib/properties";
import { countUnreadInquiries } from "@/lib/inquiries";
import AdminNav from "@/components/AdminNav";
import ConfirmButton from "@/components/ConfirmButton";
import { deletePropertyAction, reorderPropertyAction } from "./actions";

export const metadata = {
  title: "Properties | Admin",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const properties = await getAllProperties();
  const unread = await countUnreadInquiries();

  const banner = params.created
    ? "Property added."
    : params.updated
      ? "Property updated."
      : params.deleted
        ? "Property deleted."
        : null;

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav unread={unread} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium text-ink-900">
              Properties
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {properties.length} total ·{" "}
              {properties.filter((p) => p.status === "published").length} published
            </p>
          </div>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 rounded-full bg-ink-800 px-5 py-2.5 text-sm font-semibold text-sand-50 hover:bg-ink-700"
          >
            <Plus className="h-4 w-4" />
            Add property
          </Link>
        </div>

        {banner && (
          <p className="mt-6 rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-700">
            {banner}
          </p>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {properties.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink-500">
              No properties yet.{" "}
              <Link href="/admin/properties/new" className="text-clay-600 underline">
                Add your first one
              </Link>
              .
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-100 bg-sand-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Hospitable</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, i) => (
                  <tr key={property.id} className="border-b border-ink-50 last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <form action={reorderPropertyAction.bind(null, property.id, "up")}>
                            <button
                              disabled={i === 0}
                              className="text-ink-300 hover:text-ink-700 disabled:opacity-30"
                              aria-label="Move up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                          </form>
                          <form
                            action={reorderPropertyAction.bind(null, property.id, "down")}
                          >
                            <button
                              disabled={i === properties.length - 1}
                              className="text-ink-300 hover:text-ink-700 disabled:opacity-30"
                              aria-label="Move down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">
                            {property.name}
                            {property.featured && (
                              <span className="ml-2 rounded-full bg-clay-100 px-2 py-0.5 text-[0.65rem] font-semibold text-clay-700">
                                Featured
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-ink-400">/{property.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-600">
                      {[property.city, property.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          property.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-ink-100 text-ink-500"
                        }`}
                      >
                        {property.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {property.hospitableEmbedCode ? (
                        <span className="text-xs font-medium text-emerald-600">
                          Connected
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-ink-400">
                          Not connected
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="flex items-center gap-1 text-clay-600 hover:text-clay-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <form action={deletePropertyAction.bind(null, property.id)}>
                          <ConfirmButton
                            confirmText={`Delete "${property.name}"? This can't be undone.`}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
