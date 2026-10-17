import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery CMS",
  description: "Curate event photographs, hackathon captures, and chapter albums.",
};

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const db = getDb();
  const items = await db.gallery.getAll();

  return (
    <div className="space-y-6">
      <GalleryClient initialItems={items} />
    </div>
  );
}
