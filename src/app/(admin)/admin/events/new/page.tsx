"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save, Send } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("Workshops");
  const [bannerUrl, setBannerUrl] = React.useState("/images/events/workshop.webp");
  const [eventType, setEventType] = React.useState<"FREE" | "PAID">("FREE");
  const [priceInr, setPriceInr] = React.useState(0);
  const [capacity, setCapacity] = React.useState(100);
  const [isTeamEvent, setIsTeamEvent] = React.useState(false);
  const [minTeamSize, setMinTeamSize] = React.useState(1);
  const [maxTeamSize, setMaxTeamSize] = React.useState(1);
  const [startTime, setStartTime] = React.useState("2026-12-01T10:00");
  const [endTime, setEndTime] = React.useState("2026-12-01T17:00");
  const [regDeadline, setRegDeadline] = React.useState("2026-11-30T23:59");
  const [venue, setVenue] = React.useState("Main Auditorium, DPG University");
  const [isOnline, setIsOnline] = React.useState(false);
  const [meetingLink, setMeetingLink] = React.useState("");

  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  };

  const handleSubmit = async (submitStatus: "DRAFT" | "PUBLISHED") => {
    setError("");

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

    if (eventType === "PAID" && priceInr <= 0) {
      setError("Paid events must have a fee greater than ₹0.");
      return;
    }

    try {
      setIsSubmitting(true);
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
        status: submitStatus,
      };

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create event");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Network or submission error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/events" className="text-xs text-[#A5AEC0] hover:text-[#F5F7FB] flex items-center gap-1 font-mono">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Create New Event</h1>
          <p className="text-xs text-[#A5AEC0]">
            Enter event specifications, capacity quotas, pricing, and schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => handleSubmit("DRAFT")}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => handleSubmit("PUBLISHED")}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Publish Now
          </Button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
          {error}
        </div>
      )}

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-base">Event Core Details</CardTitle>
          <CardDescription>Primary identification and categorization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Title *"
              placeholder="e.g. CodeMatrix 2026: National Hackathon"
              value={title}
              onChange={handleTitleChange}
              required
            />

            <Input
              label="URL Slug (Permanent link identifier) *"
              placeholder="e.g. codematrix-2026"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="Must be unique. Alphanumeric and hyphens only."
              required
            />
          </div>

          <Input
            label="Subtitle / Hook"
            placeholder="e.g. 36-Hour National Student Hackathon across AI, Web3, and Systems"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <Textarea
            label="Full Description *"
            rows={5}
            placeholder="Detailed overview of syllabus, rules, judging criteria, and participant expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            placeholder="/images/events/hackathon.webp"
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
          <CardDescription>Define chronological timestamps and venue.</CardDescription>
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
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            ) : (
              <Input
                label="Physical Venue Location *"
                placeholder="e.g. Main Auditorium & CS Labs 301-304, DPG University"
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
