"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  clearSessionCookie,
  requireAdmin,
  setSessionCookie,
} from "@/lib/auth";
import {
  createProperty,
  deleteProperty,
  reorderProperty,
  updateProperty,
  type PropertyInput,
  type PropertyStatus,
} from "@/lib/properties";
import { deleteInquiry, markInquiryRead } from "@/lib/inquiries";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await setSessionCookie();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

function parsePropertyForm(formData: FormData): PropertyInput {
  const amenities = String(formData.get("amenities") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const gallery = String(formData.get("gallery") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const status: PropertyStatus =
    formData.get("status") === "published" ? "published" : "draft";

  return {
    name: String(formData.get("name") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    bedrooms: Number(formData.get("bedrooms") || 0) || 0,
    bathrooms: Number(formData.get("bathrooms") || 0) || 0,
    maxGuests: Number(formData.get("maxGuests") || 0) || 0,
    amenities,
    heroImage: String(formData.get("heroImage") || "").trim(),
    gallery,
    hospitableListingId: String(formData.get("hospitableListingId") || "").trim(),
    hospitableEmbedCode: String(formData.get("hospitableEmbedCode") || "").trim(),
    status,
    featured: formData.get("featured") === "on",
  };
}

export async function createPropertyAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const input = parsePropertyForm(formData);
  if (!input.name) {
    redirect("/admin/properties/new?error=1");
  }
  await createProperty(input);
  revalidatePath("/");
  revalidatePath("/properties");
  redirect("/admin?created=1");
}

export async function updatePropertyAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const input = parsePropertyForm(formData);
  if (!input.name) {
    redirect(`/admin/properties/${id}/edit?error=1`);
  }
  await updateProperty(id, input);
  revalidatePath("/");
  revalidatePath("/properties");
  redirect("/admin?updated=1");
}

export async function deletePropertyAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteProperty(id);
  revalidatePath("/");
  revalidatePath("/properties");
  redirect("/admin?deleted=1");
}

export async function reorderPropertyAction(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdmin();
  await reorderProperty(id, direction);
  revalidatePath("/admin");
}

export async function markInquiryReadAction(
  id: string,
  read: boolean
): Promise<void> {
  await requireAdmin();
  await markInquiryRead(id, read);
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiryAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteInquiry(id);
  revalidatePath("/admin/inquiries");
}
