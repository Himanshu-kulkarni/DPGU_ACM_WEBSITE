import * as React from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapPin, Mail, MessageSquare, Clock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Membership",
  description:
    "Connect with the DPG University ACM Student Chapter. Inquire about student membership, event collaborations, and sponsorships.",
};

export default function ContactPage() {
  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm" showDot>
            Connect & Inquire
          </Badge>
          <Badge variant="neutral" size="sm">
            DPG University
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Contact & Chapter Membership
        </h1>
        <p className="text-base text-[#A5AEC0] max-w-2xl leading-relaxed">
          Have questions about joining the student chapter, submitting a talk proposal,
          or sponsoring our flagship hackathons? Reach out directly to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <Card variant="surface">
            <CardHeader>
              <CardTitle className="text-base">Campus Secretariat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-[#A5AEC0]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#648CFF] shrink-0 mt-0.5" />
                <span>
                  DPG University
                  <br />
                  Sector 34, Gurugram
                  <br />
                  Haryana 122001, India
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#252D3D]">
                <Mail className="w-4 h-4 text-[#648CFF] shrink-0" />
                <span className="font-mono text-[#F5F7FB]">acm@dpgu.ac.in</span>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#252D3D]">
                <Clock className="w-4 h-4 text-[#648CFF] shrink-0" />
                <span>Term Time: Mon–Fri, 09:00 AM – 05:00 PM</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="surface">
            <CardHeader>
              <CardTitle className="text-base">Community Channels</CardTitle>
              <CardDescription>Join our student developer spaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-[#252D3D] bg-[#080B12] text-xs font-medium text-[#F5F7FB] hover:border-[#648CFF]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#648CFF]" />
                  <span>Discord Community</span>
                </div>
                <span className="text-[10px] text-[#A5AEC0] font-mono">Join →</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-[#252D3D] bg-[#080B12] text-xs font-medium text-[#F5F7FB] hover:border-[#648CFF]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#648CFF]" />
                  <span>GitHub Organization</span>
                </div>
                <span className="text-[10px] text-[#A5AEC0] font-mono">Explore →</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
