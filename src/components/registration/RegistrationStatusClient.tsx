"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Video,
  ShieldCheck,
  Building,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

export interface SanitizedRegistration {
  reference_token: string;
  ticket_token: string;
  registration_status: "CONFIRMED" | "PENDING_PAYMENT" | "CANCELLED" | "EXPIRED" | "WAITLISTED";
  payment_status: "NOT_APPLICABLE" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  full_name: string;
  masked_email: string;
  college_name: string;
  department: string;
  team_name?: string;
  team_members?: Array<{
    member_name: string;
    is_team_leader: boolean;
  }>;
  created_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  can_cancel: boolean;
}

export interface SanitizedEvent {
  id?: string;
  title: string;
  slug?: string;
  category: string;
  start_time: string;
  end_time: string;
  venue: string;
  is_online: boolean;
  meeting_link?: string;
  event_type: "FREE" | "PAID";
  price_inr: number;
}

interface RegistrationStatusClientProps {
  initialRegistration: SanitizedRegistration;
  event: SanitizedEvent;
}

export function RegistrationStatusClient({
  initialRegistration,
  event,
}: RegistrationStatusClientProps) {
  const [registration, setRegistration] = React.useState<SanitizedRegistration>(initialRegistration);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [cancelEmail, setCancelEmail] = React.useState("");
  const [cancelReason, setCancelReason] = React.useState("");
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const isConfirmed = registration.registration_status === "CONFIRMED";
  const isPending = registration.registration_status === "PENDING_PAYMENT";
  const isCancelled = registration.registration_status === "CANCELLED";

  const startDate = new Date(event.start_time).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const startTime = new Date(event.start_time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(event.end_time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelError(null);

    if (!cancelEmail.trim()) {
      setCancelError("Please enter your registered email address.");
      return;
    }

    setIsCancelling(true);

    try {
      const res = await fetch(`/api/register/${registration.reference_token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cancelEmail.trim().toLowerCase(),
          reason: cancelReason.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel registration.");
      }

      setRegistration((prev) => ({
        ...prev,
        registration_status: "CANCELLED",
        cancelled_at: data.cancelled_at || new Date().toISOString(),
        cancellation_reason: cancelReason || "Cancelled by attendee request",
        can_cancel: false,
      }));

      setIsCancelModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel registration.";
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-3xl mx-auto print:p-0 print:m-0 print:max-w-none">
      {/* Top Navigation Action */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={event.slug ? `/events/${event.slug}` : "/events"}
          className="inline-flex items-center gap-1.5 text-xs text-[#A5AEC0] hover:text-[#648CFF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Overview</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="text-xs flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Pass</span>
        </Button>
      </div>

      {/* Main Boarding Pass Card */}
      <div className="rounded-2xl border border-[#252D3D] bg-[#101522] overflow-hidden shadow-2xl">
        {/* Pass Top Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#171E2D] to-[#101522] border-b border-[#252D3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#648CFF]">
                DPGU ACM Student Chapter
              </span>
              <span className="text-xs text-[#A5AEC0]">•</span>
              <span className="text-xs text-[#A5AEC0]">Admission Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB] leading-tight">
              {event.title}
            </h1>
          </div>

          <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
            <Badge
              variant={isConfirmed ? "success" : isPending ? "warning" : "error"}
              size="md"
            >
              {registration.registration_status}
            </Badge>
            <div className="text-[11px] font-mono text-[#A5AEC0]">
              REF: {registration.reference_token.substring(0, 16)}...
            </div>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Status Alert Banner */}
          {isConfirmed ? (
            <div className="p-4 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 flex items-start gap-3 text-xs text-[#10B981]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-sm block">Registration Confirmed</span>
                <span className="text-[#A5AEC0] leading-relaxed">
                  Your entry pass is validated. Please show this ticket code or QR boarding pass at the check-in desk on event day.
                </span>
              </div>
            </div>
          ) : isPending ? (
            <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 flex items-start gap-3 text-xs text-[#F59E0B]">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm block">Registration Reserved (Payment Pending)</span>
                <span className="text-[#A5AEC0] leading-relaxed block">
                  Your seat is provisionally held. Entry fee: <strong>₹{event.price_inr} INR</strong>. Verified online gateway checkout will be connected in Phase 5.
                </span>
              </div>
            </div>
          ) : isCancelled ? (
            <div className="p-4 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 flex items-start gap-3 text-xs text-[#EF4444]">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-sm block">Registration Cancelled</span>
                <span className="text-[#A5AEC0] leading-relaxed">
                  This pass is no longer valid for admission. Capacity has been released back to the event pool.
                  {registration.cancellation_reason && (
                    <span className="block mt-1 italic text-xs">Reason: {registration.cancellation_reason}</span>
                  )}
                </span>
              </div>
            </div>
          ) : null}

          {/* Ticket Barcode & Code Block */}
          <div className="p-6 rounded-xl border border-[#252D3D] bg-[#080B12] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-[#A5AEC0] font-mono">
                Official Boarding Pass Token
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-widest text-[#648CFF]">
                {registration.ticket_token}
              </div>
              <p className="text-xs text-[#A5AEC0]">
                Unique non-transferable attendee verification token
              </p>
            </div>

            {/* Stylized Barcode Element */}
            <div className="shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-lg border border-[#252D3D] bg-[#101522]">
              <div className="flex items-end gap-[3px] h-12 px-2">
                {[4, 2, 6, 1, 3, 5, 2, 6, 4, 1, 5, 3, 6, 2, 4, 5, 2, 6, 3, 5, 2, 4, 6].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className="bg-[#648CFF] w-[3px] rounded-xs"
                      style={{ height: `${val * 8}px` }}
                    />
                  )
                )}
              </div>
              <span className="text-[10px] font-mono text-[#A5AEC0] tracking-widest">
                {registration.ticket_token}
              </span>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#648CFF] border-b border-[#252D3D] pb-1.5">
                Attendee Information
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#A5AEC0] block">Full Name</span>
                  <strong className="text-sm text-[#F5F7FB]">{registration.full_name}</strong>
                </div>

                <div>
                  <span className="text-[#A5AEC0] block">Contact Email (Masked)</span>
                  <span className="text-[#F5F7FB] font-mono">{registration.masked_email}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Building className="w-3.5 h-3.5 text-[#648CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A5AEC0] block">Institution</span>
                    <span className="text-[#F5F7FB]">{registration.college_name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#648CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A5AEC0] block">Department</span>
                    <span className="text-[#F5F7FB]">{registration.department}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Logistics Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#648CFF] border-b border-[#252D3D] pb-1.5">
                Event Logistics
              </h3>

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
                    <span className="font-semibold text-[#F5F7FB] block">Time Window</span>
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

                {event.is_online && event.meeting_link && isConfirmed && (
                  <div className="flex items-start gap-2.5">
                    <Video className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#F5F7FB] block">Virtual Room Link</span>
                      <a
                        href={event.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#648CFF] underline flex items-center gap-1 hover:text-[#648CFF]/80"
                      >
                        <span>Join Session</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team Roster (If Team Event) */}
          {registration.team_name && (
            <div className="space-y-3 pt-4 border-t border-[#252D3D]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#648CFF]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#648CFF]">
                  Team: {registration.team_name}
                </h3>
              </div>

              {registration.team_members && registration.team_members.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {registration.team_members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[#252D3D] bg-[#171E2D]/50 flex items-center justify-between text-xs"
                    >
                      <span className="text-[#F5F7FB] font-medium">{member.member_name}</span>
                      <Badge variant={member.is_team_leader ? "accent" : "neutral"} size="sm">
                        {member.is_team_leader ? "Team Leader" : "Member"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guidelines and Check-in Rules */}
          <div className="p-4 rounded-xl border border-[#252D3D] bg-[#171E2D]/40 space-y-2 text-xs text-[#A5AEC0] leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-[#F5F7FB]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Event Day Check-in Rules</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Keep your ticket token (<strong>{registration.ticket_token}</strong>) ready at the registration desk.</li>
              <li>Valid college/university student identity card is mandatory for entry.</li>
              <li>Please arrive at least 15 minutes prior to scheduled session time.</li>
              <li>This pass is issued under your name and is strictly non-transferable.</li>
            </ul>
          </div>

          {/* Cancellation Option (If permitted) */}
          {registration.can_cancel && (
            <div className="pt-4 border-t border-[#252D3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
              <div className="text-[#A5AEC0]">
                <span>Unable to attend? Free up your seat for fellow students.</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel My Registration
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Event Registration"
        description="Release your seat so another student can attend this event."
        size="md"
      >
        <form onSubmit={handleCancelSubmit} className="space-y-4 py-2">
          {cancelError && (
            <div
              role="alert"
              className="p-3 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs text-[#EF4444]"
            >
              {cancelError}
            </div>
          )}

          <p className="text-xs text-[#A5AEC0] leading-relaxed">
            To prevent accidental or unauthorized cancellations, please enter the exact email address used during registration.
          </p>

          <Input
            id="cancel-email"
            type="email"
            label="Verify Registered Email"
            placeholder="student@dpgu.ac.in"
            value={cancelEmail}
            onChange={(e) => setCancelEmail(e.target.value)}
            required
            disabled={isCancelling}
          />

          <Input
            id="cancel-reason"
            label="Reason for Cancellation (Optional)"
            placeholder="e.g. Schedule conflict, academic exam"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            disabled={isCancelling}
          />

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Keep My Registration
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isCancelling}
              className="min-w-[130px] justify-center"
            >
              {isCancelling ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>Cancelling...</span>
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
