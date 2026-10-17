"use client";

import * as React from "react";
import { getAllProjects, getAllAchievements } from "@/data/projects";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ExternalLink,
} from "lucide-react";

export default function ProjectsPage() {
  const allProjects = React.useMemo(() => getAllProjects(), []);
  const allAchievements = React.useMemo(() => getAllAchievements(), []);

  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = ["All", "Web & Cloud", "AI & Machine Learning", "Embedded & IoT", "Systems & Tools"];

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === "All") return allProjects;
    return allProjects.filter((p) => p.category === selectedCategory);
  }, [allProjects, selectedCategory]);

  return (
    <div className="space-y-16 py-4 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm" showDot>
            Engineering & Research
          </Badge>
          <Badge variant="neutral" size="sm">
            {allProjects.length} Projects
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Student Projects & Chapter Achievements
        </h1>
        <p className="text-base text-[#A5AEC0] max-w-3xl leading-relaxed">
          Open-source software, hardware prototypes, and competition podium finishes
          engineered by members of the DPG University ACM Student Chapter.
        </p>
      </div>

      {/* 1. STUDENT PROJECTS SECTION */}
      <section className="space-y-8" aria-labelledby="projects-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252D3D] pb-4">
          <h2 id="projects-heading" className="text-2xl font-bold text-[#F5F7FB]">
            Open-Source Software & Prototypes
          </h2>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#648CFF]/15 text-[#648CFF] border-[#648CFF]/40 font-semibold"
                    : "bg-[#101522] text-[#A5AEC0] border-[#252D3D] hover:border-[#3A4660] hover:text-[#F5F7FB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No Projects in this Category"
            description="No active projects currently match this filter. Select another category or check back soon."
            action={
              <Button variant="secondary" size="sm" onClick={() => setSelectedCategory("All")}>
                View All Projects
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                variant="surface"
                isInteractive
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="neutral" size="sm">
                      {project.category}
                    </Badge>
                    <Badge
                      variant={project.status === "ACTIVE" ? "success" : "neutral"}
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl mb-2 text-[#F5F7FB]">
                    {project.title}
                  </CardTitle>

                  <CardDescription className="text-xs leading-relaxed mb-4">
                    {project.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded bg-[#080B12] border border-[#252D3D] text-[#A5AEC0] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-[#A5AEC0] font-mono">
                    Team: <span className="text-[#F5F7FB]">{project.teamName}</span>
                  </div>
                </div>

                <CardFooter className="px-0 pb-0 pt-4 border-t border-[#252D3D]/60 flex items-center justify-between mt-4">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#A5AEC0] hover:text-[#F5F7FB] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>Repository</span>
                    </a>
                  )}

                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#648CFF] hover:underline"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#A5AEC0]/60 font-mono">
                      Campus Lab Prototype
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 2. ACHIEVEMENTS & COMPETITIONS SECTION */}
      <section className="space-y-8" aria-labelledby="honors-heading">
        <div className="border-b border-[#252D3D] pb-4">
          <Badge variant="accent" size="sm" className="mb-2">
            Hall of Fame
          </Badge>
          <h2 id="honors-heading" className="text-2xl font-bold text-[#F5F7FB]">
            Competition Honors & Distinctions
          </h2>
          <p className="text-sm text-[#A5AEC0] mt-1">
            Verified student victories in national hackathons and collegiate algorithm contests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allAchievements.map((ach) => (
            <Card key={ach.id} variant="elevated" className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="warning" size="sm">
                  {ach.rankBadge}
                </Badge>
                <span className="text-xs font-mono text-[#A5AEC0]">{ach.year}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F5F7FB]">{ach.title}</h3>
                <p className="text-xs text-[#648CFF] font-mono mt-0.5">
                  {ach.eventName} • {ach.organizer}
                </p>
              </div>

              <p className="text-xs text-[#A5AEC0] leading-relaxed">
                {ach.description}
              </p>

              <div className="pt-2 border-t border-[#252D3D]/60 text-[11px] text-[#A5AEC0] font-mono">
                Team: {ach.teamMembersPlaceholder}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
