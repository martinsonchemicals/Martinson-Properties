import { requireAdmin } from "@/lib/auth";
import { getAllInquiries, countUnreadInquiries } from "@/lib/inquiries";
import AdminNav from "@/components/AdminNav";
import ConfirmButton from "@/components/ConfirmButton";
import { deleteInquiryAction, markInquiryReadAction } from "../actions";

export const metadata = {
  title: "Inquiries | Admin",
};

export default async function InquiriesPage() {
  await requireAdmin();
  const inquiries = await getAllInquiries();
  const unread = await countUnreadInquiries();

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav unread={unread} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-serif text-3xl font-medium text-ink-900">
          Guest inquiries
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Messages submitted through the site&apos;s contact form.
        </p>

        <div className="mt-8 space-y-4">
          {inquiries.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center text-sm text-ink-500">
              No messages yet.
            </p>
          )}

          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`rounded-2xl border p-5 ${
                inquiry.read ? "border-ink-100 bg-white" : "border-clay-300 bg-clay-50/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-900">{inquiry.name}</p>
                  <p className="text-sm text-ink-500">
                    {inquiry.email}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <form action={markInquiryReadAction.bind(null, inquiry.id, !inquiry.read)}>
                    <button type="submit" className="text-clay-600 hover:text-clay-700">
                      Mark as {inquiry.read ? "unread" : "read"}
                    </button>
                  </form>
                  <form action={deleteInquiryAction.bind(null, inquiry.id)}>
                    <ConfirmButton
                      confirmText="Delete this message?"
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-ink-700">
                {inquiry.message}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
