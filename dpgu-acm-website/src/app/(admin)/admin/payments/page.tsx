import * as React from "react";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CreditCard, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Records",
  description: "Financial transactions and gateway payment reconciliation.",
};

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const db = getDb();
  const payments = await db.payments.getAll();

  const successfulPayments = payments.filter((p) => p.status === "SUCCESS");
  const totalRevenue = successfulPayments.reduce((acc, p) => acc + Number(p.amount_inr), 0);
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const pendingRevenue = pendingPayments.reduce((acc, p) => acc + Number(p.amount_inr), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              Financial Subsystem
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              INR Gateway Reconciliation
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Payment Transactions</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Review all inbound workshop and event transaction logs, order references, and payment statuses.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#101522] border border-[#252D3D] flex items-center gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          <div>
            <div className="font-bold text-[#F5F7FB]">Read-Only Gateway Mirror</div>
            <div className="text-[#A5AEC0]">Phase 3 DB Schema &bull; Live Gateway in Phase 4</div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Verified Inbound
              </CardDescription>
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#10B981] font-mono mt-2">
            ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#A5AEC0] mt-1">
            {successfulPayments.length} successful payment receipts
          </p>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Pending Gateway Orders
              </CardDescription>
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#F59E0B] font-mono mt-2">
            ₹{pendingRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#A5AEC0] mt-1">
            {pendingPayments.length} awaiting checkout completion
          </p>
        </Card>

        <Card variant="surface">
          <CardHeader className="p-0 pb-1">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase tracking-wider font-mono">
                Total Transaction Records
              </CardDescription>
              <CreditCard className="w-4 h-4 text-[#648CFF]" />
            </div>
          </CardHeader>
          <div className="text-2xl font-bold text-[#F5F7FB] font-mono mt-2">
            {payments.length}
          </div>
          <p className="text-xs text-[#A5AEC0] mt-1">
            Permanent relational payment logs
          </p>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card variant="elevated" className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#252D3D] bg-[#101522]/80 text-[#A5AEC0]">
                <th className="py-3 px-4 font-mono font-medium">Gateway Order ID</th>
                <th className="py-3 px-4 font-medium">Attendee</th>
                <th className="py-3 px-4 font-medium">Event</th>
                <th className="py-3 px-4 font-medium">Gateway</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-mono text-right font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D3D]/50 text-[#F5F7FB]">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#A5AEC0]">
                    No payment transaction records in database.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#171E2D]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#648CFF] font-medium">
                      {p.gateway_order_id}
                      {p.gateway_payment_id && (
                        <div className="text-[10px] text-[#A5AEC0] font-mono">
                          pay: {p.gateway_payment_id}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#F5F7FB]">{p.attendee_name || "N/A"}</div>
                      <div className="text-[11px] text-[#A5AEC0]">{p.attendee_email || "N/A"}</div>
                    </td>
                    <td className="py-3 px-4 text-[#A5AEC0] max-w-[200px] truncate">
                      {p.event_title || "Chapter Event"}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A5AEC0]">
                      {p.gateway_name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#F5F7FB]">
                      ₹{Number(p.amount_inr).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.status === "SUCCESS"
                            ? "success"
                            : p.status === "PENDING"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-[11px] text-[#A5AEC0]">
                      {new Date(p.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
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
  );
}
