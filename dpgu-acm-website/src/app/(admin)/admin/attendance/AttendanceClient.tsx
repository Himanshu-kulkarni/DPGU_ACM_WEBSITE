"use client";

import * as React from "react";
import { Card, CardHeader, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Scan,
} from "lucide-react";
import type { AttendanceEntity, EventEntity } from "@/lib/db/types";

interface AttendanceClientProps {
  events: EventEntity[];
  initialRecords: AttendanceEntity[];
  initialStats: {
    totalScans: number;
    validCount: number;
    duplicateCount: number;
    invalidCount: number;
  };
}

export function AttendanceClient({
  events,
  initialRecords,
  initialStats,
}: AttendanceClientProps) {
  const [ticketToken, setTicketToken] = React.useState("");
  const [selectedEventId, setSelectedEventId] = React.useState("");
  const [records, setRecords] = React.useState<AttendanceEntity[]>(initialRecords);
  const [stats, setStats] = React.useState(initialStats);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanFeedback, setScanFeedback] = React.useState<{
    success: boolean;
    result: "VALID" | "DUPLICATE" | "INVALID";
    message: string;
    attendee?: string;
  } | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = ticketToken.trim();
    if (!token) return;

    try {
      setIsScanning(true);
      setScanFeedback(null);

      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_token: token,
          event_id: selectedEventId || undefined,
        }),
      });

      const data = await res.json();

      if (data.scanResult === "VALID") {
        setScanFeedback({
          success: true,
          result: "VALID",
          message: data.message || "Valid Ticket! Check-in successful.",
          attendee: data.registration?.full_name,
        });

        // Add record to list
        if (data.record) {
          const newRecord: AttendanceEntity = {
            ...data.record,
            attendee_name: data.registration?.full_name,
            attendee_email: data.registration?.email,
            ticket_token: data.registration?.ticket_token,
          };
          setRecords((prev) => [newRecord, ...prev]);
        }

        setStats((prev) => ({
          ...prev,
          totalScans: prev.totalScans + 1,
          validCount: prev.validCount + 1,
        }));
      } else if (data.scanResult === "DUPLICATE") {
        setScanFeedback({
          success: false,
          result: "DUPLICATE",
          message: data.message || "DUPLICATE SCAN DETECTED! Ticket already checked in.",
          attendee: data.registration?.full_name,
        });

        if (data.record) {
          setRecords((prev) => [data.record, ...prev]);
        }

        setStats((prev) => ({
          ...prev,
          totalScans: prev.totalScans + 1,
          duplicateCount: prev.duplicateCount + 1,
        }));
      } else {
        setScanFeedback({
          success: false,
          result: "INVALID",
          message: data.message || data.error || "INVALID TICKET TOKEN. Not found in records.",
        });

        setStats((prev) => ({
          ...prev,
          totalScans: prev.totalScans + 1,
          invalidCount: prev.invalidCount + 1,
        }));
      }

      setTicketToken("");
      setIsScanning(false);
      // Refocus input for next rapid scan
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setScanFeedback({
        success: false,
        result: "INVALID",
        message: "Network or scanning server communication error.",
      });
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm" showDot>
              Gate Verification
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              Live Token Validation Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Gate Attendance & QR Check-in</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Scan or enter attendee ticket tokens. Real-time duplicate entry prevention is enforced.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Verified Check-Ins
              </CardDescription>
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#10B981] font-mono mt-2">
            {stats.validCount}
          </div>
          <p className="text-xs text-[#A5AEC0] mt-1">Unique attendees admitted</p>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Duplicate Attempts
              </CardDescription>
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#EF4444] font-mono mt-2">
            {stats.duplicateCount}
          </div>
          <p className="text-xs text-[#A5AEC0] mt-1">Prevented duplicate admissions</p>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Total Scans
              </CardDescription>
              <Scan className="w-4 h-4 text-[#648CFF]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#F5F7FB] font-mono mt-2">
            {stats.totalScans}
          </div>
          <p className="text-xs text-[#A5AEC0] mt-1">Total scans processed at gates</p>
        </Card>
      </div>

      {/* Check-In Bar */}
      <Card variant="elevated" className="p-6">
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <Input
                ref={inputRef}
                placeholder="Scan or enter Ticket Token (e.g. TCK-ACM-CODE-98214)..."
                value={ticketToken}
                onChange={(e) => setTicketToken(e.target.value.toUpperCase())}
                autoFocus
                leftIcon={<QrCode className="w-4 h-4 text-[#648CFF]" />}
              />
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                options={[
                  { value: "", label: "Validate Across Any Event" },
                  ...events.map((e) => ({ value: e.id, label: e.title })),
                ]}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isScanning}
              className="w-full sm:w-auto"
            >
              Verify & Check In
            </Button>
          </div>

          {/* Feedback Display */}
          {scanFeedback && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                scanFeedback.result === "VALID"
                  ? "bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]"
                  : scanFeedback.result === "DUPLICATE"
                  ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
                  : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
              }`}
            >
              {scanFeedback.result === "VALID" ? (
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
              ) : scanFeedback.result === "DUPLICATE" ? (
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {scanFeedback.result === "VALID"
                    ? "✓ ADMISSION APPROVED"
                    : scanFeedback.result === "DUPLICATE"
                    ? "⚠ DUPLICATE TICKET WARNING"
                    : "✕ INVALID TICKET"}
                </div>
                <div className="text-xs">{scanFeedback.message}</div>
                {scanFeedback.attendee && (
                  <div className="text-xs font-semibold text-[#F5F7FB] pt-1">
                    Attendee: {scanFeedback.attendee}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Attendance Scan Log */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#F5F7FB] flex items-center gap-2">
          <Scan className="w-4 h-4 text-[#648CFF]" />
          <span>Real-time Gate Telemetry Stream</span>
        </h2>

        <Card variant="elevated" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#252D3D] bg-[#101522]/80 text-[#A5AEC0]">
                  <th className="py-3 px-4 font-mono font-medium">Timestamp</th>
                  <th className="py-3 px-4 font-mono font-medium">Ticket Token</th>
                  <th className="py-3 px-4 font-medium">Attendee Name</th>
                  <th className="py-3 px-4 font-medium">Event</th>
                  <th className="py-3 px-4 font-medium">Scanner Operator</th>
                  <th className="py-3 px-4 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D3D]/50 text-[#F5F7FB]">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#A5AEC0]">
                      No check-ins recorded at gates yet.
                    </td>
                  </tr>
                ) : (
                  records.map((a) => (
                    <tr key={a.id} className="hover:bg-[#171E2D]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#A5AEC0] whitespace-nowrap">
                        {new Date(a.check_in_time).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#648CFF] font-medium whitespace-nowrap">
                        {a.ticket_token || "TCK-..."}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#F5F7FB]">
                        {a.attendee_name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-[#A5AEC0] max-w-[200px] truncate">
                        {a.event_title || "Chapter Event"}
                      </td>
                      <td className="py-3 px-4 text-[#A5AEC0]">
                        {a.scanned_by_name || "Admin Scanner"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            a.scan_result === "VALID"
                              ? "success"
                              : a.scan_result === "DUPLICATE"
                              ? "danger"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {a.scan_result}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
