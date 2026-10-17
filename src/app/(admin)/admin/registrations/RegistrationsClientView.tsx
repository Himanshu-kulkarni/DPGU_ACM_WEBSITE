"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, FileSpreadsheet, Eye, Users } from "lucide-react";
import type { RegistrationEntity, EventEntity } from "@/lib/db/types";

interface RegistrationsClientViewProps {
  initialRegistrations: RegistrationEntity[];
  events: EventEntity[];
  selectedEventId: string;
}

export function RegistrationsClientView({
  initialRegistrations,
  events,
  selectedEventId,
}: RegistrationsClientViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [eventId, setEventId] = React.useState(selectedEventId);
  const [status, setStatus] = React.useState(searchParams.get("status") || "");
  const [paymentStatus, setPaymentStatus] = React.useState(searchParams.get("paymentStatus") || "");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (eventId) params.set("eventId", eventId);
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const exportUrl = React.useMemo(() => {
    const params = new URLSearchParams();
    params.set("export", "csv");
    if (eventId) params.set("eventId", eventId);
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    if (search.trim()) params.set("search", search.trim());
    return `/api/admin/registrations?${params.toString()}`;
  }, [eventId, status, paymentStatus, search]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              Roster Subsystem
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              {initialRegistrations.length} Matching Records
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Registrations Directory</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Review student registrations, verify team allocations, and export permitted CSV data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a href={exportUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4 text-[#10B981]" />}>
              Export Filtered CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="surface" className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search name, email, roll no, ticket token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            options={[
              { value: "", label: "All Events" },
              ...events.map((e) => ({ value: e.id, label: e.title })),
            ]}
          />

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "", label: "All Reg Statuses" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "PENDING_PAYMENT", label: "Pending Payment" },
              { value: "CANCELLED", label: "Cancelled" },
              { value: "WAITLISTED", label: "Waitlisted" },
            ]}
          />

          <div className="flex items-center gap-2">
            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              options={[
                { value: "", label: "All Payment" },
                { value: "SUCCESS", label: "Success" },
                { value: "PENDING", label: "Pending" },
                { value: "NOT_APPLICABLE", label: "Not Applicable" },
                { value: "FAILED", label: "Failed" },
                { value: "REFUNDED", label: "Refunded" },
              ]}
            />
            <Button variant="primary" size="sm" onClick={applyFilters}>
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Roster Table */}
      <Card variant="elevated" className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#252D3D] bg-[#101522]/80 text-[#A5AEC0]">
                <th className="py-3 px-4 font-mono font-medium">Ticket ID</th>
                <th className="py-3 px-4 font-medium">Attendee</th>
                <th className="py-3 px-4 font-medium">Institution & Dept</th>
                <th className="py-3 px-4 font-medium">Event</th>
                <th className="py-3 px-4 font-medium">Team</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Payment</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D3D]/50 text-[#F5F7FB]">
              {initialRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A5AEC0]">
                    No registrations found matching the applied filter criteria.
                  </td>
                </tr>
              ) : (
                initialRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#171E2D]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#648CFF] font-medium whitespace-nowrap">
                      {reg.ticket_token}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#F5F7FB]">{reg.full_name}</div>
                      <div className="text-[11px] text-[#A5AEC0]">{reg.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#F5F7FB]">{reg.college_name}</div>
                      <div className="text-[11px] text-[#A5AEC0] font-mono">
                        {reg.department} • {reg.roll_number}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#A5AEC0] max-w-[180px] truncate">
                      {reg.event_title || "Chapter Event"}
                    </td>
                    <td className="py-3 px-4">
                      {reg.team_name ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#F5F7FB]">
                          <Users className="w-3.5 h-3.5 text-[#648CFF]" />
                          <span>{reg.team_name}</span>
                          {reg.team_members && reg.team_members.length > 0 && (
                            <span className="text-[10px] text-[#A5AEC0] font-mono">
                              ({reg.team_members.length})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#A5AEC0]/60 italic">Individual</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          reg.registration_status === "CONFIRMED"
                            ? "success"
                            : reg.registration_status === "PENDING_PAYMENT"
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                      >
                        {reg.registration_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          reg.payment_status === "SUCCESS"
                            ? "success"
                            : reg.payment_status === "NOT_APPLICABLE"
                            ? "neutral"
                            : "warning"
                        }
                        size="sm"
                      >
                        {reg.payment_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/registrations/${reg.id}`}>
                        <Button variant="text" size="sm" className="h-7 px-2 text-xs" leftIcon={<Eye className="w-3 h-3" />}>
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
