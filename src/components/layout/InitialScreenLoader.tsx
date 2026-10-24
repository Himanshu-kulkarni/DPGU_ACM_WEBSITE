"use client";

import * as React from "react";
import Image from "next/image";

// In-memory module flag to guarantee zero reappearance during client-side navigation
let hasShownInSessionMemory = false;

function checkShouldShowLoader(): boolean {
  if (typeof window === "undefined") return false;
  if (hasShownInSessionMemory) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem("acm_dpgu_loader_shown") !== "true";
  } catch {
    return false;
  }
}

export function InitialScreenLoader() {
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [isVisible, setIsVisible] = React.useState(() => checkShouldShowLoader());
  const [isFadingOut, setIsFadingOut] = React.useState(false);

  React.useEffect(() => {
    if (!isVisible) return;

    hasShownInSessionMemory = true;
    try {
      sessionStorage.setItem("acm_dpgu_loader_shown", "true");
    } catch {
      // In private browsing mode or storage disabled, in-memory flag protects navigation
    }

    // Preload official logo image in browser cache
    const img = new window.Image();
    img.src = "/images/acm-dpgu-logo.jpeg";

    // Reveal website after initial interface is ready
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
      }, 700);
      return () => clearTimeout(exitTimer);
    }, 1400);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading DPGU ACM Student Chapter"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B12] select-none transition-opacity duration-700 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient Blue Halo Glow */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#648CFF]/15 blur-3xl pointer-events-none animate-pulse"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center space-y-6 px-4">
        {/* Official Logo with Subtle Blue Glow & Preserved Aspect Ratio */}
        <div
          className={`relative transition-all duration-700 ease-out transform ${
            isFadingOut ? "scale-95" : "scale-100"
          }`}
          style={{
            filter: "drop-shadow(0 0 32px rgba(100, 140, 255, 0.45))",
          }}
        >
          <Image
            src="/images/acm-dpgu-logo.jpeg"
            alt="DPGU ACM Student Chapter Logo"
            width={256}
            height={256}
            priority
            unoptimized
            className="w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain rounded-2xl"
          />
        </div>

        {/* Loading Indicator & Typography */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#648CFF] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#F5F7FB]">
              DPGU ACM Student Chapter
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-0.5 rounded-full bg-[#252D3D] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-transparent via-[#648CFF] to-transparent w-full animate-loader-progress" />
          </div>

          <span className="text-[11px] font-mono text-[#A5AEC0]/80">
            Advancing Computing as a Science & Profession
          </span>
        </div>
      </div>
    </div>
  );
}
