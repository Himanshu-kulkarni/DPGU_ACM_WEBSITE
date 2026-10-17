"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Settings, Save, CheckCircle2, ShieldCheck, Database, HardDrive, Cpu } from "lucide-react";
import type { ChapterSettings } from "@/lib/db/types";

interface SettingsClientProps {
  initialSettings: ChapterSettings;
  adminUsersCount: number;
}

export function SettingsClient({ initialSettings, adminUsersCount }: SettingsClientProps) {
  const router = useRouter();

  const [chapterName, setChapterName] = React.useState(initialSettings.chapter_name);
  const [universityName, setUniversityName] = React.useState(initialSettings.university_name);
  const [contactEmail, setContactEmail] = React.useState(initialSettings.contact_email);
  const [supportPhone, setSupportPhone] = React.useState(initialSettings.support_phone);
  const [location, setLocation] = React.useState(initialSettings.location);
  const [registrationEnabled, setRegistrationEnabled] = React.useState(initialSettings.registration_enabled);
  const [maintenanceMode, setMaintenanceMode] = React.useState(initialSettings.maintenance_mode);
  const [maxPerIp, setMaxPerIp] = React.useState(initialSettings.max_registrations_per_ip);

  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setFeedback("");
      setError("");

      const payload: Partial<ChapterSettings> = {
        chapter_name: chapterName.trim(),
        university_name: universityName.trim(),
        contact_email: contactEmail.trim(),
        support_phone: supportPhone.trim(),
        location: location.trim(),
        registration_enabled: registrationEnabled,
        maintenance_mode: maintenanceMode,
        max_registrations_per_ip: Number(maxPerIp),
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update settings");
        setIsSaving(false);
        return;
      }

      setFeedback("Chapter configuration saved successfully!");
      setIsSaving(false);
      router.refresh();
    } catch {
      setError("Network or update error occurred.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="accent" size="sm">
            Configuration Subsystem
          </Badge>
          <span className="text-xs text-[#A5AEC0] font-mono">
            Chapter Global Parameters
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#F5F7FB]">Chapter Settings &amp; Diagnostics</h1>
        <p className="text-xs sm:text-sm text-[#A5AEC0]">
          Configure institutional contact points, global registration kill switches, and security parameters.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div role="alert" className="p-3.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institutional Identification */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#648CFF]" />
              <CardTitle className="text-base">Identity &amp; Institutional Contacts</CardTitle>
            </div>
            <CardDescription>Official chapter branding and public communication channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Chapter Full Name *"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                required
              />

              <Input
                label="University Name *"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Public Contact Email *"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />

              <Input
                label="Support Phone Number *"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                required
              />
            </div>

            <Input
              label="Campus Postal Address / Venue *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        {/* Global Access Controls */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <CardTitle className="text-base">Global Access Switches</CardTitle>
            </div>
            <CardDescription>Emergency registration toggles and rate limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg bg-[#080B12] border border-[#252D3D]">
              <div>
                <div className="font-bold text-xs text-[#F5F7FB]">Global Event Registration</div>
                <div className="text-[11px] text-[#A5AEC0]">
                  When disabled, all public event registrations are immediately locked.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={registrationEnabled}
                  onChange={(e) => setRegistrationEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-[#252D3D] bg-[#101522] text-[#648CFF]"
                />
                <span className="ml-2 text-xs font-mono text-[#F5F7FB]">
                  {registrationEnabled ? "Enabled" : "Paused"}
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg bg-[#080B12] border border-[#252D3D]">
              <div>
                <div className="font-bold text-xs text-[#F5F7FB]">Maintenance Mode Banner</div>
                <div className="text-[11px] text-[#A5AEC0]">
                  Display scheduled maintenance advisory across public pages.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 rounded border-[#252D3D] bg-[#101522] text-[#648CFF]"
                />
                <span className="ml-2 text-xs font-mono text-[#F5F7FB]">
                  {maintenanceMode ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="max-w-xs">
              <Input
                label="Max Registrations Allowed per IP (Abuse limit)"
                type="number"
                min={1}
                max={50}
                value={maxPerIp}
                onChange={(e) => setMaxPerIp(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save All Settings
          </Button>
        </div>
      </form>

      {/* System Diagnostics Box */}
      <Card variant="surface">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#648CFF]" />
            <CardTitle className="text-sm">Runtime Diagnostics &amp; Architecture</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-[#080B12] border border-[#252D3D]/50 space-y-1">
            <div className="text-[#A5AEC0] flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-[#648CFF]" />
              <span>Database Schema</span>
            </div>
            <div className="text-[#F5F7FB] font-bold">PostgreSQL 20261017000001</div>
            <div className="text-[10px] text-[#10B981]">9 Tables • RLS Policies</div>
          </div>

          <div className="p-3 rounded bg-[#080B12] border border-[#252D3D]/50 space-y-1">
            <div className="text-[#A5AEC0] flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Storage Engine</span>
            </div>
            <div className="text-[#F5F7FB] font-bold">Atomic JSON Store</div>
            <div className="text-[10px] text-[#A5AEC0]">Persisted to .data/db.json</div>
          </div>

          <div className="p-3 rounded bg-[#080B12] border border-[#252D3D]/50 space-y-1">
            <div className="text-[#A5AEC0] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Password Cipher</span>
            </div>
            <div className="text-[#F5F7FB] font-bold">PBKDF2-SHA512</div>
            <div className="text-[10px] text-[#A5AEC0]">100k Iterations + 32B Salt</div>
          </div>

          <div className="p-3 rounded bg-[#080B12] border border-[#252D3D]/50 space-y-1">
            <div className="text-[#A5AEC0] flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-[#648CFF]" />
              <span>Admin Accounts</span>
            </div>
            <div className="text-[#F5F7FB] font-bold">{adminUsersCount} Active Superadmin</div>
            <div className="text-[10px] text-[#10B981]">Zero Public Signups</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
