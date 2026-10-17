"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  QrCode,
  Users,
  CreditCard,
  Building,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type {
  RegistrationEntity,
  EventEntity,
  AttendanceEntity,
  PaymentEntity,
  RegistrationStatus,
  PaymentStatus,
} from "@/lib/db/types";

interface RegistrationDetailClientProps {
  registration: RegistrationEntity;
  event: EventEntity | null;
  attendanceLogs: AttendanceEntity[];
  paymentLogs: PaymentEntity[];
}

export function RegistrationDetailClient({
  registration,
  event,
  attendanceLogs,
  paymentLogs,
}: RegistrationDetailClientProps) {
  const router = useRouter();

  const [regStatus, setRegStatus] = React.useState<RegistrationStatus>(registration.registration_status);
  const [payStatus, setPayStatus] = React.useState<PaymentStatus>(registration.payment_status);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleStatusUpdate = async (newRegStatus: RegistrationStatus, newPayStatus?: PaymentStatus) => {
    try {
      setIsUpdating(true);
      setMessage(null);

      const res = await fetch(`/api/admin/registrations/${registration.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_status: newRegStatus,
          payment_status: newPayStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Update failed", type: "error" });
        setIsUpdating(false);
        return;
      }

      setRegStatus(newRegStatus);
      if (newPayStatus) setPayStatus(newPayStatus);
      setMessage({ text: "Status successfully updated!", type: "success" });
      setIsUpdating(false);
      router.refresh();
    } catch {
      setMessage({ text: "Network error occurred", type: "error" });
      setIsUpdating(false);
    }
  };

  const isCheckedIn = attendanceLogs.some((a) => a.scan_result === "VALID");

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/admin/registrations" className="text-xs text-[#A5AEC0] hover:text-[#F5F7FB] flex items-center gap-1 font-mono">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registrations</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-xl bg-[#101522] border border-[#252D3D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-[#648CFF]">
              {registration.ticket_token}
            </span>
            <Badge
              variant={
                regStatus === "CONFIRMED"
                  ? "success"
                  : regStatus === "PENDING_PAYMENT"
                  ? "warning"
                  : "error"
              }
              size="sm"
            >
              {regStatus}
            </Badge>
            {isCheckedIn ? (
              <Badge variant="success" size="sm" showDot>
                Checked In
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                Gate Pending
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-[#F5F7FB]">{registration.full_name}</h1>
          <p className="text-xs text-[#A5AEC0]">
            Registered for <strong className="text-[#F5F7FB]">{event?.title || "Chapter Event"}</strong>
          </p>
        </div>

        {/* Administrative Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {regStatus !== "CONFIRMED" && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isUpdating}
              onClick={() => handleStatusUpdate("CONFIRMED")}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Confirm Registration
            </Button>
          )}

          {payStatus !== "SUCCESS" && event?.event_type === "PAID" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isUpdating}
              onClick={() => handleStatusUpdate("CONFIRMED", "SUCCESS")}
              leftIcon={<CreditCard className="w-3.5 h-3.5 text-[#10B981]" />}
            >
              Mark Paid
            </Button>
          )}

          {regStatus !== "CANCELLED" && (
            <Button
              type="button"
              variant="text"
              size="sm"
              className="text-[#EF4444] hover:bg-[#EF4444]/10"
              isLoading={isUpdating}
              onClick={() => handleStatusUpdate("CANCELLED")}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Cancel Ticket
            </Button>
          )}
        </div>
      </div>

      {message && (
        <div
          role="alert"
          className={`p-3.5 rounded-lg text-xs border ${
            message.type === "success"
              ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
              : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Academic Dossier */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#648CFF]" />
              <CardTitle className="text-base">Attendee Profile</CardTitle>
            </div>
            <CardDescription>Academic registration credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#252D3D]/50">
              <span className="text-[#A5AEC0]">Full Name:</span>
              <span className="font-medium text-[#F5F7FB]">{registration.full_name}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#252D3D]/50">
              <span className="text-[#A5AEC0]">Email Address:</span>
              <span className="font-mono text-[#F5F7FB]">{registration.email}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#252D3D]/50">
              <span className="text-[#A5AEC0]">Phone:</span>
              <span className="font-mono text-[#F5F7FB]">{registration.phone}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#252D3D]/50">
              <span className="text-[#A5AEC0]">College / University:</span>
              <span className="text-[#F5F7FB]">{registration.college_name}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#252D3D]/50">
              <span className="text-[#A5AEC0]">Department:</span>
              <span className="text-[#F5F7FB]">{registration.department}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#252D3D]/50">
              <span className="text-[#A5AEC0]">Roll / Student ID:</span>
              <span className="font-mono text-[#F5F7FB]">{registration.roll_number}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#A5AEC0]">Registration Timestamp:</span>
              <span className="font-mono text-[#A5AEC0]">
                {new Date(registration.created_at).toLocaleString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Allocation */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#648CFF]" />
              <CardTitle className="text-base">Team Configuration</CardTitle>
            </div>
            <CardDescription>
              {registration.team_name ? `Team: ${registration.team_name}` : "Individual Registration"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {registration.team_members && registration.team_members.length > 0 ? (
              <div className="space-y-2">
                {registration.team_members.map((member, idx) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-lg bg-[#080B12] border border-[#252D3D] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#F5F7FB]">
                        {idx + 1}. {member.member_name}
                      </span>
                      {member.is_team_leader && (
                        <Badge variant="accent" size="sm">
                          Team Leader
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-[#A5AEC0] font-mono">
                      {member.member_email} {member.member_phone && `• ${member.member_phone}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#A5AEC0] italic py-4 text-center">
                Individual participant. No additional team members registered.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Attendance Verification History */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#10B981]" />
              <CardTitle className="text-base">Attendance Scan History</CardTitle>
            </div>
            <CardDescription>Gate check-in timestamps and scanner operator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {attendanceLogs.length === 0 ? (
              <p className="text-[#A5AEC0] py-4 text-center">
                No check-in attempts recorded at gate yet.
              </p>
            ) : (
              attendanceLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-[#080B12] border border-[#252D3D] flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-[#F5F7FB]">
                      {new Date(log.check_in_time).toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-[#A5AEC0]">
                      Scanned by: {log.scanned_by_name || "Admin Scanner"}
                    </div>
                  </div>
                  <Badge
                    variant={log.scan_result === "VALID" ? "success" : "error"}
                    size="sm"
                  >
                    {log.scan_result}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#F59E0B]" />
              <CardTitle className="text-base">Financial Transactions</CardTitle>
            </div>
            <CardDescription>Gateway order IDs and payment ledger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {paymentLogs.length === 0 ? (
              <p className="text-[#A5AEC0] py-4 text-center">
                {event?.event_type === "FREE"
                  ? "Free event registration. No payment required."
                  : "No payment transaction recorded yet."}
              </p>
            ) : (
              paymentLogs.map((payment) => (
                <div
                  key={payment.id}
                  className="p-2.5 rounded-lg bg-[#080B12] border border-[#252D3D] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono text-[#F5F7FB]">
                      ₹{payment.amount_inr} • {payment.gateway_name}
                    </div>
                    <div className="text-[11px] text-[#A5AEC0] font-mono">
                      Order: {payment.gateway_order_id}
                    </div>
                  </div>
                  <Badge
                    variant={payment.status === "SUCCESS" ? "success" : "warning"}
                    size="sm"
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
