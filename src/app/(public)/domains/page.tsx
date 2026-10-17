import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllDomains } from "@/data/domains";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Globe,
  Brain,
  Binary,
  Shield,
  Cpu,
  Palette,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technical Domains & SIGs",
  description:
    "Explore the technical domains, special interest groups, and engineering working groups at DPGU ACM Student Chapter.",
};

export default function DomainsPage() {
  const domains = getAllDomains();

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return <Globe className="w-6 h-6 text-[#648CFF]" />;
      case "Brain":
        return <Brain className="w-6 h-6 text-[#648CFF]" />;
      case "Binary":
        return <Binary className="w-6 h-6 text-[#648CFF]" />;
      case "Shield":
        return <Shield className="w-6 h-6 text-[#648CFF]" />;
      case "Cpu":
        return <Cpu className="w-6 h-6 text-[#648CFF]" />;
      case "Palette":
        return <Palette className="w-6 h-6 text-[#648CFF]" />;
      default:
        return <Terminal className="w-6 h-6 text-[#648CFF]" />;
    }
  };

  return (
    <div className="space-y-16 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <Badge variant="accent" size="sm" showDot>
          Special Interest Groups
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FB]">
          Technical Domains & Specializations
        </h1>
        <p className="text-base sm:text-lg text-[#A5AEC0] leading-relaxed">
          DPGU ACM organizes technical activities into focused Special Interest Groups (SIGs).
          Members collaborate on research, build production systems, and compete in domain hackathons.
        </p>
      </div>

      {/* Domain Cards Grid */}
      <div className="space-y-10">
        {domains.map((dom, index) => (
          <Card
            key={dom.id}
            variant="surface"
            className="border-[#252D3D] p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#252D3D] pb-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#080B12] border border-[#252D3D] flex items-center justify-center shrink-0">
                  {getDomainIcon(dom.iconName)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#648CFF]">
                      DOMAIN #{index + 1}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {dom.meetingSchedule}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-[#F5F7FB]">
                    {dom.title}
                  </h2>
                  <p className="text-xs text-[#648CFF] font-mono">
                    Lead: {dom.leadPlaceholder}
                  </p>
                </div>
              </div>

              <Link href="/contact" className="shrink-0">
                <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Join This SIG
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#A5AEC0]">
              <div className="space-y-3">
                <span className="font-semibold text-[#F5F7FB] text-sm block">
                  Domain Overview
                </span>
                <p className="leading-relaxed">
                  {dom.fullDescription}
                </p>

                <div className="pt-2">
                  <span className="font-semibold text-[#F5F7FB] block mb-2">
                    Technologies & Tooling:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dom.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-[#080B12] border border-[#252D3D] text-[#A5AEC0] font-mono text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#252D3D] pt-4 md:pt-0 md:pl-6">
                <span className="font-semibold text-[#F5F7FB] text-sm block">
                  Active Projects & Initiatives:
                </span>
                <ul className="space-y-2">
                  {dom.keyInitiatives.map((init, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{init}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
