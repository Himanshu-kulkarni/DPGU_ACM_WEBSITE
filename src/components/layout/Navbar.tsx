"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS } from "@/types/navigation";
import { Button } from "@/components/ui/Button";
import { Menu, X, Terminal, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close mobile drawer on route transition during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Prevent background scrolling when mobile drawer is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#252D3D] bg-[#080B12]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#648CFF]"
          aria-label="DPGU ACM Student Chapter Home"
        >
          <div className="w-9 h-9 rounded-lg bg-[#101522] border border-[#252D3D] flex items-center justify-center text-[#648CFF] group-hover:border-[#648CFF]/50 transition-colors">
            <Terminal className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[#F5F7FB] flex items-center gap-1.5">
              DPGU <span className="text-[#648CFF]">ACM</span>
            </span>
            <span className="text-[10px] text-[#A5AEC0] uppercase tracking-wider font-mono">
              Student Chapter
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Main Navigation"
        >
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#648CFF]",
                  isActive
                    ? "text-[#648CFF] bg-[#171E2D] border border-[#252D3D]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB] hover:bg-[#101522]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden sm:inline-flex">
            <Button size="sm" variant="primary" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              Join Chapter
            </Button>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#A5AEC0] hover:text-[#F5F7FB] hover:bg-[#101522] border border-[#252D3D] focus-visible:outline-2 focus-visible:outline-[#648CFF]"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden fixed inset-x-0 top-18 bottom-0 z-50 bg-[#080B12]/95 backdrop-blur-lg border-b border-[#252D3D] flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <nav className="flex flex-col space-y-2 mb-8" aria-label="Mobile Navigation">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive
                      ? "bg-[#171E2D] text-[#648CFF] border border-[#252D3D]"
                      : "text-[#A5AEC0] hover:text-[#F5F7FB] hover:bg-[#101522]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#648CFF]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-[#252D3D]">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block"
            >
              <Button size="lg" variant="primary" className="w-full justify-center">
                Join Chapter
              </Button>
            </Link>
            <p className="text-center text-xs text-[#A5AEC0] mt-4 font-mono">
              DPG University • Gurugram, India
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
