import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { ContentClient } from "./ContentClient";

export const metadata: Metadata = {
  title: "Content & CMS Blocks",
  description: "Customize homepage copy, mission pillars, and announcement banners.",
};

export default async function AdminContentPage() {
  const db = getDb();
  const blocks = await db.contentBlocks.getAll();

  return (
    <div className="space-y-6">
      <ContentClient initialBlocks={blocks} />
    </div>
  );
}
