import * as React from "react";
import Link from "next/link";
import { Terminal, MessageSquare, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#252D3D] bg-[#080B12] text-[#A5AEC0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Chapter Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#101522] border border-[#252D3D] flex items-center justify-center text-[#648CFF]">
                <Terminal className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#F5F7FB]">
                DPGU <span className="text-[#648CFF]">ACM</span>
              </span>
            </div>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              Official ACM Student Chapter at DPG University, Gurugram.
              Advancing computing as a science and a profession.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chapter GitHub Organization"
                className="w-8 h-8 rounded-lg bg-[#101522] border border-[#252D3D] flex items-center justify-center text-[#A5AEC0] hover:text-[#648CFF] hover:border-[#648CFF]/50 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chapter LinkedIn Page"
                className="w-8 h-8 rounded-lg bg-[#101522] border border-[#252D3D] flex items-center justify-center text-[#A5AEC0] hover:text-[#648CFF] hover:border-[#648CFF]/50 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chapter Discord Community"
                className="w-8 h-8 rounded-lg bg-[#101522] border border-[#252D3D] flex items-center justify-center text-[#A5AEC0] hover:text-[#648CFF] hover:border-[#648CFF]/50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F7FB]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#F5F7FB] transition-colors">
                  About Chapter
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#F5F7FB] transition-colors">
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#F5F7FB] transition-colors">
                  Executive Committee
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#F5F7FB] transition-colors">
                  Photo Archive
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5F7FB] transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F7FB]">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://dl.acm.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#F5F7FB] transition-colors"
                >
                  <span>ACM Digital Library</span>
                  <Globe className="w-3 h-3 text-[#A5AEC0]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.acm.org/about-acm/acm-code-of-ethics-and-professional-conduct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#F5F7FB] transition-colors"
                >
                  <span>Code of Ethics</span>
                  <Globe className="w-3 h-3 text-[#A5AEC0]" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5F7FB] transition-colors">
                  Join Student Chapter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F7FB]">
              Headquarters
            </h4>
            <p className="text-xs text-[#A5AEC0] leading-relaxed">
              DPG University
              <br />
              Sector 34, Gurugram
              <br />
              Haryana 122001, India
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101522] border border-[#252D3D] text-[11px] font-mono text-[#648CFF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                ACM Active Chapter
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accessibility */}
        <div className="pt-8 border-t border-[#252D3D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 DPGU ACM Student Chapter. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="text-[#A5AEC0]/70 hover:text-[#F5F7FB] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#252D3D]">•</span>
            <Link href="/terms" className="text-[#A5AEC0]/70 hover:text-[#F5F7FB] transition-colors">
              Terms & Conduct
            </Link>
            <span className="text-[#252D3D]">•</span>
            <Link href="/admin" className="text-[#A5AEC0]/70 hover:text-[#F5F7FB] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
