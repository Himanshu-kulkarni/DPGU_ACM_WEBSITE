import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Chapter Settings",
  description: "Configure chapter identity, institutional contacts, security, and global registration controls.",
};

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const db = getDb();
  const settings = await db.settings.get();
  const adminUsersCount = await db.adminUsers.count();

  return (
    <div className="space-y-6">
      <SettingsClient
        initialSettings={settings}
        adminUsersCount={adminUsersCount}
      />
    </div>
  );
}
