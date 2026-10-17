import * as React from "react";
import { getCurrentAdminSession } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";
import { Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentAdminSession();

  const user = session
    ? {
        email: session.email,
        full_name: session.name,
        role: session.role,
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#080B12] text-[#F5F7FB]">
      <header className="border-b border-[#252D3D] bg-[#101522] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#080B12] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#F5F7FB]">DPGU ACM</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#171E2D] border border-[#252D3D] text-[#A5AEC0] font-mono">
              Admin Console
            </span>
          </div>
        </div>

        <div className="text-xs text-[#A5AEC0] font-mono hidden md:block">
          ACM Chapter Operations Subsystem
        </div>
      </header>

      {/* Admin Subnav */}
      <AdminNav user={user} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-[#252D3D] bg-[#080B12] px-4 py-4 text-center text-xs text-[#A5AEC0]/60 font-mono">
        DPGU ACM Chapter Administration • Secured via PBKDF2 & HMAC-SHA256
      </footer>
    </div>
  );
}
