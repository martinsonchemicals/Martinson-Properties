import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPropertyById } from "@/lib/properties";
import { countUnreadInquiries } from "@/lib/inquiries";
import AdminNav from "@/components/AdminNav";
import PropertyForm from "@/components/PropertyForm";
import { updatePropertyAction } from "../../../actions";

export const metadata = {
  title: "Edit property | Admin",
};

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const error = sp.error === "1";
  const property = await getPropertyById(id);
  if (!property) notFound();

  const unread = await countUnreadInquiries();
  const boundAction = updatePropertyAction.bind(null, id);

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav unread={unread} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-serif text-3xl font-medium text-ink-900">
          Edit {property.name}
        </h1>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Please give the property a name.
          </p>
        )}
        <div className="mt-6">
          <PropertyForm action={boundAction} property={property} submitLabel="Save changes" />
        </div>
      </main>
    </div>
  );
}
