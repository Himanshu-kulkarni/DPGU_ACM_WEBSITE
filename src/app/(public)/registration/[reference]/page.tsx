import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  RegistrationStatusClient,
  type SanitizedRegistration,
  type SanitizedEvent,
} from "@/components/registration/RegistrationStatusClient";
import { ArrowLeft, TicketX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    reference: string;
  }>;
}

function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "***";
  const name = parts[0];
  const domain = parts[1];
  const maskedName =
    name.length > 2
      ? `${name[0]}***${name[name.length - 1]}`
      : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  const reg = await db.registrations.getByReferenceToken(reference);

  if (!reg) {
    return {
      title: "Registration Not Found | DPGU ACM",
    };
  }

  return {
    title: `Admission Pass: ${reg.event_title || "Chapter Event"} | DPGU ACM`,
    description: `Official digital boarding pass for ${reg.full_name} (${reg.ticket_token}).`,
  };
}

export default async function RegistrationStatusPage({ params }: PageProps) {
  const { reference } = await params;

  if (!reference || !reference.startsWith("ref_")) {
    notFound();
  }

  const reg = await db.registrations.getByReferenceToken(reference);
  if (!reg) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EF4444]/15 border border-[#EF4444] flex items-center justify-center mx-auto text-[#EF4444]">
          <TicketX className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F5F7FB]">
            Registration Record Not Found
          </h1>
          <p className="text-sm text-[#A5AEC0] leading-relaxed">
            We could not locate an event registration matching reference token{" "}
            <code className="text-[#648CFF] font-mono">{reference}</code>.
            Please check the link in your confirmation email or register again.
          </p>
        </div>
        <div>
          <Link href="/events">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Browse Chapter Events</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const event = await db.events.getById(reg.event_id);
  const eventStarted = event ? new Date() >= new Date(event.start_time) : false;
  const canCancel =
    (reg.registration_status === "CONFIRMED" || reg.registration_status === "PENDING_PAYMENT") &&
    !eventStarted;

  const sanitizedRegistration: SanitizedRegistration = {
    reference_token: reg.reference_token,
    ticket_token: reg.ticket_token,
    registration_status: reg.registration_status,
    payment_status: reg.payment_status,
    full_name: reg.full_name,
    masked_email: maskEmail(reg.email),
    college_name: reg.college_name,
    department: reg.department,
    team_name: reg.team_name,
    team_members: reg.team_members?.map((m) => ({
      member_name: m.member_name,
      is_team_leader: m.is_team_leader,
    })),
    created_at: reg.created_at,
    cancelled_at: reg.cancelled_at,
    cancellation_reason: reg.cancellation_reason,
    can_cancel: canCancel,
  };

  const sanitizedEvent: SanitizedEvent = {
    id: event?.id,
    title: event?.title || reg.event_title || "Chapter Event",
    slug: event?.slug,
    category: event?.category || "General",
    start_time: event?.start_time || new Date().toISOString(),
    end_time: event?.end_time || new Date().toISOString(),
    venue: event?.venue || "DPG University Campus",
    is_online: !!event?.is_online,
    meeting_link: reg.registration_status === "CONFIRMED" ? event?.meeting_link : undefined,
    event_type: event?.event_type || "FREE",
    price_inr: event?.price_inr || 0,
  };

  return (
    <RegistrationStatusClient
      initialRegistration={sanitizedRegistration}
      event={sanitizedEvent}
    />
  );
}
