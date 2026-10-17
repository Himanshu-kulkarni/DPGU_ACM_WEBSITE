import * as React from "react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, CheckCircle2, AlertOctagon, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Event Registration Terms & Conduct",
  description:
    "Event registration terms, admission conditions, and code of conduct for DPG University ACM Student Chapter events.",
};

export default function TermsPage() {
  return (
    <div className="space-y-12 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="accent" size="sm" showDot>
          Legal & Conditions
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Event Registration Terms & Conditions
        </h1>
        <p className="text-sm text-[#A5AEC0]">
          Applicable to all public registrations for free and paid DPGU ACM Student Chapter events.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#A5AEC0] leading-relaxed">
        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#648CFF]" />
            1. Registration Eligibility & Identification
          </h2>
          <p>
            All event participants must hold valid student identification from an accredited university,
            college, or polytechnic institution. Physical student ID cards must be presented alongside
            your digital QR code pass at venue entrance gates.
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#648CFF]" />
            2. Pass Validity & Unique Digital Tokens
          </h2>
          <p>
            Each confirmed registration generates a unique cryptographic ticket token. The digital pass
            is valid for admission of one individual attendee only. Once scanned at the auditorium gate,
            duplicate scans will be flagged immediately by the in-browser verification scanner.
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#648CFF]" />
            3. Paid Events & Refund Policy
          </h2>
          <p>
            For events requiring a nominal fee (e.g., hardware component kits, catering, national
            hackathons), payments are processed via verified Indian payment gateways in INR.
            Unless an event is officially postponed or cancelled by the chapter, registration fees are
            non-refundable once a confirmed ticket has been issued.
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#648CFF]" />
            4. ACM Code of Ethics & Anti-Harassment
          </h2>
          <p>
            DPGU ACM is committed to a safe, inclusive, and harassment-free environment for all
            participants regardless of gender, sexual orientation, disability, physical appearance,
            or background. Plagiarism, disruptive conduct, or violation of university laboratory
            regulations will result in immediate disqualification and removal from the venue.
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <h2 className="text-lg font-bold text-[#F5F7FB]">
            5. Intellectual Property of Hackathon Submissions
          </h2>
          <p>
            All source code, design assets, and prototypes built by student teams during DPGU ACM
            hackathons remain 100% the intellectual property of the respective student teams.
            The chapter claims zero equity or ownership over student creations.
          </p>
        </Card>
      </div>
    </div>
  );
}
