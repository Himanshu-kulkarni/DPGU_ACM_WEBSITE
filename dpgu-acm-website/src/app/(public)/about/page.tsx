import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getFacultyCoordinator } from "@/data/team";
import {
  Shield,
  Globe,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Chapter",
  description:
    "Learn about the DPG University ACM Student Chapter charter, mission, constitution, and computing society affiliation.",
};

export default function AboutPage() {
  const faculty = getFacultyCoordinator();

  return (
    <div className="space-y-16 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <Badge variant="accent" size="sm" showDot>
          About DPGU ACM
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FB]">
          Advancing Computing as a Science & Profession
        </h1>
        <p className="text-base sm:text-lg text-[#A5AEC0] leading-relaxed">
          The DPG University ACM Student Chapter serves as the epicenter of computing
          culture, open-source engineering, and technological research at DPG University.
        </p>
      </div>

      {/* Chapter Overview & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card variant="surface" className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F7FB]">Global Affiliation</h2>
          <p className="text-sm text-[#A5AEC0] leading-relaxed">
            The Association for Computing Machinery (ACM), founded in 1947, is the world&apos;s
            premier scientific and educational computing society. It publishes peer-reviewed
            research journals, organizes leading conferences (e.g., SIGCOMM, SIGGRAPH, CHI),
            and administers the prestigious A.M. Turing Award—widely recognized as the
            &quot;Nobel Prize of Computing.&quot;
          </p>
        </Card>

        <Card variant="surface" className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F7FB]">Chapter Mission</h2>
          <p className="text-sm text-[#A5AEC0] leading-relaxed">
            Our student chapter is established to empower DPG University students by providing
            direct exposure to computing standards, open research, hands-on engineering labs,
            hackathon sponsorships, and career pathways in software architecture and
            computational sciences.
          </p>
        </Card>
      </div>

      {/* Four Pillars */}
      <div className="space-y-6">
        <div className="border-b border-[#252D3D] pb-3">
          <h2 className="text-2xl font-bold text-[#F5F7FB]">Our Four Pillars</h2>
          <p className="text-xs text-[#A5AEC0] mt-1">
            The foundational principles guiding every workshop, contest, and project we initiate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated">
            <h3 className="text-base font-bold text-[#F5F7FB] mb-1">1. Technical Mastery</h3>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Moving beyond classroom theory to build distributed cloud systems, edge IoT devices,
              and machine learning pipelines.
            </p>
          </Card>

          <Card variant="elevated">
            <h3 className="text-base font-bold text-[#F5F7FB] mb-1">2. Open Source</h3>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Every major software tool built by the chapter is released as open source for the
              global computing community.
            </p>
          </Card>

          <Card variant="elevated">
            <h3 className="text-base font-bold text-[#F5F7FB] mb-1">3. Peer Mentorship</h3>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Senior student developers guiding freshmen in git, algorithms, clean code architecture,
              and interview preparation.
            </p>
          </Card>

          <Card variant="elevated">
            <h3 className="text-base font-bold text-[#F5F7FB] mb-1">4. Ethical Computing</h3>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Adhering to the ACM Code of Ethics: data privacy, accessibility, fairness in machine
              learning, and user protection.
            </p>
          </Card>
        </div>
      </div>

      {/* Faculty Advisor Section */}
      <Card variant="surface" className="border-[#252D3D]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm">
                Faculty Patron
              </Badge>
              <span className="text-xs font-mono text-[#A5AEC0]">{faculty.tenureYear}</span>
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FB]">
              {faculty.namePlaceholder}
            </h3>
            <p className="text-xs text-[#648CFF] font-medium font-mono">
              {faculty.department}
            </p>
            <p className="text-xs text-[#A5AEC0] leading-relaxed pt-1">
              {faculty.bio}
            </p>
          </div>
        </div>
      </Card>

      {/* Chapter Constitution & Ethics */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Constitution & Student Conduct</CardTitle>
          <CardDescription>
            DPGU ACM operates under the standard bylaws mandated by the Association for Computing Machinery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-[#A5AEC0] leading-relaxed">
          <p>
            All active members, event participants, and officers agree to conduct themselves in
            accordance with the <strong>ACM Code of Ethics and Professional Conduct</strong>. We
            maintain a strict anti-harassment policy across all physical workshops, hackathons,
            and online community channels.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://www.acm.org/about-acm/acm-code-of-ethics-and-professional-conduct"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read Full ACM Code of Ethics
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="secondary" size="sm">
                Inquire About Chapter Bylaws
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
