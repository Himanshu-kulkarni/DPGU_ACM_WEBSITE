import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvents, getEventBySlug } from "@/data/events";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EventRegistrationTrigger } from "@/components/events/EventRegistrationTrigger";
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const staticEvent = getEventBySlug(slug);
  const dbEvent = await db.events.getBySlug(slug);

  const title = dbEvent?.title || staticEvent?.title;
  const subtitle = dbEvent?.subtitle || staticEvent?.subtitle;
  const description = dbEvent?.description || staticEvent?.description || "";

  if (!title) {
    return {
      title: "Event Not Found | DPGU ACM",
    };
  }

  return {
    title: `${title} | DPGU ACM Student Chapter`,
    description: subtitle || description.slice(0, 160),
    openGraph: {
      title,
      description: subtitle,
      type: "article",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const staticEvent = getEventBySlug(slug);
  const dbEvent = await db.events.getBySlug(slug);

  if (!staticEvent && !dbEvent) {
    notFound();
  }

  const event = {
    id: dbEvent?.id || staticEvent?.id || slug,
    slug: dbEvent?.slug || staticEvent?.slug || slug,
    title: dbEvent?.title || staticEvent?.title || "Event",
    subtitle: dbEvent?.subtitle || staticEvent?.subtitle,
    description: dbEvent?.description || staticEvent?.description || "",
    category: dbEvent?.category || staticEvent?.category || "General",
    eventType: dbEvent?.event_type || staticEvent?.eventType || "FREE",
    priceInr: dbEvent ? dbEvent.price_inr : (staticEvent?.priceInr || 0),
    capacity: dbEvent?.capacity || staticEvent?.capacity || 100,
    registeredCount: dbEvent ? dbEvent.registered_count : (staticEvent?.registeredCount || 0),
    startTime: dbEvent?.start_time || staticEvent?.startTime || new Date().toISOString(),
    endTime: dbEvent?.end_time || staticEvent?.endTime || new Date().toISOString(),
    registrationDeadline: dbEvent?.registration_deadline || staticEvent?.registrationDeadline || new Date().toISOString(),
    venue: dbEvent?.venue || staticEvent?.venue || "DPG University Campus",
    isOnline: dbEvent ? dbEvent.is_online : (staticEvent?.isOnline || false),
    meetingLink: dbEvent?.meeting_link || staticEvent?.meetingLink,
    status: dbEvent?.status || (staticEvent?.status === "UPCOMING" ? "PUBLISHED" : staticEvent?.status || "PUBLISHED"),
    isTeamEvent: dbEvent ? dbEvent.is_team_event : (staticEvent?.category === "Hackathons"),
    minTeamSize: dbEvent?.min_team_size || (staticEvent?.category === "Hackathons" ? 2 : 1),
    maxTeamSize: dbEvent?.max_team_size || (staticEvent?.category === "Hackathons" ? 4 : 1),
    agenda: staticEvent?.agenda || [],
    prerequisites: staticEvent?.prerequisites || [],
    speakers: staticEvent?.speakers || [],
    faqs: staticEvent?.faqs || [],
    isPlaceholderData: staticEvent?.isPlaceholderData || false,
  };

  const isUpcoming = (event.status as string) === "PUBLISHED" || (event.status as string) === "UPCOMING";

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Back to Events Breadcrumb */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs text-[#A5AEC0] hover:text-[#648CFF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Event Header Banner */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent" size="sm" showDot={isUpcoming}>
            {event.category}
          </Badge>
          <Badge variant={isUpcoming ? "success" : "neutral"} size="sm">
            {event.status}
          </Badge>
          {event.isPlaceholderData && (
            <Badge variant="neutral" size="sm">
              Chapter Event Template
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F5F7FB] leading-tight">
          {event.title}
        </h1>

        <p className="text-lg text-[#A5AEC0] leading-relaxed max-w-3xl">
          {event.subtitle}
        </p>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Description, Agenda, Prerequisites, Speakers, FAQs */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#F5F7FB] border-b border-[#252D3D] pb-3">
              About the Event
            </h2>
            <div className="text-sm text-[#A5AEC0] leading-relaxed whitespace-pre-line space-y-4">
              {event.description}
            </div>
          </section>

          {/* Agenda & Schedule */}
          {event.agenda && event.agenda.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#F5F7FB] border-b border-[#252D3D] pb-3">
                Event Agenda & Schedule
              </h2>
              <div className="space-y-3">
                {event.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#252D3D] bg-[#101522] flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
                  >
                    <div className="text-xs font-mono font-bold text-[#648CFF] shrink-0 w-36">
                      {item.time}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-[#F5F7FB]">
                        {item.title}
                      </div>
                      <p className="text-xs text-[#A5AEC0] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prerequisites */}
          {event.prerequisites && event.prerequisites.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#F5F7FB] border-b border-[#252D3D] pb-3">
                Requirements & Prerequisites
              </h2>
              <ul className="space-y-2.5">
                {event.prerequisites.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#A5AEC0]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Speaker Profiles */}
          {event.speakers && event.speakers.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#F5F7FB] border-b border-[#252D3D] pb-3">
                Featured Speakers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((spk, idx) => (
                  <Card key={idx} variant="surface">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#F5F7FB]">{spk.name}</h4>
                        <p className="text-xs text-[#648CFF]">{spk.role}</p>
                        <p className="text-xs text-[#A5AEC0]">{spk.organization}</p>
                        {spk.bio && (
                          <p className="text-[11px] text-[#A5AEC0]/80 pt-1 leading-relaxed">
                            {spk.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {event.faqs && event.faqs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#F5F7FB] border-b border-[#252D3D] pb-3">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {event.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#252D3D] bg-[#101522] space-y-1.5"
                  >
                    <div className="text-xs font-semibold text-[#F5F7FB] flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#648CFF] shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                    <p className="text-xs text-[#A5AEC0] leading-relaxed pl-5.5">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (1 Col Sticky): Quick Info, Pricing & Registration Drawer Trigger */}
        <div className="space-y-6">
          <EventRegistrationTrigger
            event={{
              id: event.id,
              slug: event.slug,
              title: event.title,
              eventType: event.eventType as "FREE" | "PAID",
              priceInr: event.priceInr,
              capacity: event.capacity,
              registeredCount: event.registeredCount,
              registrationDeadline: event.registrationDeadline,
              startTime: event.startTime,
              endTime: event.endTime,
              venue: event.venue,
              status: event.status,
              isTeamEvent: event.isTeamEvent,
              minTeamSize: event.minTeamSize,
              maxTeamSize: event.maxTeamSize,
            }}
          />
        </div>
      </div>
    </div>
  );
}
