"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  PlusCircle,
  Trash2,
  Edit2,
  Globe,
  Link2,
} from "lucide-react";
import type { TeamMemberEntity, TeamCategory } from "@/lib/db/types";

interface TeamClientProps {
  initialMembers: TeamMemberEntity[];
}

export function TeamClient({ initialMembers }: TeamClientProps) {
  const router = useRouter();
  const [members, setMembers] = React.useState<TeamMemberEntity[]>(initialMembers);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = React.useState("");
  const [roleTitle, setRoleTitle] = React.useState("");
  const [category, setCategory] = React.useState<TeamCategory>("EXECUTIVE");
  const [department, setDepartment] = React.useState("B.Tech CSE, DPG University");
  const [tenureYear, setTenureYear] = React.useState("Term 2026–2027");
  const [bio, setBio] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [displayOrder, setDisplayOrder] = React.useState(10);
  const [isActive, setIsActive] = React.useState(true);

  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = () => {
    setFullName("");
    setRoleTitle("");
    setCategory("EXECUTIVE");
    setDepartment("B.Tech CSE, DPG University");
    setTenureYear("Term 2026–2027");
    setBio("");
    setPhotoUrl("");
    setLinkedinUrl("");
    setGithubUrl("");
    setDisplayOrder(10);
    setIsActive(true);
    setEditingId(null);
    setShowAddForm(false);
    setError("");
  };

  const handleEditClick = (member: TeamMemberEntity) => {
    setEditingId(member.id);
    setFullName(member.full_name);
    setRoleTitle(member.role_title);
    setCategory(member.category);
    setDepartment(member.department);
    setTenureYear(member.tenure_year);
    setBio(member.bio || "");
    setPhotoUrl(member.photo_url || "");
    setLinkedinUrl(member.linkedin_url || "");
    setGithubUrl(member.github_url || "");
    setDisplayOrder(member.display_order);
    setIsActive(member.is_active);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !roleTitle.trim()) {
      setError("Full name and role title are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        full_name: fullName.trim(),
        role_title: roleTitle.trim(),
        category,
        department: department.trim(),
        tenure_year: tenureYear.trim(),
        bio: bio.trim() || undefined,
        photo_url: photoUrl.trim() || undefined,
        linkedin_url: linkedinUrl.trim() || undefined,
        github_url: githubUrl.trim() || undefined,
        display_order: Number(displayOrder),
        is_active: isActive,
      };

      if (editingId) {
        // Update
        const res = await fetch(`/api/admin/team/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Update failed");
          setIsSubmitting(false);
          return;
        }

        const data = await res.json();
        setMembers((prev) =>
          prev.map((m) => (m.id === editingId ? data.member : m))
        );
      } else {
        // Create
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Creation failed");
          setIsSubmitting(false);
          return;
        }

        const data = await res.json();
        setMembers((prev) => [...prev, data.member]);
      }

      resetForm();
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("Network error occurred.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from team records?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">
              Leadership Subsystem
            </Badge>
            <span className="text-xs text-[#A5AEC0] font-mono">
              {members.length} Officers Registered
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Chapter Team & Officers</h1>
          <p className="text-xs sm:text-sm text-[#A5AEC0]">
            Maintain the faculty sponsor profile, executive council, domain leads, and committee members.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          {showAddForm ? "Close Form" : "Add Team Member"}
        </Button>
      </div>

      {/* Add / Edit Form Modal / Expandable */}
      {showAddForm && (
        <Card variant="elevated" className="border-[#648CFF]/40">
          <CardHeader>
            <CardTitle className="text-base">
              {editingId ? "Edit Officer Profile" : "Register New Officer"}
            </CardTitle>
            <CardDescription>
              Configure display order, tenure, portfolio role, and external profile URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div role="alert" className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Aryan Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Input
                  label="Role Title *"
                  placeholder="e.g. Chapter Chair (President)"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Category *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TeamCategory)}
                  options={[
                    { value: "FACULTY", label: "Faculty Coordinator" },
                    { value: "EXECUTIVE", label: "Executive Committee" },
                    { value: "LEAD", label: "Domain Lead" },
                    { value: "CORE", label: "Core Volunteer" },
                  ]}
                />

                <Input
                  label="Department / Program *"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />

                <Input
                  label="Tenure Year *"
                  value={tenureYear}
                  onChange={(e) => setTenureYear(e.target.value)}
                  required
                />
              </div>

              <Textarea
                label="Biographical Note"
                rows={3}
                placeholder="Brief summary of duties and academic interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Display Order (Sort)"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />

                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />

                <Input
                  label="GitHub URL"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5F7FB]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-[#252D3D] bg-[#080B12] text-[#648CFF]"
                  />
                  <span>Active &amp; Visible on Public Team Page</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="text" size="sm" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                    {editingId ? "Update Member" : "Save Member"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} variant="elevated" className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={
                      member.category === "FACULTY"
                        ? "accent"
                        : member.category === "EXECUTIVE"
                        ? "success"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {member.category}
                  </Badge>
                  {!member.is_active && (
                    <Badge variant="warning" size="sm">
                      Hidden
                    </Badge>
                  )}
                  <span className="text-[10px] text-[#A5AEC0] font-mono">
                    #{member.display_order}
                  </span>
                </div>
                <h3 className="font-bold text-[#F5F7FB] text-base">{member.full_name}</h3>
                <div className="text-xs text-[#648CFF] font-medium">{member.role_title}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditClick(member)}
                  className="p-1.5 rounded hover:bg-[#171E2D] text-[#A5AEC0] hover:text-[#F5F7FB] transition-colors cursor-pointer"
                  title="Edit member"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.full_name)}
                  className="p-1.5 rounded hover:bg-[#EF4444]/10 text-[#A5AEC0] hover:text-[#EF4444] transition-colors cursor-pointer"
                  title="Delete member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-[#A5AEC0] space-y-0.5">
              <div>{member.department}</div>
              <div className="font-mono text-[11px] text-[#A5AEC0]/70">{member.tenure_year}</div>
            </div>

            {member.bio && (
              <p className="text-xs text-[#A5AEC0]/90 line-clamp-2">{member.bio}</p>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-[#252D3D]/50 text-xs text-[#A5AEC0]">
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#648CFF] flex items-center gap-1 font-mono text-[11px]"
                  title="LinkedIn"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#F5F7FB] flex items-center gap-1 font-mono text-[11px]"
                  title="GitHub"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
