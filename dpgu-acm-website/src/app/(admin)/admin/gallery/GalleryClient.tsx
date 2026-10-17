"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, PlusCircle, Trash2, Calendar } from "lucide-react";
import type { GalleryItemEntity } from "@/lib/db/types";

interface GalleryClientProps {
  initialItems: GalleryItemEntity[];
}

export function GalleryClient({ initialItems }: GalleryClientProps) {
  const router = useRouter();
  const [items, setItems] = React.useState<GalleryItemEntity[]>(initialItems);
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [date, setDate] = React.useState("November 2026");
  const [category, setCategory] = React.useState("Hackathons");
  const [imageUrl, setImageUrl] = React.useState("/images/gallery/hackathon-sprint.webp");
  const [description, setDescription] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(10);

  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = () => {
    setTitle("");
    setEventTitle("");
    setDate("November 2026");
    setCategory("Hackathons");
    setImageUrl("/images/gallery/hackathon-sprint.webp");
    setDescription("");
    setDisplayOrder(10);
    setShowAddForm(false);
    setError("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !eventTitle.trim() || !imageUrl.trim()) {
      setError("Title, event title, and image URL are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        event_title: eventTitle.trim(),
        date: date.trim(),
        category,
        image_url: imageUrl.trim(),
        description: description.trim() || undefined,
        display_order: Number(displayOrder),
      };

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Creation failed");
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      setItems((prev) => [...prev, data.item]);
      resetForm();
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("Network error occurred.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${itemTitle}" from gallery?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              Visual Archive
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              {items.length} Photographs in Catalog
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Gallery Management</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Manage event photography, keynote records, workshop memories, and student competitions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          {showAddForm ? "Close Form" : "Add Photograph"}
        </Button>
      </div>

      {/* Add Photograph Form */}
      {showAddForm && (
        <Card variant="elevated" className="border-[#648CFF]/40 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Add Photograph to Chapter Gallery</CardTitle>
            <CardDescription>
              Assign to album category and configure caption text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div role="alert" className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Photo Title *"
                  placeholder="e.g. CodeMatrix Hackathon: Midnight Sprint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <Input
                  label="Associated Event *"
                  placeholder="e.g. CodeMatrix Hackathon"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Category / Album *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: "Hackathons", label: "Hackathons" },
                    { value: "Workshops", label: "Workshops" },
                    { value: "Ceremonies", label: "Ceremonies" },
                    { value: "Competitions", label: "Competitions" },
                    { value: "Community", label: "Community" },
                  ]}
                />

                <Input
                  label="Date / Period *"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />

                <Input
                  label="Display Order (Sort)"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
              </div>

              <Input
                label="Image Asset URL *"
                placeholder="/images/gallery/hackathon-sprint.webp"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />

              <Textarea
                label="Caption / Description"
                rows={2}
                placeholder="Brief summary of what this photograph depicts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Save Photograph
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} variant="elevated" className="overflow-hidden p-0 flex flex-col justify-between">
            <div className="h-44 bg-[#080B12] border-b border-[#252D3D] flex items-center justify-center relative overflow-hidden">
              {item.image_url.startsWith("http") || item.image_url.startsWith("/") ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#101522] to-[#171E2D]">
                  <ImageIcon className="w-8 h-8 text-[#648CFF]/50 mb-1" />
                  <span className="font-mono text-[11px] text-[#A5AEC0]/80 truncate max-w-xs">
                    {item.image_url}
                  </span>
                </div>
              ) : (
                <ImageIcon className="w-8 h-8 text-[#A5AEC0]/40" />
              )}
              <div className="absolute top-2.5 left-2.5">
                <Badge variant="accent" size="sm">
                  {item.category}
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-[#F5F7FB] line-clamp-1">{item.title}</h3>
                  <div className="text-xs text-[#648CFF] font-medium">{item.event_title}</div>
                </div>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1 rounded hover:bg-[#EF4444]/10 text-[#A5AEC0] hover:text-[#EF4444] transition-colors cursor-pointer"
                  title="Remove photograph"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {item.description && (
                <p className="text-xs text-[#A5AEC0] line-clamp-2">{item.description}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#252D3D]/50 text-[11px] text-[#A5AEC0] font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
                <span>Order: #{item.display_order}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
