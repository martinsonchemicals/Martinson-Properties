import { requireAdmin } from "@/lib/auth";
import { countUnreadInquiries } from "@/lib/inquiries";
import AdminNav from "@/components/AdminNav";
import PropertyForm from "@/components/PropertyForm";
import { createPropertyAction } from "../../actions";

export const metadata = {
  title: "Add property | Admin",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewPropertyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const error = params.error === "1";
  const unread = await countUnreadInquiries();

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav unread={unread} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-serif text-3xl font-medium text-ink-900">
          Add a property
        </h1>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Please give the property a name.
          </p>
        )}
        <div className="mt-6">
          <PropertyForm action={createPropertyAction} submitLabel="Add property" />
        </div>
      </main>
    </div>
  );
}
