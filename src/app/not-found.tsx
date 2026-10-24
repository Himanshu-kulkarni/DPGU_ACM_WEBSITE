import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Home, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <Badge variant="neutral" size="md" className="font-mono">
            404 • Resource Not Found
          </Badge>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FB]">
            Page Not Found
          </h1>
          <p className="text-sm text-[#A5AEC0] leading-relaxed">
            The page you are looking for has been removed, renamed, or is no longer part
            of the public chapter website.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
          <Link href="/events" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Explore Events
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-[#252D3D]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#A5AEC0] hover:text-[#648CFF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>DPGU ACM Student Chapter</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
