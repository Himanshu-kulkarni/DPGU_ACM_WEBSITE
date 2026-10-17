import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Card, CardHeader, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Users,
  CreditCard,
  QrCode,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "Executive control panel for DPGU ACM Chapter operations.",
};

export default async function AdminDashboardPage() {
  const db = getDb();

  const events = await db.events.getAll();
  const registrations = await db.registrations.getAll();
  const payments = await db.payments.getAll();
  const attendance = await db.attendance.getAll();
  const auditLogs = await db.auditLogs.getAll(6);

  const publishedEvents = events.filter((e) => e.status === "PUBLISHED");
  const confirmedRegistrations = registrations.filter((r) => r.registration_status === "CONFIRMED");
  const validCheckIns = attendance.filter((a) => a.scan_result === "VALID");
  const totalRevenue = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount_inr), 0);

  const checkInRate =
    confirmedRegistrations.length > 0
      ? Math.round((validCheckIns.length / confirmedRegistrations.length) * 100)
      : 0;

  const recentRegistrations = registrations.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm" showDot>
              Live Subsystem
            </Badge>
            <Badge variant="neutral" size="sm">
              PostgreSQL Schema Ready
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
            Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Real-time telemetry on chapter events, attendee pipelines, financial records, and gate check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/events/new">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create Event
            </Button>
          </Link>
          <Link href="/admin/attendance">
            <Button variant="secondary" size="sm" leftIcon={<QrCode className="w-4 h-4" />}>
              Gate Check-in
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registrations */}
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Registrations
              </CardDescription>
              <Users className="w-4 h-4 text-[#648CFF]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#F5F7FB] font-mono mt-2">
            {registrations.length}
          </div>
          <div className="flex items-center justify-between text-xs text-[#A5AEC0] mt-2 pt-2 border-t border-[#252D3D]/50">
            <span>Confirmed: <strong className="text-[#10B981]">{confirmedRegistrations.length}</strong></span>
            <span>Pending: <strong className="text-[#F59E0B]">{registrations.length - confirmedRegistrations.length}</strong></span>
          </div>
        </Card>

        {/* Active Events */}
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Active Events
              </CardDescription>
              <Calendar className="w-4 h-4 text-[#648CFF]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#648CFF] font-mono mt-2">
            {publishedEvents.length}
          </div>
          <div className="flex items-center justify-between text-xs text-[#A5AEC0] mt-2 pt-2 border-t border-[#252D3D]/50">
            <span>Total Catalog: <strong>{events.length}</strong></span>
            <span>Drafts: <strong>{events.filter((e) => e.status === "DRAFT").length}</strong></span>
          </div>
        </Card>

        {/* Checked-In Ratio */}
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Check-in Ratio
              </CardDescription>
              <QrCode className="w-4 h-4 text-[#10B981]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#10B981] font-mono mt-2">
            {checkInRate}%
          </div>
          <div className="flex items-center justify-between text-xs text-[#A5AEC0] mt-2 pt-2 border-t border-[#252D3D]/50">
            <span>Scanned: <strong>{validCheckIns.length}</strong></span>
            <span>Total Scans: <strong>{attendance.length}</strong></span>
          </div>
        </Card>

        {/* Gross Revenue */}
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Gross Revenue
              </CardDescription>
              <CreditCard className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </CardHeader>
          <div className="text-3xl font-bold text-[#F5F7FB] font-mono mt-2">
            ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-xs text-[#A5AEC0] mt-2 pt-2 border-t border-[#252D3D]/50">
            <span>Success Txns: <strong>{payments.filter((p) => p.status === "SUCCESS").length}</strong></span>
            <span>Currency: <strong>INR</strong></span>
          </div>
        </Card>
      </div>

      {/* Two Column Section: Recent Registrations & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F5F7FB] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#648CFF]" />
              <span>Recent Registrations</span>
            </h2>
            <Link
              href="/admin/registrations"
              className="text-xs text-[#648CFF] hover:underline flex items-center gap-1 font-mono"
            >
              <span>View all ({registrations.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Card variant="elevated" className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#252D3D] bg-[#101522]/80 text-[#A5AEC0]">
                    <th className="py-3 px-4 font-mono font-medium">Ticket ID</th>
                    <th className="py-3 px-4 font-medium">Attendee</th>
                    <th className="py-3 px-4 font-medium">Target Event</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Payment</th>
                    <th className="py-3 px-4 font-mono text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252D3D]/50 text-[#F5F7FB]">
                  {recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#A5AEC0]">
                        No registrations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#171E2D]/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-[#648CFF] font-medium">
                          <Link href={`/admin/registrations/${reg.id}`} className="hover:underline">
                            {reg.ticket_token}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#F5F7FB]">{reg.full_name}</div>
                          <div className="text-[11px] text-[#A5AEC0]">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4 text-[#A5AEC0] max-w-[200px] truncate">
                          {reg.event_title || "Chapter Event"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={reg.registration_status === "CONFIRMED" ? "success" : "warning"}
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
                        <td className="py-3 px-4 font-mono text-right text-[11px] text-[#A5AEC0]">
                          {new Date(reg.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Operations & Audit Logs */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#F5F7FB]">Quick Operations</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/admin/events/new">
                <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<PlusCircle className="w-3.5 h-3.5 text-[#648CFF]" />}>
                  New Event
                </Button>
              </Link>
              <Link href="/api/admin/registrations?export=csv" target="_blank">
                <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#10B981]" />}>
                  Export CSV
                </Button>
              </Link>
              <Link href="/admin/attendance">
                <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<QrCode className="w-3.5 h-3.5 text-[#648CFF]" />}>
                  Scan Check-in
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<Settings className="w-3.5 h-3.5 text-[#A5AEC0]" />}>
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#F5F7FB] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Audit Trail</span>
              </h2>
              <Link href="/admin/reports" className="text-xs text-[#648CFF] hover:underline font-mono">
                All Logs
              </Link>
            </div>

            <Card variant="surface" className="p-3 space-y-2.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs pb-2 border-b border-[#252D3D]/50 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[#A5AEC0] mb-0.5 font-mono text-[11px]">
                    <span className="text-[#648CFF] font-medium">{log.action}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A5AEC0]/80">
                    Target: <span className="font-mono text-[#F5F7FB]">{log.target_entity}</span>
                    {log.target_id && <span className="font-mono text-[#A5AEC0]/60"> ({log.target_id.slice(0, 8)}...)</span>}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
