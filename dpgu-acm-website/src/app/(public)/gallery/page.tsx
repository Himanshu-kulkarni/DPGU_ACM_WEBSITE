"use client";

import * as React from "react";
import { getAllPhotos } from "@/data/gallery";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Camera, MapPin, Filter } from "lucide-react";

export default function GalleryPage() {
  const allPhotos = React.useMemo(() => getAllPhotos(), []);
  const [selectedAlbum, setSelectedAlbum] = React.useState<string>("All");

  const albums = ["All", "Hackathons", "Workshops", "Ceremonies", "Competitions"];

  const filteredPhotos = React.useMemo(() => {
    if (selectedAlbum === "All") return allPhotos;
    return allPhotos.filter((p) => p.album === selectedAlbum);
  }, [allPhotos, selectedAlbum]);

  return (
    <div className="space-y-12 py-4 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm" showDot>
            Chapter Media & Life
          </Badge>
          <Badge variant="neutral" size="sm">
            {allPhotos.length} Documented Events
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Event Photographs & Visual Archive
        </h1>
        <p className="text-base text-[#A5AEC0] max-w-3xl leading-relaxed">
          Documenting hackathons, lab coding sessions, campus tech talks, and annual
          ceremonies from the DPG University ACM Student Chapter.
        </p>
      </div>

      {/* Album Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#252D3D] pb-4">
        <span className="text-xs text-[#A5AEC0] mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filter Album:
        </span>
        {albums.map((album) => (
          <button
            key={album}
            type="button"
            onClick={() => setSelectedAlbum(album)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
              selectedAlbum === album
                ? "bg-[#648CFF]/15 text-[#648CFF] border-[#648CFF]/40 font-semibold"
                : "bg-[#101522] text-[#A5AEC0] border-[#252D3D] hover:border-[#3A4660] hover:text-[#F5F7FB]"
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Photo Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <Card
            key={photo.id}
            variant="surface"
            isInteractive
            className="overflow-hidden p-0 flex flex-col justify-between"
          >
            {/* Visual Frame */}
            <div className="relative aspect-video bg-[#080B12] border-b border-[#252D3D] flex flex-col items-center justify-center p-6 text-center group">
              <div className="w-12 h-12 rounded-full bg-[#171E2D] border border-[#252D3D] flex items-center justify-center text-[#648CFF] mb-2 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#A5AEC0] mt-1">
                [Chapter Event Photo]
              </span>
              <span className="text-[10px] text-[#A5AEC0]/60 font-mono mt-0.5">
                {photo.album} • {photo.venue}
              </span>
            </div>

            {/* Photo Metadata Card Body */}
            <div className="p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="neutral" size="sm">
                  {photo.album}
                </Badge>
                <span className="text-[11px] font-mono text-[#A5AEC0]">
                  {photo.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F5F7FB] leading-snug">
                {photo.title}
              </h3>

              <p className="text-xs text-[#A5AEC0] leading-relaxed">
                {photo.caption}
              </p>

              <div className="pt-2 border-t border-[#252D3D]/60 flex items-center gap-1.5 text-[11px] text-[#A5AEC0] font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#648CFF] shrink-0" />
                <span className="truncate">{photo.venue}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
