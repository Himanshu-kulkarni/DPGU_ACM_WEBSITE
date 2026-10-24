import * as React from "react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFacultyCoordinator, getAllOfficers } from "@/data/team";
import {
  GraduationCap,
} from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Executive Committee & Team",
  description:
    "Meet the faculty coordinator, executive committee officers, and domain leads guiding the DPGU ACM Student Chapter.",
};

function getInitials(name: string): string {
  const parts = name.replace(/^Dr\.\s*/i, "").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F5F7FB]">
          Executive Committee & Leadership
        </h1>
        <p className="text-base sm:text-lg text-[#A5AEC0] leading-relaxed">
          The student officers, domain leads, and faculty advisors directing
          chapter governance, event operations, and technical initiatives for Term 2026–2027.
        </p>
      </div>

      {/* 1. Faculty Coordinator Showcase */}
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
            {/* Avatar / Photo */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#171E2D] to-[#101522] border-2 border-[#648CFF]/40 flex items-center justify-center text-[#648CFF] font-bold text-2xl font-mono shrink-0 shadow-lg relative overflow-hidden">
              {faculty.photoUrl ? (
                <img
                  src={faculty.photoUrl}
                  alt={faculty.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <GraduationCap className="w-10 h-10 mb-0.5 text-[#648CFF]" />
                  <span className="text-[10px] text-[#A5AEC0] font-sans font-normal">Faculty</span>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent" size="sm">
                    {faculty.roleTitle}
                  </Badge>
                  <span className="text-xs font-mono text-[#A5AEC0]">{faculty.tenureYear}</span>
                </div>

                <div className="flex items-center gap-2">
                  {faculty.linkedinUrl && (
                    <a
                      href={faculty.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                      aria-label={`${faculty.name} LinkedIn`}
                    >
                      <LinkedInIcon className="w-4 h-4" />
                    </a>
                  )}
                  {faculty.githubUrl && (
                    <a
                      href={faculty.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                      aria-label={`${faculty.name} GitHub`}
                    >
                      <GitHubIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#F5F7FB]">
                  {faculty.name}
                </h3>
                <p className="text-xs text-[#648CFF] font-mono mt-0.5">
                  {faculty.department}
                </p>
              </div>

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

      {/* 2. Student Executive Board */}
      <section className="space-y-6" aria-labelledby="exec-heading">
        <div className="border-b border-[#252D3D] pb-3">
          <Badge variant="accent" size="sm" className="mb-2">
            Student Leadership
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
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] font-mono font-bold text-sm shrink-0">
                      {officer.photoUrl ? (
                        <img
                          src={officer.photoUrl}
                          alt={officer.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        getInitials(officer.name)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="neutral" size="sm">
                          {officer.roleTitle}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-[#F5F7FB]">
                        {officer.name}
                      </h3>
                      <div className="text-xs text-[#648CFF] font-mono">
                        {officer.department}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {officer.linkedinUrl && (
                      <a
                        href={officer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                        aria-label={`${officer.name} LinkedIn`}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {officer.githubUrl && (
                      <a
                        href={officer.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                        aria-label={`${officer.name} GitHub`}
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#A5AEC0] leading-relaxed pt-1">
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

              <div className="pt-3 border-t border-[#252D3D]/60 mt-3 flex items-center justify-between text-xs text-[#A5AEC0]">
                <span className="font-mono text-[11px]">Executive Officer</span>
                <span className="text-[#648CFF] font-mono text-[11px]">{officer.tenureYear}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Domain & Functional Leads */}
      <section className="space-y-6" aria-labelledby="leads-heading">
        <div className="border-b border-[#252D3D] pb-3">
          <Badge variant="accent" size="sm" className="mb-2">
            Technical Directorate
          </Badge>
          <h2 id="leads-heading" className="text-2xl font-bold text-[#F5F7FB]">
            Functional & Technical Leads
          </h2>
          <p className="text-xs text-[#A5AEC0] mt-1">
            Engineers and designers directing specific functional specializations and chapter infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {domainLeads.map((lead) => (
            <Card key={lead.id} variant="surface" className="flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] font-mono font-bold text-xs shrink-0">
                    {lead.photoUrl ? (
                      <img
                        src={lead.photoUrl}
                        alt={lead.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      getInitials(lead.name)
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {lead.linkedinUrl && (
                      <a
                        href={lead.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                        aria-label={`${lead.name} LinkedIn`}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {lead.githubUrl && (
                      <a
                        href={lead.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                        aria-label={`${lead.name} GitHub`}
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  {lead.roleTitle}
                </Badge>

                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FB]">
                    {lead.name}
                  </h3>
                  <div className="text-xs text-[#648CFF] font-mono">
                    {lead.department}
                  </div>
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
