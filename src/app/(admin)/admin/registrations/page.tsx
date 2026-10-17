import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { RegistrationsClientView } from "./RegistrationsClientView";

import type { RegistrationStatus, PaymentStatus } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Registrations Roster",
  description: "Attendee database, status management, and CSV spreadsheet exports.",
};

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string; search?: string; status?: string; paymentStatus?: string }>;
}) {
  const params = await searchParams;
  const db = getDb();

  const events = await db.events.getAll();
  const registrations = await db.registrations.getAll({
    event_id: params.eventId,
    search: params.search,
    status: params.status as RegistrationStatus | undefined,
    payment_status: params.paymentStatus as PaymentStatus | undefined,
  });

  return (
    <div className="space-y-6">
      <RegistrationsClientView
        initialRegistrations={registrations}
        events={events}
        selectedEventId={params.eventId || ""}
      />
    </div>
  );
}
