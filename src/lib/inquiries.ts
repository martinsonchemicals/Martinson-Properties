import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyName: string;
  read: boolean;
  createdAt: string;
}

interface InquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyName: string;
  read: number;
  createdAt: string;
}

function rowToInquiry(row: InquiryRow): Inquiry {
  return { ...row, read: !!row.read };
}

export async function createInquiry(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyName?: string;
}): Promise<void> {
  const db = getDb();
  await db
    .prepare(
      `INSERT INTO inquiries (id, name, email, phone, message, propertyName, read, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)`
    )
    .bind(
      randomUUID(),
      input.name,
      input.email,
      input.phone || "",
      input.message,
      input.propertyName || "",
      new Date().toISOString()
    )
    .run();
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM inquiries ORDER BY createdAt DESC")
    .all<InquiryRow>();
  return results.map(rowToInquiry);
}

export async function markInquiryRead(id: string, read: boolean): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE inquiries SET read = ? WHERE id = ?")
    .bind(read ? 1 : 0, id)
    .run();
}

export async function deleteInquiry(id: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM inquiries WHERE id = ?").bind(id).run();
}

export async function countUnreadInquiries(): Promise<number> {
  const db = getDb();
  const row = await db
    .prepare("SELECT COUNT(*) as c FROM inquiries WHERE read = 0")
    .first<{ c: number }>();
  return row?.c ?? 0;
}
