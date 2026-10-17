import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { TeamClient } from "./TeamClient";

export const metadata: Metadata = {
  title: "Team & Officers Management",
  description: "Manage faculty sponsor, chapter officers, domain leads, and executive committee.",
};

export const revalidate = 0;

export default async function AdminTeamPage() {
  const db = getDb();
  const members = await db.teamMembers.getAll(false);

  return (
    <div className="space-y-6">
      <TeamClient initialMembers={members} />
    </div>
  );
}
