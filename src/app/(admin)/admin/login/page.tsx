"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Lock, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";

  const [email, setEmail] = React.useState("admin@dpgu.acm.org");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Both administrative email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(nextUrl);
        router.refresh();
      }, 400);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="accent" size="sm" showDot>
            Restricted Access
          </Badge>
          <h1 className="text-2xl font-bold text-[#F5F7FB]">Chapter Administration</h1>
          <p className="text-xs text-[#A5AEC0]">
            Sign in to manage events, attendees, QR scanner, and chapter records.
          </p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-base">Sign In to Dashboard</CardTitle>
            <CardDescription>
              Authorized chapter administrator account only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Administrator Email"
                type="email"
                placeholder="admin@dpgu.acm.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Master Password"
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {error && (
                <div role="alert" className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access granted! Redirecting to dashboard...</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-[11px] text-[#A5AEC0]/70 border-t border-[#252D3D]">
            <div className="flex items-center gap-1.5 justify-center text-[#F59E0B]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Public registration is closed. All login attempts are audited.</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
