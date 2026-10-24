"use client";

import * as React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EventRegistrationModal } from "./EventRegistrationModal";
import { Calendar, Clock, MapPin, Users, ShieldCheck } from "lucide-react";

export interface EventRegistrationTriggerProps {
  event: {
    id: string;
    slug: string;
    title: string;
    eventType: "FREE" | "PAID";
    priceInr: number;
    capacity: number;
    registeredCount: number;
    registrationDeadline: string;
    startTime: string;
    endTime: string;
    venue: string;
    status: string;
    isTeamEvent?: boolean;
    minTeamSize?: number;
    maxTeamSize?: number;
  };
}

export function EventRegistrationTrigger({ event }: EventRegistrationTriggerProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const isFree = event.eventType === "FREE";
  const spotsRemaining = Math.max(0, event.capacity - event.registeredCount);
  const isSoldOut = spotsRemaining === 0;
  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const endDateTime = event.endTime ? new Date(event.endTime) : new Date(event.startTime);
  const isPastEvent = new Date().getTime() > endDateTime.getTime() || event.status === "COMPLETED" || event.status === "PAST";
  const isPublished = event.status === "PUBLISHED" || event.status === "UPCOMING";
  const canRegister = isPublished && !isPastEvent && !isSoldOut && !isDeadlinePassed;

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
  const deadlineFormatted = new Date(event.registrationDeadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Card variant="elevated" className="sticky top-24 border-[#252D3D]">
        <CardHeader className="p-0 pb-4 border-b border-[#252D3D]">
          <div className="text-xs font-mono uppercase tracking-wider text-[#A5AEC0]">
            Registration Status
          </div>
          <div className="text-2xl font-extrabold text-[#F5F7FB] font-mono mt-1">
            {isFree ? "Free Admission" : `₹${event.priceInr} INR`}
          </div>
          <div className="text-xs text-[#A5AEC0] mt-0.5">
            {isFree
              ? "Zero charge • Open student pass"
              : event.isTeamEvent
              ? "Per team registration fee"
              : "Per participant entry fee"}
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
                <span>
                  {startTime} — {endTime}
                </span>
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
                <span>
                  {event.registeredCount} / {event.capacity} registered
                </span>
                <span
                  className={`font-mono block mt-0.5 ${
                    isSoldOut ? "text-[#EF4444]" : "text-[#10B981]"
                  }`}
                >
                  {isSoldOut ? "Seating full" : `${spotsRemaining} spots available`}
                </span>
              </div>
            </div>
          </div>

          {/* Registration Deadline Alert */}
          <div className="p-3 rounded-lg border border-[#252D3D] bg-[#080B12] text-xs text-[#A5AEC0]">
            <span className="font-semibold text-[#F5F7FB] block">Registration Deadline:</span>
            <span>{deadlineFormatted}</span>
            {isDeadlinePassed && (
              <span className="text-[#EF4444] font-semibold block mt-1">
                Deadline has passed. Registrations closed.
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2 space-y-2">
            {canRegister ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={() => setIsModalOpen(true)}
              >
                {isFree
                  ? "Register for Free Pass"
                  : event.isTeamEvent
                  ? `Register Team (₹${event.priceInr})`
                  : `Proceed to Register (₹${event.priceInr})`}
              </Button>
            ) : isSoldOut ? (
              <Button variant="secondary" size="lg" disabled className="w-full justify-center">
                Event Sold Out
              </Button>
            ) : isDeadlinePassed ? (
              <Button variant="secondary" size="lg" disabled className="w-full justify-center">
                Registration Closed
              </Button>
            ) : (
              <Button variant="secondary" size="lg" disabled className="w-full justify-center">
                Event Completed
              </Button>
            )}

            <p className="text-[11px] text-center text-[#A5AEC0]/70 pt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Guest checkout: No password or account required.</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Registration Modal */}
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={{
          id: event.id,
          slug: event.slug,
          title: event.title,
          eventType: event.eventType,
          priceInr: event.priceInr,
          isTeamEvent: event.isTeamEvent,
          minTeamSize: event.minTeamSize,
          maxTeamSize: event.maxTeamSize,
          venue: event.venue,
          startTime: event.startTime,
        }}
      />
    </>
  );
}
