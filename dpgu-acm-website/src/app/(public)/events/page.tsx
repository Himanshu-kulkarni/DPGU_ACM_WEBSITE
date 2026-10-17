"use client";

import * as React from "react";
import Link from "next/link";
import { getAllEvents } from "@/data/events";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Users,
} from "lucide-react";

export default function EventsPage() {
  const allEvents = React.useMemo(() => getAllEvents(), []);

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [selectedPricing, setSelectedPricing] = React.useState<"ALL" | "FREE" | "PAID">("ALL");

  // Filtering Logic
  const filteredEvents = React.useMemo(() => {
    return allEvents.filter((evt) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        evt.title.toLowerCase().includes(query) ||
        evt.subtitle.toLowerCase().includes(query) ||
        evt.venue.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === "All" || evt.category === selectedCategory;

      // Status match
      const matchesStatus =
        selectedStatus === "ALL" || evt.status === selectedStatus;

      // Pricing match
      const matchesPricing =
        selectedPricing === "ALL" || evt.eventType === selectedPricing;

      return matchesSearch && matchesCategory && matchesStatus && matchesPricing;
    });
  }, [allEvents, searchQuery, selectedCategory, selectedStatus, selectedPricing]);

  const categories = ["All", "Workshops", "Hackathons", "Tech Talks", "Bootcamps"];

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm" showDot>
            Events & Workshops
          </Badge>
          <Badge variant="neutral" size="sm">
            {allEvents.length} Total Events
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FB]">
          Chapter Events & Registrations
        </h1>
        <p className="text-base text-[#A5AEC0] max-w-3xl leading-relaxed">
          Participate in hands-on workshops, hackathons, and technical bootcamps.
          Public registration is frictionless with instant digital QR passes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="surface" className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, topic, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Status Filter */}
          <div>
            <div className="flex rounded-lg border border-[#252D3D] p-1 bg-[#080B12] text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedStatus("ALL")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedStatus === "ALL"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                All ({allEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("UPCOMING")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedStatus === "UPCOMING"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("PAST")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedStatus === "PAST"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {/* Pricing Filter */}
          <div>
            <div className="flex rounded-lg border border-[#252D3D] p-1 bg-[#080B12] text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedPricing("ALL")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedPricing === "ALL"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                Any Fee
              </button>
              <button
                type="button"
                onClick={() => setSelectedPricing("FREE")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedPricing === "FREE"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setSelectedPricing("PAID")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedPricing === "PAID"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                Paid
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#252D3D]/60">
          <span className="text-xs text-[#A5AEC0] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedCategory === cat
                  ? "bg-[#648CFF]/15 text-[#648CFF] border-[#648CFF]/40 font-semibold"
                  : "bg-[#101522] text-[#A5AEC0] border-[#252D3D] hover:border-[#3A4660] hover:text-[#F5F7FB]"
              }`}
            >
              {cat}
            </button>
          ))}
          {(searchQuery || selectedCategory !== "All" || selectedStatus !== "ALL" || selectedPricing !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedStatus("ALL");
                setSelectedPricing("ALL");
              }}
              className="text-xs text-[#A5AEC0] hover:text-[#648CFF] underline ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Events Results Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No Matching Events Found"
          description="We couldn't find any events matching your selected filters or search terms. Try clearing search keywords or selecting another category."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedStatus("ALL");
                setSelectedPricing("ALL");
              }}
            >
              Clear All Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isFree = evt.eventType === "FREE";
            const spotsRemaining = Math.max(0, evt.capacity - evt.registeredCount);
            const isSoldOut = spotsRemaining === 0;
            const startDate = new Date(evt.startTime).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const deadlineDate = new Date(evt.registrationDeadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <Card
                key={evt.id}
                variant="surface"
                isInteractive
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Top Status & Pricing Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" size="sm">
                        {evt.category}
                      </Badge>
                      <Badge
                        variant={evt.status === "UPCOMING" ? "accent" : "neutral"}
                        size="sm"
                        showDot={evt.status === "UPCOMING"}
                      >
                        {evt.status}
                      </Badge>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold ${
                        isFree ? "text-[#10B981]" : "text-[#648CFF]"
                      }`}
                    >
                      {isFree ? "FREE ADMISSION" : `₹${evt.priceInr}`}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <CardTitle className="text-xl mb-2">
                    <Link
                      href={`/events/${evt.slug}`}
                      className="hover:text-[#648CFF] transition-colors"
                    >
                      {evt.title}
                    </Link>
                  </CardTitle>

                  <CardDescription className="line-clamp-2 mb-4">
                    {evt.subtitle}
                  </CardDescription>

                  {/* Metadata Specs */}
                  <div className="space-y-2 text-xs text-[#A5AEC0] bg-[#080B12] p-3 rounded-xl border border-[#252D3D]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#648CFF] shrink-0" />
                      <span>{startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#648CFF] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#252D3D]/60">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A5AEC0]" />
                        <span>Deadline: {deadlineDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Users className="w-3.5 h-3.5 text-[#A5AEC0]" />
                        <span>
                          {isSoldOut ? "Sold Out" : `${spotsRemaining} spots left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <CardFooter className="px-0 pb-0 pt-4 border-t border-[#252D3D]/60 flex items-center justify-between mt-4">
                  {evt.status === "UPCOMING" ? (
                    <Link href={`/events/${evt.slug}`} className="w-full">
                      <Button
                        variant={isSoldOut ? "secondary" : "primary"}
                        size="md"
                        disabled={isSoldOut}
                        className="w-full justify-center"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {isSoldOut
                          ? "Capacity Reached"
                          : isFree
                          ? "Register Free Pass"
                          : `Register & Pay ₹${evt.priceInr}`}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/events/${evt.slug}`} className="w-full">
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full justify-center"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        View Event Archive & Slides
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
