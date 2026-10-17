import * as React from "react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFacultyCoordinator, getAllOfficers } from "@/data/team";
import {
  GraduationCap,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Executive Committee & Team",
  description:
    "Meet the faculty coordinator, executive committee officers, and domain leads guiding the DPGU ACM Student Chapter.",
};

export default function TeamPage() {
  const faculty = getFacultyCoordinator();
  const allOfficers = getAllOfficers();
  const executiveBoard = allOfficers.filter((o) => o.category === "EXECUTIVE");
  const domainLeads = allOfficers.filter((o) => o.category === "LEAD");

  return (
    <div className="space-y-16 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <Badge variant="accent" size="sm" showDot>
          Chapter Governance
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FB]">
          Executive Committee & Leadership
        </h1>
        <p className="text-base sm:text-lg text-[#A5AEC0] leading-relaxed">
          The student officers, domain leads, and faculty advisors directing
          chapter governance, event operations, and technical initiatives for Term 2026–2027.
        </p>
      </div>

      {/* Official Data Notice Banner */}
      <div className="p-4 rounded-xl border border-[#252D3D] bg-[#101522] flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-semibold text-[#F5F7FB] block">
            Official Chapter Roster Notice:
          </span>
          <p className="text-[#A5AEC0] leading-relaxed">
            In compliance with our integrity constraints, officer names are displayed with
            transparent <code>[Pending Member Verification]</code> tags until the official 2026–2027
            election results and advisor appointments are verified by the department.
          </p>
        </div>
      </div>

      {/* Faculty Coordinator Showcase */}
      <section className="space-y-6" aria-labelledby="faculty-heading">
        <div className="border-b border-[#252D3D] pb-3">
          <Badge variant="accent" size="sm" className="mb-2">
            Institutional Oversight
          </Badge>
          <h2 id="faculty-heading" className="text-2xl font-bold text-[#F5F7FB]">
            Faculty Sponsor & Coordinator
          </h2>
          <p className="text-xs text-[#A5AEC0] mt-1">
            Department of Computer Science & Engineering, DPG University.
          </p>
        </div>

        <Card variant="elevated" className="border-[#252D3D]">
          <div className="flex flex-col md:flex-row items-start gap-6 p-2">
            <div className="w-20 h-20 rounded-2xl bg-[#080B12] border border-[#252D3D] flex items-center justify-center text-[#648CFF] shrink-0">
              <GraduationCap className="w-10 h-10" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="sm">
                  {faculty.roleTitle}
                </Badge>
                <span className="text-xs font-mono text-[#A5AEC0]">{faculty.tenureYear}</span>
              </div>

              <h3 className="text-xl font-bold text-[#F5F7FB]">
                {faculty.namePlaceholder}
              </h3>

              <p className="text-xs text-[#648CFF] font-mono">
                {faculty.department}
              </p>

              <p className="text-xs sm:text-sm text-[#A5AEC0] leading-relaxed">
                {faculty.bio}
              </p>

              <div className="pt-2 border-t border-[#252D3D]/60 space-y-1.5">
                <span className="text-xs font-semibold text-[#F5F7FB] block">
                  Core Advisory Mandate:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A5AEC0]">
                  {faculty.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#648CFF] shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Student Executive Board */}
      <section className="space-y-6" aria-labelledby="exec-heading">
        <div className="border-b border-[#252D3D] pb-3">
          <Badge variant="accent" size="sm" className="mb-2">
            Student Governance
          </Badge>
          <h2 id="exec-heading" className="text-2xl font-bold text-[#F5F7FB]">
            Student Executive Board (Term 2026–2027)
          </h2>
          <p className="text-xs text-[#A5AEC0] mt-1">
            Elected student officers responsible for daily chapter operations, events, and treasury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {executiveBoard.map((officer) => (
            <Card key={officer.id} variant="surface" className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral" size="sm">
                    {officer.roleTitle}
                  </Badge>
                  <span className="text-xs font-mono text-[#A5AEC0]">{officer.tenureYear}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#F5F7FB]">
                    {officer.namePlaceholder}
                  </h3>
                  <div className="text-xs text-[#648CFF] font-mono mt-0.5">
                    {officer.department}
                  </div>
                </div>

                <p className="text-xs text-[#A5AEC0] leading-relaxed">
                  {officer.bio}
                </p>

                <div className="pt-2 border-t border-[#252D3D]/60 space-y-1">
                  <span className="text-[11px] font-semibold text-[#A5AEC0] uppercase tracking-wider block">
                    Key Responsibilities:
                  </span>
                  <ul className="space-y-1 text-xs text-[#A5AEC0]">
                    {officer.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#648CFF] mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#252D3D]/60 mt-4 flex items-center justify-between text-xs text-[#A5AEC0]">
                <span className="font-mono text-[11px]">Officer Profile</span>
                <span className="text-[#648CFF] font-mono text-[11px]">DPGU ACM</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Domain & Special Interest Group Leads */}
      <section className="space-y-6" aria-labelledby="leads-heading">
        <div className="border-b border-[#252D3D] pb-3">
          <Badge variant="accent" size="sm" className="mb-2">
            Technical Directorate
          </Badge>
          <h2 id="leads-heading" className="text-2xl font-bold text-[#F5F7FB]">
            Domain Leads & Directors
          </h2>
          <p className="text-xs text-[#A5AEC0] mt-1">
            Engineers and designers directing specific functional specializations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {domainLeads.map((lead) => (
            <Card key={lead.id} variant="surface" className="flex flex-col justify-between">
              <div className="space-y-2.5">
                <Badge variant="neutral" size="sm">
                  {lead.roleTitle}
                </Badge>

                <h3 className="text-sm font-bold text-[#F5F7FB]">
                  {lead.namePlaceholder}
                </h3>

                <div className="text-xs text-[#648CFF] font-mono">
                  {lead.department}
                </div>

                <p className="text-xs text-[#A5AEC0] leading-relaxed">
                  {lead.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#252D3D]/60 mt-3 text-[11px] text-[#A5AEC0] font-mono">
                Term 2026–2027 • DPGU
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
