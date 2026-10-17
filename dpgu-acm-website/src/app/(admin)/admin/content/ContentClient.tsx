"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Save, CheckCircle2 } from "lucide-react";
import type { ContentBlockEntity } from "@/lib/db/types";

interface ContentClientProps {
  initialBlocks: ContentBlockEntity[];
}

interface HeroBlockData {
  headline?: string;
  tagline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface MissionBlockData {
  mission?: string;
  pillars?: Array<{ title: string; desc: string }>;
}

export function ContentClient({ initialBlocks }: ContentClientProps) {
  const router = useRouter();

  // Find blocks or use defaults
  const heroBlock = initialBlocks.find((b) => b.block_key === "homepage_hero");
  const rawHeroData = (heroBlock?.content_json || {}) as HeroBlockData;
  const heroData: Required<HeroBlockData> = {
    headline: rawHeroData.headline || "Build. Innovate. Compete.",
    tagline: rawHeroData.tagline || "The official computing and engineering chapter of DPG University.",
    description: rawHeroData.description || "Empowering student developers, researchers, and tech enthusiasts through competitive programming, workshops, national hackathons, and open source mentorship.",
    primaryCtaText: rawHeroData.primaryCtaText || "Explore Events",
    primaryCtaLink: rawHeroData.primaryCtaLink || "/events",
    secondaryCtaText: rawHeroData.secondaryCtaText || "About Chapter",
    secondaryCtaLink: rawHeroData.secondaryCtaLink || "/about",
  };

  const missionBlock = initialBlocks.find((b) => b.block_key === "chapter_mission");
  const rawMissionData = (missionBlock?.content_json || {}) as MissionBlockData;
  const missionData: Required<MissionBlockData> = {
    mission: rawMissionData.mission || "To foster computing excellence, scientific curiosity, and collaborative innovation within DPG University.",
    pillars: rawMissionData.pillars || [],
  };

  const [headline, setHeadline] = React.useState(heroData.headline);
  const [tagline, setTagline] = React.useState(heroData.tagline);
  const [description, setDescription] = React.useState(heroData.description);
  const [primaryCtaText, setPrimaryCtaText] = React.useState(heroData.primaryCtaText);
  const [primaryCtaLink, setPrimaryCtaLink] = React.useState(heroData.primaryCtaLink);
  const [secondaryCtaText, setSecondaryCtaText] = React.useState(heroData.secondaryCtaText);
  const [secondaryCtaLink, setSecondaryCtaLink] = React.useState(heroData.secondaryCtaLink);

  const [mission, setMission] = React.useState(missionData.mission);

  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setFeedback("");

      const payload = {
        block_key: "homepage_hero",
        title: "Homepage Hero Headline and Subtitle",
        content_json: {
          headline,
          tagline,
          description,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText,
          secondaryCtaLink,
        },
        description: "Displayed at the top of the homepage hero banner",
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedback("Homepage hero block successfully saved to database!");
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setFeedback("");

      const payload = {
        block_key: "chapter_mission",
        title: "Chapter Mission & Pillars",
        content_json: {
          mission,
          pillars: missionData.pillars || [],
        },
        description: "Core pillars showcased in the chapter about section",
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedback("Chapter mission statement successfully saved to database!");
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent" size="sm">
            CMS Subsystem
          </Badge>
          <span className="text-xs text-[#A5AEC0] font-mono">
            Key-Value Content Blocks
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#F5F7FB]">Homepage & Content Management</h1>
        <p className="text-xs sm:text-sm text-[#A5AEC0]">
          Update public headlines, mission declarations, and call-to-action buttons without touching code.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Hero Block Editor */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#648CFF]" />
            <CardTitle className="text-base">Homepage Hero Banner</CardTitle>
          </div>
          <CardDescription>
            Key: <code className="font-mono text-[#648CFF]">homepage_hero</code> &bull; Primary above-the-fold banner copy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveHero} className="space-y-4">
            <Input
              label="Main Headline *"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />

            <Input
              label="Sub-headline / Tagline *"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />

            <Textarea
              label="Mission Description *"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary CTA Text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
              />
              <Input
                label="Primary CTA Link"
                value={primaryCtaLink}
                onChange={(e) => setPrimaryCtaLink(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Secondary CTA Text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
              />
              <Input
                label="Secondary CTA Link"
                value={secondaryCtaLink}
                onChange={(e) => setSecondaryCtaLink(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Hero Block
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Chapter Mission Statement */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#648CFF]" />
            <CardTitle className="text-base">Chapter Mission Declaration</CardTitle>
          </div>
          <CardDescription>
            Key: <code className="font-mono text-[#648CFF]">chapter_mission</code> &bull; Displayed in chapter about overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveMission} className="space-y-4">
            <Textarea
              label="Mission Statement *"
              rows={3}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              required
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Mission Block
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
