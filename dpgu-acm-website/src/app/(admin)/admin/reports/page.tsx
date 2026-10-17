import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Reports & CSV Export",
  description: "Generate chapter analytics, download spreadsheets, and audit system events.",
};

export const revalidate = 0;

export default async function AdminReportsPage() {
  const db = getDb();

  const events = await db.events.getAll();
  const registrations = await db.registrations.getAll();
  const payments = await db.payments.getAll();
  const attendance = await db.attendance.getAll();
  const auditLogs = await db.auditLogs.getAll(100);

  const confirmedRegs = registrations.filter((r) => r.registration_status === "CONFIRMED");
  const validCheckIns = attendance.filter((a) => a.scan_result === "VALID");
  const successfulPayments = payments.filter((p) => p.status === "SUCCESS");
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + Number(p.amount_inr), 0);

  const checkInRate =
    confirmedRegs.length > 0
      ? Math.round((validCheckIns.length / confirmedRegs.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              Intelligence &amp; Compliance
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              Audit Stream &bull; {auditLogs.length} Entries Logged
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Reports &amp; Data Exports</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Export verified CSV data for collegiate administration and review cryptographic action logs.
          </p>
        </div>
      </div>

      {/* CSV Export Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="elevated" className="border-[#10B981]/30">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mb-2">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#F5F7FB]">Attendee Roster Export (CSV)</h3>
              <p className="text-xs text-[#A5AEC0]">
                Download all confirmed and pending attendees across events. Permitted fields formatted for Excel or Google Sheets.
              </p>
            </div>
            <a href="/api/admin/registrations?export=csv" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                Export CSV
              </Button>
            </a>
          </div>
        </Card>

        <Card variant="elevated" className="border-[#648CFF]/30">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="w-9 h-9 rounded-lg bg-[#648CFF]/15 border border-[#648CFF]/30 flex items-center justify-center text-[#648CFF] mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#F5F7FB]">Security Audit Logs Export (CSV)</h3>
              <p className="text-xs text-[#A5AEC0]">
                Cryptographic timeline of admin logins, event edits, check-in attempts, and configuration changes.
              </p>
            </div>
            <a href="/api/admin/reports?export=audit_csv" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                Export Logs
              </Button>
            </a>
          </div>
        </Card>
      </div>

      {/* Analytical Telemetry Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Registrations
              </CardDescription>
              <Users className="w-4 h-4 text-[#648CFF]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#F5F7FB] font-mono mt-2">
            {registrations.length}
          </div>
          <div className="text-xs text-[#A5AEC0] mt-1">
            Confirmed: <strong className="text-[#10B981]">{confirmedRegs.length}</strong>
          </div>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Attendance Admitted
              </CardDescription>
              <QrCode className="w-4 h-4 text-[#10B981]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#10B981] font-mono mt-2">
            {checkInRate}%
          </div>
          <div className="text-xs text-[#A5AEC0] mt-1">
            {validCheckIns.length} verified entrances
          </div>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Total Revenue
              </CardDescription>
              <CreditCard className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#F5F7FB] font-mono mt-2">
            ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#A5AEC0] mt-1">
            {successfulPayments.length} successful receipts
          </div>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Events Catalog
              </CardDescription>
              <Calendar className="w-4 h-4 text-[#648CFF]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#648CFF] font-mono mt-2">
            {events.length}
          </div>
          <div className="text-xs text-[#A5AEC0] mt-1">
            Published: <strong>{events.filter((e) => e.status === "PUBLISHED").length}</strong>
          </div>
        </Card>
      </div>

      {/* Audit Log Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#F5F7FB] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Chapter System Audit Trail</span>
        </h2>

        <Card variant="elevated" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#252D3D] bg-[#101522]/80 text-[#A5AEC0]">
                  <th className="py-3 px-4 font-mono font-medium">Timestamp</th>
                  <th className="py-3 px-4 font-mono font-medium">Action</th>
                  <th className="py-3 px-4 font-medium">Target Entity</th>
                  <th className="py-3 px-4 font-mono font-medium">Target ID</th>
                  <th className="py-3 px-4 font-medium">Admin / Operator</th>
                  <th className="py-3 px-4 font-mono text-right font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D3D]/50 text-[#F5F7FB]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#171E2D]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#A5AEC0] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#648CFF] font-medium whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F5F7FB]">
                      {log.target_entity}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A5AEC0] text-[11px]">
                      {log.target_id ? log.target_id.slice(0, 8) + "..." : "—"}
                    </td>
                    <td className="py-3 px-4 text-[#A5AEC0]">
                      {log.admin_email || "System"}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-[11px] text-[#A5AEC0]">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
