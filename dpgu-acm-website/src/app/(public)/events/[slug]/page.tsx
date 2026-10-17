import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvents, getEventBySlug } from "@/data/events";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Users,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
} from "lucide-react";

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
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | DPGU ACM",
    };
  }

  return {
    title: `${event.title} | DPGU ACM Student Chapter`,
    description: event.subtitle || event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.subtitle,
      type: "article",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isFree = event.eventType === "FREE";
  const spotsRemaining = Math.max(0, event.capacity - event.registeredCount);
  const isSoldOut = spotsRemaining === 0;
  const isUpcoming = event.status === "UPCOMING";

  const startDate = new Date(event.startTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const startTime = new Date(event.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(event.endTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const deadlineDate = new Date(event.registrationDeadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          <Card variant="elevated" className="sticky top-24 border-[#252D3D]">
            <CardHeader className="p-0 pb-4 border-b border-[#252D3D]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A5AEC0]">
                Registration Status
              </div>
              <div className="text-2xl font-extrabold text-[#F5F7FB] font-mono mt-1">
                {isFree ? "Free Admission" : `₹${event.priceInr} INR`}
              </div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">
                {isFree ? "Zero charge • Open RSVP" : "Per participant entry fee"}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 px-0 pb-0">
              <div className="space-y-3 text-xs text-[#A5AEC0]">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#648CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F5F7FB] block">Date</span>
                    <span>{startDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#648CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F5F7FB] block">Time</span>
                    <span>{startTime} — {endTime}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#648CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F5F7FB] block">Venue</span>
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-[#648CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F5F7FB] block">Capacity</span>
                    <span>{event.registeredCount} / {event.capacity} registered</span>
                    <span className="text-[#10B981] font-mono block mt-0.5">
                      {spotsRemaining} spots available
                    </span>
                  </div>
                </div>
              </div>

              {/* Deadline Alert */}
              <div className="p-3 rounded-lg border border-[#252D3D] bg-[#080B12] text-xs text-[#A5AEC0]">
                <span className="font-semibold text-[#F5F7FB] block">Registration Deadline:</span>
                <span>{deadlineDate}</span>
              </div>

              {/* Action Trigger */}
              <div className="pt-2 space-y-2">
                {isUpcoming ? (
                  <Link href={`/events/${event.slug}#register`} className="w-full block">
                    <Button
                      variant={isSoldOut ? "secondary" : "primary"}
                      size="lg"
                      disabled={isSoldOut}
                      className="w-full justify-center"
                    >
                      {isSoldOut
                        ? "Event Sold Out"
                        : isFree
                        ? "Register for Free Pass"
                        : `Proceed to Register (₹${event.priceInr})`}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="lg" disabled className="w-full justify-center">
                    Event Completed
                  </Button>
                )}

                <p className="text-[11px] text-center text-[#A5AEC0]/70 pt-1">
                  ⚡ Guest checkout: No password or account required.
                </p>
              </div>

              {/* Phase 3 Registration Engine Notice */}
              <div className="pt-3 border-t border-[#252D3D] text-[11px] text-[#A5AEC0] space-y-1">
                <span className="font-semibold text-[#648CFF] block">
                  Registration Engine (Phase 3 Integration):
                </span>
                <p>
                  During Phase 3, this button triggers the frictionless 4-field guest drawer,
                  allocating seat capacity and issuing instant QR boarding passes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
