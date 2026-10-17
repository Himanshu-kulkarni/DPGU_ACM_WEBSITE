import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Calendar, Users, MapPin, Edit3, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Events Management",
  description: "Create, edit, publish, and archive chapter events.",
};

export const revalidate = 0;

export default async function AdminEventsPage() {
  const db = getDb();
  const events = await db.events.getAll();

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              Event Subsystem
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              {events.length} Total Registered in Database
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Events Management</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Configure hackathons, workshops, technical talks, pricing tiers, and registration windows.
          </p>
        </div>

        <Link href="/admin/events/new">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Events Table / Card List */}
      <div className="space-y-4">
        {events.map((evt) => (
          <Card key={evt.id} variant="elevated" className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      evt.status === "PUBLISHED"
                        ? "success"
                        : evt.status === "DRAFT"
                        ? "warning"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {evt.status}
                  </Badge>
                  <Badge variant="accent" size="sm">
                    {evt.category}
                  </Badge>
                  <Badge variant={evt.event_type === "PAID" ? "warning" : "neutral"} size="sm">
                    {evt.event_type === "PAID" ? `₹${evt.price_inr}` : "FREE"}
                  </Badge>
                  {evt.is_team_event && (
                    <Badge variant="neutral" size="sm">
                      Team ({evt.min_team_size}–{evt.max_team_size})
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-[#A5AEC0]/70">
                    slug: /{evt.slug}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#F5F7FB]">{evt.title}</h2>
                  {evt.subtitle && <p className="text-xs text-[#A5AEC0] mt-0.5">{evt.subtitle}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#A5AEC0] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#648CFF]" />
                    <span>{new Date(evt.start_time).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#648CFF]" />
                    <span>{evt.is_online ? "Online Virtual Studio" : evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>
                      {evt.registered_count} / {evt.capacity} registered
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                <Link href={`/admin/events/${evt.id}/edit`}>
                  <Button variant="secondary" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit / Status
                  </Button>
                </Link>
                <Link href={`/admin/registrations?eventId=${evt.id}`}>
                  <Button variant="secondary" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
                    Attendees ({evt.registered_count})
                  </Button>
                </Link>
                {evt.status === "PUBLISHED" && (
                  <Link href={`/events/${evt.slug}`} target="_blank">
                    <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      View Public
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
