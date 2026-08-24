"use server";

import { redirect } from "next/navigation";
import { createInquiry } from "@/lib/inquiries";

export async function submitInquiryAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const propertyName = String(formData.get("propertyName") || "").trim();

  if (!name || !email || !message) {
    redirect("/contact?error=1");
  }

  await createInquiry({ name, email, phone, message, propertyName });
  redirect("/contact?sent=1");
}
