import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { EditEventClientForm } from "./EditEventClientForm";

export const metadata: Metadata = {
  title: "Edit Event",
  description: "Modify event details, adjust capacity, and publish or archive.",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const event = await db.events.getById(id);

  if (!event) {
    notFound();
  }

  const registrations = await db.registrations.getAll({ event_id: id });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <EditEventClientForm event={event} registrationCount={registrations.length} />
    </div>
  );
}
