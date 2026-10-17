import * as React from "react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Lock, Eye, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Data privacy policy and attendee protection statement for the DPG University ACM Student Chapter website.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-12 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="accent" size="sm" showDot>
          Data Governance
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#A5AEC0]">
          Last revised: October 2026 • Effective for DPG University ACM Student Chapter
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#A5AEC0] leading-relaxed">
        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#648CFF]" />
            1. Core Data Protection Philosophy
          </h2>
          <p>
            The DPG University ACM Student Chapter is dedicated to privacy by design. We operate
            under strict <strong>data minimization principles</strong> aligned with the Digital
            Personal Data Protection Act (DPDP Act, India) and ACM International privacy guidelines.
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#648CFF]" />
            2. What Information We Collect
          </h2>
          <p>
            When registering for chapter workshops, hackathons, or seminars, attendees register as
            guests without creating a user password or permanent account. We collect only:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Full Name</strong> (for admission badge and event certificate issuance)</li>
            <li><strong>Email Address</strong> (for digital ticket delivery and emergency announcements)</li>
            <li><strong>Phone / WhatsApp Number</strong> (for check-in verification at physical gates)</li>
            <li><strong>Institution & Department Roll Number</strong> (to verify student status)</li>
          </ul>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#648CFF]" />
            3. Zero Commercial Advertising & No Tracking Cookies
          </h2>
          <p>
            We do <strong>not</strong> sell, rent, or trade student attendee information to any
            commercial third parties. We do not use third-party behavioral advertising pixels,
            fingerprinting scripts, or cross-site tracking cookies.
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#648CFF]" />
            4. Access Control & Row-Level Security
          </h2>
          <p>
            Attendee data is stored in our managed PostgreSQL database with Row-Level Security (RLS)
            enabled. Only the verified single administrator account and automated backend server
            routines have access to event rosters.
          </p>
        </Card>

        <div className="p-4 rounded-xl border border-[#252D3D] bg-[#101522] text-xs space-y-1">
          <span className="font-semibold text-[#F5F7FB] block">Privacy Inquiries:</span>
          <p>
            To request data correction, inspect your registered records, or request deletion of past
            event participation entries, please email us at{" "}
            <a href="mailto:acm@dpgu.ac.in" className="text-[#648CFF] underline">
              acm@dpgu.ac.in
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
