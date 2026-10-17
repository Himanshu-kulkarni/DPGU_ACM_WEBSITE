import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getUpcomingEvents, getFeaturedEvent } from "@/data/events";
import { getAllDomains } from "@/data/domains";
import { getAllAchievements } from "@/data/projects";
import { getFacultyCoordinator, getAllOfficers } from "@/data/team";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Trophy,
  Users,
  Code2,
  ShieldCheck,
  Layers,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DPGU ACM Student Chapter | Build. Innovate. Compete.",
  description:
    "Official website of DPG University ACM Student Chapter. Advancing computing through flagship hackathons, technical workshops, open-source projects, and student leadership.",
};

export default function HomePage() {
  const upcomingEvents = getUpcomingEvents().slice(0, 3);
  const featuredEvent = getFeaturedEvent();
  const domains = getAllDomains();
  const achievements = getAllAchievements().slice(0, 3);
  const faculty = getFacultyCoordinator();
  const officers = getAllOfficers().slice(1, 4); // First 3 student officers

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
                Explore Upcoming Events
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="lg">
                About the Chapter
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 border-t border-[#252D3D] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F7FB]">600+</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Event Attendees</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#648CFF]">6</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Technical Domains</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F7FB]">12+</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Student Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#10B981]">100%</div>
              <div className="text-xs text-[#A5AEC0] mt-0.5">Open & Free Access</div>
            </div>
          </div>
        </div>

        {/* Ambient Subtle Radial Gradient (Non-Distracting) */}
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#648CFF]/8 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* 2. UPCOMING EVENTS */}
      <section className="space-y-8" aria-labelledby="events-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252D3D] pb-5">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Calendar & Registrations
            </Badge>
            <h2 id="events-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
              Upcoming Events & Workshops
            </h2>
            <p className="text-sm text-[#A5AEC0] mt-1">
              Register with zero account creation required. Instant digital pass issuance.
            </p>
          </div>
          <Link href="/events">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Events
            </Button>
          </Link>
        </div>

        {/* Featured Spotlight Card */}
        {featuredEvent && (
          <Card variant="elevated" className="border-[#648CFF]/40 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" size="sm" showDot>
                    Featured Flagship
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {featuredEvent.category}
                  </Badge>
                  <span className="text-xs font-mono text-[#10B981] font-semibold">
                    {featuredEvent.eventType === "FREE" ? "Free Admission" : `₹${featuredEvent.priceInr}`}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FB]">
                  {featuredEvent.title}
                </h3>
                <p className="text-sm text-[#A5AEC0] leading-relaxed">
                  {featuredEvent.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#A5AEC0] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#648CFF]" />
                    <span>Nov 14–15, 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#648CFF]" />
                    <span>{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#A5AEC0]" />
                    <span>{featuredEvent.capacity - featuredEvent.registeredCount} spots remaining</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <Link href={`/events/${featuredEvent.slug}`}>
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Register Now
                  </Button>
                </Link>
                <Link href={`/events/${featuredEvent.slug}`}>
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    Event Details & Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Regular Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <Card key={evt.id} variant="surface" isInteractive className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="neutral" size="sm">
                    {evt.category}
                  </Badge>
                  <span className="text-xs font-mono font-semibold text-[#648CFF]">
                    {evt.eventType === "FREE" ? "FREE" : `₹${evt.priceInr}`}
                  </span>
                </div>

                <CardTitle className="text-lg mb-2">
                  <Link href={`/events/${evt.slug}`} className="hover:text-[#648CFF] transition-colors">
                    {evt.title}
                  </Link>
                </CardTitle>

                <CardDescription className="line-clamp-2 mb-4">
                  {evt.subtitle}
                </CardDescription>

                <div className="space-y-1.5 text-xs text-[#A5AEC0]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#648CFF]" />
                    <span>{new Date(evt.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#648CFF]" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>
              </div>

              <CardFooter className="px-0 pb-0 pt-4 border-t border-[#252D3D]/60 flex items-center justify-between">
                <span className="text-xs text-[#A5AEC0]">
                  {evt.capacity - evt.registeredCount} seats left
                </span>
                <Link href={`/events/${evt.slug}`}>
                  <Button variant="text" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Event
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. ABOUT THE CHAPTER */}
      <section className="space-y-8" aria-labelledby="about-heading">
        <div className="border-b border-[#252D3D] pb-5">
          <Badge variant="accent" size="sm" className="mb-2">
            Charter & Standards
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

      {/* 4. TECHNICAL DOMAINS */}
      <section className="space-y-8" aria-labelledby="domains-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252D3D] pb-5">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Special Interest Groups
            </Badge>
            <h2 id="domains-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
              Technical Domains & Specializations
            </h2>
            <p className="text-sm text-[#A5AEC0] mt-1">
              Explore our student-driven research and engineering working groups.
            </p>
          </div>
          <Link href="/domains">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore All Domains
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((dom) => (
            <Card key={dom.id} variant="surface" isInteractive className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#648CFF] font-medium">
                    SIG // {dom.slug.toUpperCase()}
                  </span>
                  <Badge variant="neutral" size="sm">
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2">
                  <Link href="/domains" className="hover:text-[#648CFF] transition-colors">
                    {dom.title}
                  </Link>
                </CardTitle>
                <CardDescription className="mb-4">
                  {dom.shortDescription}
                </CardDescription>

                <div className="flex flex-wrap gap-1.5">
                  {dom.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#171E2D] border border-[#252D3D] text-[#A5AEC0] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#252D3D]/60 mt-4 flex items-center justify-between text-xs text-[#A5AEC0]">
                <span>{dom.meetingSchedule}</span>
                <span className="text-[#648CFF] font-semibold">Join →</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. ACHIEVEMENTS & COMMUNITY HIGHLIGHTS */}
      <section className="space-y-8" aria-labelledby="achievements-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252D3D] pb-5">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Hall of Fame
            </Badge>
            <h2 id="achievements-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
              Achievements & Competition Honors
            </h2>
            <p className="text-sm text-[#A5AEC0] mt-1">
              Celebrating student excellence across national hackathons and contests.
            </p>
          </div>
          <Link href="/projects">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Honors
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <Card key={ach.id} variant="surface">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                <Badge variant="warning" size="sm">
                  {ach.rankBadge}
                </Badge>
                <span className="text-xs font-mono text-[#A5AEC0] ml-auto">{ach.year}</span>
              </div>
              <CardTitle className="text-base mb-1">{ach.title}</CardTitle>
              <div className="text-xs text-[#648CFF] font-mono mb-2">{ach.eventName}</div>
              <CardDescription className="text-xs leading-relaxed mb-4">
                {ach.description}
              </CardDescription>
              <div className="text-[11px] text-[#A5AEC0]/70 font-mono border-t border-[#252D3D]/60 pt-2">
                Team: {ach.teamMembersPlaceholder}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. TEAM PREVIEW */}
      <section className="space-y-8" aria-labelledby="team-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#252D3D] pb-5">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Chapter Governance
            </Badge>
            <h2 id="team-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F7FB]">
              Faculty Patron & Executive Board
            </h2>
            <p className="text-sm text-[#A5AEC0] mt-1">
              Meet the faculty coordinators and student leads guiding chapter initiatives.
            </p>
          </div>
          <Link href="/team">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Full Committee Roster
            </Button>
          </Link>
        </div>

        {/* Faculty Highlight Card */}
        <Card variant="elevated" className="border-[#252D3D]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#080B12] border border-[#252D3D] flex items-center justify-center text-[#648CFF] shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  Faculty Sponsor
                </Badge>
                <span className="text-xs font-mono text-[#A5AEC0]">{faculty.tenureYear}</span>
              </div>
              <h3 className="text-lg font-bold text-[#F5F7FB]">
                {faculty.namePlaceholder}
              </h3>
              <p className="text-xs text-[#648CFF] font-medium">
                {faculty.department}
              </p>
              <p className="text-xs text-[#A5AEC0] leading-relaxed max-w-2xl pt-1">
                {faculty.bio}
              </p>
            </div>
          </div>
        </Card>

        {/* Officers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officers.map((off) => (
            <Card key={off.id} variant="surface">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="neutral" size="sm">
                  {off.roleTitle}
                </Badge>
              </div>
              <CardTitle className="text-base mb-1">{off.namePlaceholder}</CardTitle>
              <div className="text-xs text-[#648CFF] font-mono mb-2">{off.department}</div>
              <CardDescription className="text-xs leading-relaxed">
                {off.bio}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
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
              Browse Upcoming Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
