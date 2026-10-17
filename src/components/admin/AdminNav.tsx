"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  UserCheck,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

interface AdminNavProps {
  user?: {
    email: string;
    full_name: string;
    role: string;
  } | null;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/registrations", label: "Registrations", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/attendance", label: "Attendance", icon: QrCode },
  { href: "/admin/team", label: "Team", icon: UserCheck },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/reports", label: "Reports & CSV", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Do not render full navigation on the login screen
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="border-b border-[#252D3D] bg-[#101522]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with Admin Identity and Controls */}
        <div className="flex items-center justify-between h-14 border-b border-[#252D3D]/50 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[#A5AEC0]">
              Console: <span className="text-[#648CFF] font-medium">DPGU ACM Studio</span>
            </span>
            {user && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#171E2D] border border-[#252D3D] text-[#A5AEC0] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {user.email} ({user.role})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[#A5AEC0] hover:text-[#F5F7FB] transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171E2D] hover:bg-[#EF4444]/10 hover:text-[#EF4444] text-[#A5AEC0] border border-[#252D3D] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none text-xs font-medium">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#648CFF]/15 text-[#648CFF] border border-[#648CFF]/30 font-semibold"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB] hover:bg-[#171E2D]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#648CFF]" : "text-[#A5AEC0]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
