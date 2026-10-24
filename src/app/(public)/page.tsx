import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFacultyCoordinator, getAllOfficers } from "@/data/team";
import {
  ArrowRight,
  Users,
  Code2,
  ShieldCheck,
  Layers,
  GraduationCap,
  Sparkles,
  History,
  Award,
  Globe2,
  Terminal,
} from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "DPGU ACM Student Chapter | Build. Innovate. Compete.",
  description:
    "Official website of DPG University ACM Student Chapter. Advancing computing through flagship hackathons, technical workshops, open-source engineering, and student leadership.",
};

function getInitials(name: string): string {
  const parts = name.replace(/^Dr\.\s*/i, "").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function HomePage() {
  const faculty = getFacultyCoordinator();
  const allOfficers = getAllOfficers();
  const executiveOfficers = allOfficers.filter((o) => o.category === "EXECUTIVE");
  const leadOfficers = allOfficers.filter((o) => o.category === "LEAD");

  // Selected leadership and team members to showcase on homepage
  const studentLeadership = executiveOfficers.slice(0, 2); // Chair and Vice Chair
  const teamMembersPreview = [
    ...executiveOfficers.slice(2, 4), // General Secretary and Treasurer
    ...leadOfficers.slice(0, 2),      // Technical Lead and AI/Research Lead
  ];

  return (
    <div className="space-y-20 sm:space-y-28 py-4">
      {/* 1. HERO SECTION: Headline "Build. Innovate. Compete." */}
      <section className="relative overflow-hidden rounded-3xl border border-[#252D3D] bg-[#101522] p-8 sm:p-14 lg:p-20 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-7">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="accent" size="md" showDot>
              Association for Computing Machinery
            </Badge>
            <Badge variant="neutral" size="md">
              DPG University • Gurugram
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7FB] leading-[1.1]">
              Build. Innovate. <span className="text-[#648CFF]">Compete.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#A5AEC0] leading-relaxed max-w-2xl">
              The premier student computing community at DPG University. We build
              open-source software, host high-impact hackathons, master algorithmic
              problem-solving, and cultivate technological leadership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/events">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Chapter Events
              </Button>
            </Link>
            <Link href="/team">
              <Button variant="secondary" size="lg">
                Meet Our Leadership
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar (Adjusted to avoid removed sections) */}
          <div className="pt-6 border-t border-[#252D3D] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F7FB]">600+</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Event Attendees</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#648CFF]">15+</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Workshops & Talks</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F7FB]">4</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Core Chapter Pillars</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#10B981]">100%</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Open & Free Access</div>
            </div>
          </div>
        </div>

        {/* Ambient Subtle Radial Gradient */}
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#648CFF]/8 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* 2. MEET OUR TEAM SECTION */}
      <section className="space-y-8" aria-labelledby="team-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252D3D] pb-5">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Leadership & Governance
            </Badge>
            <h2 id="team-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
              Meet Our Team
            </h2>
            <p className="text-sm text-[#A5AEC0] mt-1">
              The student officers and faculty advisors guiding the DPGU ACM Student Chapter.
            </p>
          </div>
          <Link href="/team">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View Full Team
            </Button>
          </Link>
        </div>

        {/* Leadership Distinction: Faculty Sponsor & Executive Leaders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Faculty Sponsor Card */}
          <Card variant="elevated" className="border-[#648CFF]/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#171E2D] to-[#101522] border-2 border-[#648CFF]/40 flex items-center justify-center text-[#648CFF] font-bold text-lg font-mono shrink-0 shadow-md">
                  {faculty.photoUrl ? (
                    <img
                      src={faculty.photoUrl}
                      alt={faculty.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <GraduationCap className="w-7 h-7 text-[#648CFF]" />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {faculty.linkedinUrl && (
                    <a
                      href={faculty.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                      aria-label={`${faculty.name} LinkedIn`}
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
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
                      <GitHubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <Badge variant="accent" size="sm" className="mb-2">
                  Faculty Sponsor
                </Badge>
                <h3 className="text-lg font-bold text-[#F5F7FB]">
                  {faculty.name}
                </h3>
                <p className="text-xs text-[#648CFF] font-mono mt-0.5">
                  {faculty.department}
                </p>
              </div>

              <p className="text-xs text-[#A5AEC0] leading-relaxed line-clamp-3">
                {faculty.bio}
              </p>
            </div>

            <div className="pt-3 border-t border-[#252D3D]/60 mt-4 flex items-center justify-between text-xs text-[#A5AEC0]">
              <span className="font-mono text-[11px]">Academic Advisory</span>
              <span className="text-[#648CFF] font-mono text-[11px]">{faculty.tenureYear}</span>
            </div>
          </Card>

          {/* Chapter Chair & Vice Chair */}
          {studentLeadership.map((leader) => (
            <Card key={leader.id} variant="elevated" className="border-[#252D3D] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#171E2D] to-[#101522] border border-[#252D3D] flex items-center justify-center text-[#648CFF] font-bold text-lg font-mono shrink-0 shadow-md">
                    {leader.photoUrl ? (
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      getInitials(leader.name)
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {leader.linkedinUrl && (
                      <a
                        href={leader.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                        aria-label={`${leader.name} LinkedIn`}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {leader.githubUrl && (
                      <a
                        href={leader.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#A5AEC0] hover:text-[#648CFF] hover:bg-[#171E2D] border border-[#252D3D] transition-colors"
                        aria-label={`${leader.name} GitHub`}
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <Badge variant="accent" size="sm" className="mb-2">
                    {leader.roleTitle}
                  </Badge>
                  <h3 className="text-lg font-bold text-[#F5F7FB]">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-[#648CFF] font-mono mt-0.5">
                    {leader.department}
                  </p>
                </div>

                <p className="text-xs text-[#A5AEC0] leading-relaxed line-clamp-3">
                  {leader.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#252D3D]/60 mt-4 flex items-center justify-between text-xs text-[#A5AEC0]">
                <span className="font-mono text-[11px]">Executive Leadership</span>
                <span className="text-[#648CFF] font-mono text-[11px]">{leader.tenureYear}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Other Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembersPreview.map((member) => (
            <Card key={member.id} variant="surface" className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] font-mono font-bold text-xs shrink-0">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-[#A5AEC0] hover:text-[#648CFF] transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <LinkedInIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-[#A5AEC0] hover:text-[#648CFF] transition-colors"
                        aria-label={`${member.name} GitHub`}
                      >
                        <GitHubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  {member.roleTitle}
                </Badge>

                <div>
                  <h4 className="text-sm font-bold text-[#F5F7FB]">
                    {member.name}
                  </h4>
                  <div className="text-[11px] text-[#648CFF] font-mono">
                    {member.department}
                  </div>
                </div>

                <p className="text-xs text-[#A5AEC0] leading-relaxed line-clamp-2">
                  {member.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#252D3D]/60 mt-3 text-[11px] text-[#A5AEC0] font-mono">
                {member.tenureYear}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Link href="/team">
            <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Full Committee & Directorate Roster
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. EVENTS EXPLORATION SECTION (No standalone widget / event cards) */}
      <section className="relative overflow-hidden rounded-3xl border border-[#252D3D] bg-gradient-to-br from-[#101522] via-[#080B12] to-[#101522] p-8 sm:p-12 shadow-xl" aria-labelledby="events-hub-heading">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" size="sm" showDot>
              Chapter Events & Programs
            </Badge>
            <Badge variant="neutral" size="sm">
              Continuous Technical Calendar
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 id="events-hub-heading" className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FB]">
              Flagship Hackathons, Workshops & Technical Talks
            </h2>
            <p className="text-sm sm:text-base text-[#A5AEC0] leading-relaxed">
              From 36-hour competitive hackathons to intensive systems engineering masterclasses,
              our events connect passionate student developers with industry mentors. Public registration
              is completely frictionless with instant digital QR boarding passes.
            </p>
          </div>

          {/* Quick Features Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-[#252D3D] bg-[#080B12]/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#648CFF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Account Signup</span>
              </div>
              <p className="text-[11px] text-[#A5AEC0]">
                Register with email and name; passes generated instantly.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#252D3D] bg-[#080B12]/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Digital QR Passes</span>
              </div>
              <p className="text-[11px] text-[#A5AEC0]">
                Cryptographic ticket verification and instant check-in.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#252D3D] bg-[#080B12]/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B]">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Certificates</span>
              </div>
              <p className="text-[11px] text-[#A5AEC0]">
                ACM-accredited digital participation certificates for attendees.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link href="/events">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Upcoming Events
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="secondary" size="lg" leftIcon={<History className="w-4 h-4" />}>
                Browse Past Events & Archives
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ABOUT DPGU ACM SECTION */}
      <section className="space-y-8" aria-labelledby="about-heading">
        <div className="border-b border-[#252D3D] pb-5">
          <Badge variant="accent" size="sm" className="mb-2">
            Chapter Mission & Values
          </Badge>
          <h2 id="about-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
            About DPGU ACM Student Chapter
          </h2>
          <p className="text-sm text-[#A5AEC0] mt-1 max-w-3xl leading-relaxed">
            Chartered at DPG University in Gurugram, our chapter is affiliated with ACM
            International—the world&apos;s oldest and most prestigious scientific computing
            society. We operate on four core pillars:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="surface">
            <CardHeader className="p-0 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">1. Learn</CardTitle>
            </CardHeader>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Curated masterclasses, peer code reviews, and study circles spanning cloud
              infrastructure, machine learning, and secure systems.
            </p>
          </Card>

          <Card variant="surface">
            <CardHeader className="p-0 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">2. Build</CardTitle>
            </CardHeader>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Collaborative open-source software, student prototypes, and real-world tools
              deployed for campus community benefit.
            </p>
          </Card>

          <Card variant="surface">
            <CardHeader className="p-0 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] mb-3">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">3. Network</CardTitle>
            </CardHeader>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Direct connection with industry software architects, research scholars,
              and alumni working across premier technology organizations.
            </p>
          </Card>

          <Card variant="surface">
            <CardHeader className="p-0 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">4. Lead</CardTitle>
            </CardHeader>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Hands-on leadership experience organizing national hackathons, technical
              symposia, and university-wide initiatives.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. CHAPTER HIGHLIGHTS & VERIFIED MILESTONES */}
      <section className="space-y-8" aria-labelledby="highlights-heading">
        <div className="border-b border-[#252D3D] pb-5">
          <Badge variant="accent" size="sm" className="mb-2">
            Chapter Highlights
          </Badge>
          <h2 id="highlights-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
            Impact & Institutional Milestones
          </h2>
          <p className="text-sm text-[#A5AEC0] mt-1 max-w-3xl leading-relaxed">
            Key highlights of our student community, institutional chartering, and collegiate engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="surface" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
              <Globe2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">ACM Global Affiliation</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Official institutional student chapter affiliated with ACM India and ACM International,
              providing students access to the world-renowned ACM Digital Library, regional symposia,
              and international student computing competitions.
            </CardDescription>
          </Card>

          <Card variant="surface" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
              <Terminal className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Student-Led Engineering</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Operating entirely under student executive leadership and faculty sponsorship. We cultivate
              practical mastery in systems software, fullstack web architectures, algorithms, and
              open-source collaboration.
            </CardDescription>
          </Card>

          <Card variant="surface" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
              <Award className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">National Competition Engagement</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Regularly fielding student teams for Smart India Hackathon (SIH), ACM ICPC regional
              contests, and collegiate hackathons, securing national finalist nominations and podium finishes.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* 6. CALL TO ACTION / JOIN US */}
      <section className="relative overflow-hidden rounded-3xl border border-[#252D3D] bg-gradient-to-b from-[#101522] to-[#080B12] p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <Badge variant="accent" size="sm" showDot>
            Join DPGU ACM Today
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F7FB]">
            Ready to Build the Future of Computing?
          </h2>
          <p className="text-sm sm:text-base text-[#A5AEC0] leading-relaxed">
            Become a part of the official ACM Student Chapter. Gain access to hands-on
            workshops, project incubators, ACM Digital Library resources, and collegiate hackathons.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Apply for Chapter Membership
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" size="lg">
              Browse Chapter Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
