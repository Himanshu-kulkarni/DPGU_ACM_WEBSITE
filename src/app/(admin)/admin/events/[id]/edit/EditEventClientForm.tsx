"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Save, Trash2, Archive, ExternalLink } from "lucide-react";
import type { EventEntity, EventStatus } from "@/lib/db/types";

interface EditEventClientFormProps {
  event: EventEntity;
  registrationCount: number;
}

export function EditEventClientForm({ event, registrationCount }: EditEventClientFormProps) {
  const router = useRouter();

  const [title, setTitle] = React.useState(event.title);
  const [slug, setSlug] = React.useState(event.slug);
  const [subtitle, setSubtitle] = React.useState(event.subtitle || "");
  const [description, setDescription] = React.useState(event.description);
  const [category, setCategory] = React.useState(event.category);
  const [bannerUrl, setBannerUrl] = React.useState(event.banner_url || "");
  const [eventType, setEventType] = React.useState<"FREE" | "PAID">(event.event_type);
  const [priceInr, setPriceInr] = React.useState(event.price_inr);
  const [capacity, setCapacity] = React.useState(event.capacity);
  const [isTeamEvent, setIsTeamEvent] = React.useState(event.is_team_event);
  const [minTeamSize, setMinTeamSize] = React.useState(event.min_team_size);
  const [maxTeamSize, setMaxTeamSize] = React.useState(event.max_team_size);
  const [startTime, setStartTime] = React.useState(
    new Date(event.start_time).toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = React.useState(
    new Date(event.end_time).toISOString().slice(0, 16)
  );
  const [regDeadline, setRegDeadline] = React.useState(
    new Date(event.registration_deadline).toISOString().slice(0, 16)
  );
  const [venue, setVenue] = React.useState(event.venue);
  const [isOnline, setIsOnline] = React.useState(event.is_online);
  const [meetingLink, setMeetingLink] = React.useState(event.meeting_link || "");
  const [status, setStatus] = React.useState<EventStatus>(event.status);

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleUpdate = async (overrideStatus?: EventStatus) => {
    setError("");
    setSuccess("");

    if (!title.trim() || !slug.trim() || !description.trim() || !venue.trim()) {
      setError("Please fill in all required fields (title, slug, description, venue).");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError("Event end time must be later than start time.");
      return;
    }

    if (new Date(regDeadline) > new Date(endTime)) {
      setError("Registration deadline cannot be after the event end time.");
      return;
    }

    try {
      setIsSaving(true);
      const targetStatus = overrideStatus || status;

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim() || undefined,
        description: description.trim(),
        category,
        banner_url: bannerUrl.trim() || undefined,
        event_type: eventType,
        price_inr: eventType === "FREE" ? 0 : Number(priceInr),
        capacity: Number(capacity),
        is_team_event: isTeamEvent,
        min_team_size: isTeamEvent ? Number(minTeamSize) : 1,
        max_team_size: isTeamEvent ? Number(maxTeamSize) : 1,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        registration_deadline: new Date(regDeadline).toISOString(),
        venue: venue.trim(),
        is_online: isOnline,
        meeting_link: isOnline && meetingLink ? meetingLink.trim() : undefined,
        status: targetStatus,
      };

      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update event");
        setIsSaving(false);
        return;
      }

      setStatus(targetStatus);
      setSuccess("Event updated successfully!");
      setIsSaving(false);
      router.refresh();
    } catch {
      setError("Network or update error occurred.");
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete or archive "${event.title}"?`)) {
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete event");
        setIsSaving(false);
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Deletion error occurred.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/events" className="text-xs text-[#A5AEC0] hover:text-[#F5F7FB] flex items-center gap-1 font-mono">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={status === "PUBLISHED" ? "success" : status === "DRAFT" ? "warning" : "neutral"}
              size="sm"
            >
              {status}
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              {registrationCount} Registrations
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Edit Event: {event.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status !== "ARCHIVED" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isSaving}
              onClick={() => handleUpdate("ARCHIVED")}
              leftIcon={<Archive className="w-3.5 h-3.5" />}
            >
              Archive
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            onClick={() => handleUpdate()}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>

          <Button
            type="button"
            variant="text"
            size="sm"
            className="text-[#EF4444] hover:bg-[#EF4444]/10"
            isLoading={isSaving}
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>

          {status === "PUBLISHED" && (
            <Link href={`/events/${event.slug}`} target="_blank">
              <Button variant="text" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Public View
              </Button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981]">
          {success}
        </div>
      )}

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-base">Event Core Details</CardTitle>
          <CardDescription>Configure titles, slug, category, and lifecycle state.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Event Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <Select
              label="Publication Status *"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              options={[
                { value: "DRAFT", label: "Draft (Hidden from public)" },
                { value: "PUBLISHED", label: "Published (Active & Public)" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
                { value: "ARCHIVED", label: "Archived" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="URL Slug (Permanent identifier) *"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="Must be unique. Changing this will alter public URLs."
              required
            />

            <Input
              label="Subtitle / Hook"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <Textarea
            label="Full Description *"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventEntity["category"])}
              options={[
                { value: "Workshops", label: "Workshops" },
                { value: "Hackathons", label: "Hackathons" },
                { value: "Tech Talks", label: "Tech Talks" },
                { value: "Coding Contests", label: "Coding Contests" },
                { value: "Bootcamps", label: "Bootcamps" },
                { value: "General", label: "General" },
              ]}
            />

            <Select
              label="Event Type *"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as "FREE" | "PAID")}
              options={[
                { value: "FREE", label: "Free Event (₹0)" },
                { value: "PAID", label: "Paid Event (Registration Fee)" },
              ]}
            />

            {eventType === "PAID" && (
              <Input
                label="Registration Fee (INR) *"
                type="number"
                min={0}
                value={priceInr}
                onChange={(e) => setPriceInr(Number(e.target.value))}
                required
              />
            )}

            <Input
              label="Seat Capacity *"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Poster / Banner URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Team Registration Configuration */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-base">Participation Mode</CardTitle>
          <CardDescription>Configure individual attendee vs multi-person teams.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isTeamEvent}
              onChange={(e) => setIsTeamEvent(e.target.checked)}
              className="w-4 h-4 rounded border-[#252D3D] bg-[#080B12] text-[#648CFF] focus:ring-[#648CFF]"
            />
            <span className="text-sm font-medium text-[#F5F7FB]">Enable Team Registration (Teams of 2–4 members)</span>
          </label>

          {isTeamEvent && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Input
                label="Min Team Members"
                type="number"
                min={1}
                value={minTeamSize}
                onChange={(e) => setMinTeamSize(Number(e.target.value))}
              />
              <Input
                label="Max Team Members"
                type="number"
                min={minTeamSize}
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule and Location */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-base">Schedule & Location</CardTitle>
          <CardDescription>Adjust timestamps and physical / online venue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Date & Time *"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <Input
              label="End Date & Time *"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <Input
              label="Registration Deadline *"
              type="datetime-local"
              value={regDeadline}
              onChange={(e) => setRegDeadline(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                className="w-4 h-4 rounded border-[#252D3D] bg-[#080B12] text-[#648CFF]"
              />
              <span className="text-sm font-medium text-[#F5F7FB]">This is a Virtual / Online Event</span>
            </label>

            {isOnline ? (
              <Input
                label="Meeting / Stream Link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            ) : (
              <Input
                label="Physical Venue Location *"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
