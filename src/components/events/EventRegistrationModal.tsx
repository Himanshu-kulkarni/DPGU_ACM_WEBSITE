"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Plus, Trash2, CheckCircle2, AlertCircle, Users, ArrowRight } from "lucide-react";

export interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    slug: string;
    title: string;
    eventType: string; // "FREE" | "PAID"
    priceInr: number;
    isTeamEvent?: boolean;
    minTeamSize?: number;
    maxTeamSize?: number;
    venue?: string;
    startTime?: string;
  };
}

interface TeamMemberField {
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberRollNumber: string;
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  event,
}: EventRegistrationModalProps) {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [collegeName, setCollegeName] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [rollNumber, setRollNumber] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const isFree = event.eventType === "FREE";
  const isTeam = !!event.isTeamEvent;
  const minTeam = event.minTeamSize || 1;
  const maxTeam = event.maxTeamSize || 4;
  // Leader counts as 1
  const requiredAdditionalMembers = Math.max(0, minTeam - 1);
  const maxAdditionalMembers = Math.max(0, maxTeam - 1);

  const [teamMembers, setTeamMembers] = React.useState<TeamMemberField[]>(() => {
    if (!isTeam || requiredAdditionalMembers <= 0) return [];
    const initial: TeamMemberField[] = [];
    for (let i = 0; i < requiredAdditionalMembers; i++) {
      initial.push({
        memberName: "",
        memberEmail: "",
        memberPhone: "",
        memberRollNumber: "",
      });
    }
    return initial;
  });
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [hpWebsite, setHpWebsite] = React.useState(""); // Anti-bot honeypot

  // Submission State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successResult, setSuccessResult] = React.useState<{
    reference: string;
    ticketToken: string;
    status: string;
    paymentStatus: string;
    redirectUrl: string;
  } | null>(null);

  const addTeamMember = () => {
    if (teamMembers.length < maxAdditionalMembers) {
      setTeamMembers((prev) => [
        ...prev,
        { memberName: "", memberEmail: "", memberPhone: "", memberRollNumber: "" },
      ]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > requiredAdditionalMembers) {
      setTeamMembers((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMemberField,
    value: string
  ) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setCollegeName("");
    setDepartment("");
    setRollNumber("");
    setTeamName("");
    setTeamMembers([]);
    setAcceptedTerms(false);
    setHpWebsite("");
    setErrorMsg(null);
    setSuccessResult(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic client checks
    if (!acceptedTerms) {
      setErrorMsg("Please accept the event terms and chapter code of conduct to proceed.");
      return;
    }

    if (isTeam) {
      if (!teamName.trim()) {
        setErrorMsg("Please enter a name for your team.");
        return;
      }
      const totalSize = 1 + teamMembers.length;
      if (totalSize < minTeam || totalSize > maxTeam) {
        setErrorMsg(`Team size must be between ${minTeam} and ${maxTeam} members.`);
        return;
      }
      for (let i = 0; i < teamMembers.length; i++) {
        const m = teamMembers[i];
        if (!m.memberName.trim() || !m.memberEmail.trim()) {
          setErrorMsg(`Please provide a name and email for Team Member #${i + 2}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        eventId: event.id,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        collegeName: collegeName.trim(),
        department: department.trim(),
        rollNumber: rollNumber.trim(),
        teamName: isTeam ? teamName.trim() : undefined,
        teamMembers: isTeam
          ? teamMembers.map((m) => ({
              memberName: m.memberName.trim(),
              memberEmail: m.memberEmail.trim().toLowerCase(),
              memberPhone: m.memberPhone.trim() || undefined,
              memberRollNumber: m.memberRollNumber.trim() || undefined,
            }))
          : undefined,
        acceptedTerms,
        hpWebsite, // Honeypot
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete registration.");
      }

      setSuccessResult({
        reference: data.reference,
        ticketToken: data.ticket_token,
        status: data.registration_status,
        paymentStatus: data.payment_status,
        redirectUrl: data.redirect_url,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={successResult ? "Registration Confirmed" : `Register for ${event.title}`}
      description={
        successResult
          ? "Your seat has been reserved. Check your ticket details below."
          : isFree
          ? "Free Guest Pass • Instant confirmation"
          : `Entry Fee: ₹${event.priceInr} INR • Reservation status`
      }
      size="lg"
    >
      {/* SUCCESS STATE */}
      {successResult ? (
        <div className="space-y-6 py-2 text-center">
          <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#F5F7FB]">
              {successResult.status === "CONFIRMED"
                ? "You're Going!"
                : "Registration Provisionally Created"}
            </h3>
            <p className="text-sm text-[#A5AEC0] max-w-md mx-auto">
              {successResult.status === "CONFIRMED"
                ? "A confirmation email with your boarding pass has been sent to your inbox."
                : "Your registration is saved. Complete payment verification in Phase 5 to finalize your pass."}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#252D3D] bg-[#171E2D] max-w-sm mx-auto space-y-2">
            <div className="text-xs text-[#A5AEC0] uppercase tracking-wider font-mono">
              Ticket Pass Code
            </div>
            <div className="text-2xl font-mono font-extrabold text-[#648CFF] tracking-wider">
              {successResult.ticketToken}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Badge variant={successResult.status === "CONFIRMED" ? "success" : "warning"}>
                {successResult.status}
              </Badge>
              <Badge variant="neutral">
                {isFree ? "Free Admission" : `₹${event.priceInr} INR`}
              </Badge>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                handleClose();
                router.push(successResult.redirectUrl);
              }}
            >
              <span>View Full Ticket & QR Pass</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleSubmit} className="space-y-5 py-1">
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs text-[#EF4444] flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Registration Error</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Anti-Bot Honeypot Field (Visually & Assistively Hidden) */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true">
            <label htmlFor="reg-hp-website">Leave this field blank</label>
            <input
              id="reg-hp-website"
              type="text"
              name="hp_website"
              tabIndex={-1}
              autoComplete="off"
              value={hpWebsite}
              onChange={(e) => setHpWebsite(e.target.value)}
            />
          </div>

          {/* Primary Registrant Information */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#648CFF] flex items-center gap-1.5 border-b border-[#252D3D] pb-1.5">
              <span>{isTeam ? "Team Leader / Primary Contact" : "Participant Details"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="reg-full-name"
                label="Full Name"
                placeholder="Aryan Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Input
                id="reg-email"
                type="email"
                label="Email Address"
                placeholder="student@dpgu.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Ticket pass will be delivered here"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="reg-phone"
                type="tel"
                label="Contact Phone"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Input
                id="reg-roll"
                label="Student Roll / ID Number"
                placeholder="23BCSE104"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="reg-college"
                label="College / University"
                placeholder="DPG University"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Input
                id="reg-dept"
                label="Department & Year"
                placeholder="B.Tech CSE (3rd Year)"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Team Registration Section (If Team Event) */}
          {isTeam && (
            <div className="space-y-4 pt-3 border-t border-[#252D3D]">
              <div className="flex items-center justify-between border-b border-[#252D3D] pb-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#648CFF] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Configuration ({1 + teamMembers.length} / {maxTeam} Members)</span>
                </div>
                <span className="text-[11px] text-[#A5AEC0]">
                  Required: {minTeam} – {maxTeam} members
                </span>
              </div>

              <Input
                id="reg-team-name"
                label="Team Name"
                placeholder="e.g. ByteCrafters"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                disabled={isSubmitting}
              />

              {/* Additional Team Members */}
              <div className="space-y-3">
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#252D3D] bg-[#171E2D]/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F5F7FB]">
                        Team Member #{idx + 2}
                      </span>
                      {teamMembers.length > requiredAdditionalMembers && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(idx)}
                          disabled={isSubmitting}
                          className="text-xs text-[#EF4444] hover:text-[#EF4444]/80 flex items-center gap-1 transition-colors"
                          aria-label={`Remove Team Member #${idx + 2}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        id={`member-name-${idx}`}
                        label="Member Name"
                        placeholder="Member Full Name"
                        value={member.memberName}
                        onChange={(e) => updateTeamMember(idx, "memberName", e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <Input
                        id={`member-email-${idx}`}
                        type="email"
                        label="Member Email"
                        placeholder="member@university.edu"
                        value={member.memberEmail}
                        onChange={(e) => updateTeamMember(idx, "memberEmail", e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        id={`member-phone-${idx}`}
                        type="tel"
                        label="Member Phone (Optional)"
                        placeholder="+91..."
                        value={member.memberPhone}
                        onChange={(e) => updateTeamMember(idx, "memberPhone", e.target.value)}
                        disabled={isSubmitting}
                      />
                      <Input
                        id={`member-roll-${idx}`}
                        label="Roll Number (Optional)"
                        placeholder="Roll / ID"
                        value={member.memberRollNumber}
                        onChange={(e) => updateTeamMember(idx, "memberRollNumber", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}

                {teamMembers.length < maxAdditionalMembers && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeamMember}
                    disabled={isSubmitting}
                    className="w-full justify-center text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Another Team Member</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Terms Agreement Checkbox */}
          <div className="pt-2 border-t border-[#252D3D]">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="reg-terms-checkbox"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 rounded border-[#252D3D] bg-[#080B12] text-[#648CFF] focus:ring-[#648CFF]/30 cursor-pointer"
                required
              />
              <span className="text-xs text-[#A5AEC0] leading-relaxed">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#648CFF] underline hover:text-[#648CFF]/80"
                >
                  DPGU ACM Event Terms
                </a>{" "}
                and confirm that all attendee details are accurate.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#252D3D]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !acceptedTerms}
              className="min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>Processing...</span>
                </>
              ) : isFree ? (
                "Confirm Free Pass"
              ) : (
                `Reserve Pass (₹${event.priceInr})`
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
