import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllAchievements } from "@/data/projects";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Hall of Fame & Achievements",
  description:
    "Honoring collegiate victories, hackathon awards, and research milestones achieved by DPGU ACM students.",
};

export default function AchievementsPage() {
  const achievements = getAllAchievements();

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm" showDot>
            Chapter Excellence
          </Badge>
          <Badge variant="warning" size="sm">
            Hall of Fame
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Achievements & Competition Distinctions
        </h1>
        <p className="text-base text-[#A5AEC0] max-w-3xl leading-relaxed">
          Celebrating student triumphs in national hackathons, ICPC regional contest
          rounds, and peer-reviewed scholarly publications.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => (
          <Card key={ach.id} variant="elevated" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <Badge variant="warning" size="sm">
                  {ach.rankBadge}
                </Badge>
              </div>
              <span className="text-xs font-mono text-[#A5AEC0]">{ach.year}</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#F5F7FB]">{ach.title}</h2>
              <div className="text-xs text-[#648CFF] font-mono mt-0.5">
                {ach.eventName} • {ach.organizer}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A5AEC0] leading-relaxed">
              {ach.description}
            </p>

            <div className="pt-3 border-t border-[#252D3D]/60 flex items-center justify-between text-xs text-[#A5AEC0]">
              <span className="font-mono text-[11px]">
                Team: {ach.teamMembersPlaceholder}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Chapter Contribution Callout */}
      <Card variant="surface" className="text-center p-8 space-y-4">
        <h3 className="text-xl font-bold text-[#F5F7FB]">
          Represented DPGU in a Hackathon or Coding Contest?
        </h3>
        <p className="text-xs text-[#A5AEC0] max-w-lg mx-auto leading-relaxed">
          If your student team secured a podium finish or published a peer-reviewed
          computing paper, submit your verification to be inducted into the Chapter Hall of Fame.
        </p>
        <Link href="/contact">
          <Button variant="primary" size="md">
            Submit Achievement for Verification
          </Button>
        </Link>
      </Card>
    </div>
  );
}
