import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { RegistrationDetailClient } from "./RegistrationDetailClient";

export const metadata: Metadata = {
  title: "Registration Details",
  description: "View attendee dossier, team members, payment records, and check-in timeline.",
};

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const registration = await db.registrations.getById(id);

  if (!registration) {
    notFound();
  }

  const event = await db.events.getById(registration.event_id);
  const attendanceLogs = (await db.attendance.getAll()).filter(a => a.registration_id === id);
  const paymentLogs = (await db.payments.getAll()).filter(p => p.registration_id === id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <RegistrationDetailClient
        registration={registration}
        event={event}
        attendanceLogs={attendanceLogs}
        paymentLogs={paymentLogs}
      />
    </div>
  );
}
