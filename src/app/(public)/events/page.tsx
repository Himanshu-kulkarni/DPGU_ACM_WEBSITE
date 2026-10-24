"use client";

import * as React from "react";
import Link from "next/link";
import { getAllEvents, isEventUpcoming } from "@/data/events";
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
  CheckCircle2,
  AlertCircle,
  History,
  Sparkles,
} from "lucide-react";

export default function EventsPage() {
  const allEvents = React.useMemo(() => getAllEvents(), []);

  // Filter States
  const [activeTab, setActiveTab] = React.useState<"UPCOMING" | "PAST" | "ALL">("UPCOMING");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedPricing, setSelectedPricing] = React.useState<"ALL" | "FREE" | "PAID">("ALL");

  // Dynamic Date-Based Categorization
  const categorizedEvents = React.useMemo(() => {
    const upcoming = allEvents.filter((evt) => isEventUpcoming(evt));
    const past = allEvents.filter((evt) => !isEventUpcoming(evt));
    return { upcoming, past, all: allEvents };
  }, [allEvents]);

  // Filtering Logic
  const filteredEvents = React.useMemo(() => {
    // 1. Filter by Tab (Upcoming vs Past vs All)
    let list =
      activeTab === "UPCOMING"
        ? categorizedEvents.upcoming
        : activeTab === "PAST"
        ? categorizedEvents.past
        : categorizedEvents.all;

    // 2. Filter by search query
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      list = list.filter(
        (evt) =>
          evt.title.toLowerCase().includes(query) ||
          evt.subtitle.toLowerCase().includes(query) ||
          evt.venue.toLowerCase().includes(query) ||
          evt.category.toLowerCase().includes(query)
      );
    }

    // 3. Filter by category
    if (selectedCategory !== "All") {
      list = list.filter((evt) => evt.category === selectedCategory);
    }

    // 4. Filter by pricing
    if (selectedPricing !== "ALL") {
      list = list.filter((evt) => evt.eventType === selectedPricing);
    }

    return list;
  }, [activeTab, categorizedEvents, searchQuery, selectedCategory, selectedPricing]);

  const categories = ["All", "Workshops", "Hackathons", "Tech Talks", "Bootcamps"];

  // Helper to calculate registration status for upcoming events
  const getEventRegistrationMeta = (evt: (typeof allEvents)[0]) => {
    const now = new Date();
    const deadline = new Date(evt.registrationDeadline);
    const spotsRemaining = Math.max(0, evt.capacity - evt.registeredCount);
    const isSoldOut = spotsRemaining === 0;
    const isDeadlinePassed = now.getTime() > deadline.getTime();
    return {
      spotsRemaining,
      isSoldOut,
      isDeadlinePassed,
      canRegister: !isSoldOut && !isDeadlinePassed && evt.status !== "PAST",
    };
  };

  const formatDateRange = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const sameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    if (sameDay) {
      return start.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} – ${endStr}`;
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent" size="sm" showDot>
            Chapter Programs
          </Badge>
          <Badge variant="neutral" size="sm">
            {categorizedEvents.upcoming.length} Upcoming • {categorizedEvents.past.length} Completed
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F7FB]">
          Chapter Events & Workshops
        </h1>
        <p className="text-base text-[#A5AEC0] max-w-3xl leading-relaxed">
          Participate in premier student hackathons, intensive systems masterclasses, and
          technical talks. Public registration is open to all students with instant digital passes.
        </p>
      </div>

      {/* Segmented Control / Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#252D3D] pb-4">
        <div className="flex rounded-xl border border-[#252D3D] p-1.5 bg-[#080B12] text-sm font-medium w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("UPCOMING")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg transition-all ${
              activeTab === "UPCOMING"
                ? "bg-[#171E2D] text-[#648CFF] font-semibold border border-[#252D3D] shadow-sm"
                : "text-[#A5AEC0] hover:text-[#F5F7FB]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#648CFF]" />
            <span>Upcoming Events</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#101522] border border-[#252D3D] text-[#648CFF] font-mono">
              {categorizedEvents.upcoming.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PAST")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg transition-all ${
              activeTab === "PAST"
                ? "bg-[#171E2D] text-[#648CFF] font-semibold border border-[#252D3D] shadow-sm"
                : "text-[#A5AEC0] hover:text-[#F5F7FB]"
            }`}
          >
            <History className="w-4 h-4 text-[#A5AEC0]" />
            <span>Past Events & Recaps</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#101522] border border-[#252D3D] text-[#A5AEC0] font-mono">
              {categorizedEvents.past.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === "ALL"
                ? "bg-[#171E2D] text-[#648CFF] font-semibold border border-[#252D3D] shadow-sm"
                : "text-[#A5AEC0] hover:text-[#F5F7FB]"
            }`}
          >
            <span>All</span>
            <span className="text-xs text-[#A5AEC0] font-mono">({allEvents.length})</span>
          </button>
        </div>

        <div className="text-xs text-[#A5AEC0] self-end sm:self-center font-mono">
          Showing {filteredEvents.length} {activeTab === "UPCOMING" ? "upcoming" : activeTab === "PAST" ? "past" : ""} {filteredEvents.length === 1 ? "event" : "events"}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="surface" className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, topic, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Pricing Filter */}
          <div>
            <div className="flex rounded-lg border border-[#252D3D] p-1 bg-[#080B12] text-xs font-medium h-[42px] items-center">
              <button
                type="button"
                onClick={() => setSelectedPricing("ALL")}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  selectedPricing === "ALL"
                    ? "bg-[#171E2D] text-[#648CFF]"
                    : "text-[#A5AEC0] hover:text-[#F5F7FB]"
                }`}
              >
                All Fees
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
                Free Only
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
                Paid Only
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
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#648CFF]/15 text-[#648CFF] border-[#648CFF]/40 font-semibold"
                  : "bg-[#101522] text-[#A5AEC0] border-[#252D3D] hover:border-[#3A4660] hover:text-[#F5F7FB]"
              }`}
            >
              {cat}
            </button>
          ))}
          {(searchQuery || selectedCategory !== "All" || selectedPricing !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
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
          title={
            activeTab === "UPCOMING"
              ? "No Upcoming Events Match Your Filters"
              : activeTab === "PAST"
              ? "No Past Events Match Your Filters"
              : "No Events Found"
          }
          description="We couldn't find any events matching your selected search query or category filters. Try adjusting your search keywords or switching tabs."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
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
            const isUpcoming = isEventUpcoming(evt);
            const isFree = evt.eventType === "FREE";
            const regMeta = getEventRegistrationMeta(evt);
            const dateRange = formatDateRange(evt.startTime, evt.endTime);
            const deadlineFormatted = new Date(evt.registrationDeadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Card
                key={evt.id}
                variant="surface"
                isInteractive
                className="flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Poster / Banner Header Mockup */}
                  <div className="relative -mx-6 -mt-6 mb-4 h-36 bg-gradient-to-r from-[#171E2D] to-[#101522] border-b border-[#252D3D] p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="neutral" size="sm" className="bg-[#080B12]/80 backdrop-blur-sm">
                        {evt.category}
                      </Badge>
                      <Badge
                        variant={isUpcoming ? "accent" : "neutral"}
                        size="sm"
                        showDot={isUpcoming}
                        className="bg-[#080B12]/80 backdrop-blur-sm"
                      >
                        {isUpcoming ? "Upcoming" : "Past Event"}
                      </Badge>
                    </div>

                    <div className="flex items-end justify-between">
                      <span className="text-xs font-mono font-bold text-[#F5F7FB] bg-[#080B12]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#252D3D]">
                        {isFree ? "Free Admission" : `₹${evt.priceInr} INR`}
                      </span>

                      {/* Poster Category Accent Icon */}
                      <span className="text-[11px] font-mono text-[#A5AEC0]">
                        DPGU ACM Event
                      </span>
                    </div>
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
                  <div className="space-y-2 text-xs text-[#A5AEC0] bg-[#080B12] p-3.5 rounded-xl border border-[#252D3D]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#648CFF] shrink-0" />
                      <span className="font-medium text-[#F5F7FB]">{dateRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#648CFF] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    {isUpcoming ? (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#252D3D]/60 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#A5AEC0]" />
                          <span>Deadline: {deadlineFormatted}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <Users className="w-3.5 h-3.5 text-[#A5AEC0]" />
                          <span>
                            {regMeta.isSoldOut
                              ? "Sold Out"
                              : `${regMeta.spotsRemaining} spots left`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#252D3D]/60 text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#10B981]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Event Completed</span>
                        </div>
                        <span className="font-mono text-[#A5AEC0]">
                          {evt.registeredCount} Attendees
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Registration Status Indicator */}
                  {isUpcoming && (
                    <div className="mt-3">
                      {regMeta.isSoldOut ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-1.5 rounded-lg">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Capacity Reached — Registration is closed for this event.</span>
                        </div>
                      ) : regMeta.isDeadlinePassed ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-1.5 rounded-lg">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Registration has closed (Deadline passed).</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Registration is open • Instant digital QR pass.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <CardFooter className="px-0 pb-0 pt-4 border-t border-[#252D3D]/60 flex items-center justify-between mt-4">
                  {isUpcoming ? (
                    regMeta.canRegister ? (
                      <Link href={`/events/${evt.slug}`} className="w-full">
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full justify-center"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          {isFree ? "Register Free Pass" : `Register & Pay ₹${evt.priceInr}`}
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
                          {regMeta.isSoldOut
                            ? "View Event Details (Sold Out)"
                            : "View Event Details (Registration Closed)"}
                        </Button>
                      </Link>
                    )
                  ) : (
                    /* Past Event: NEVER show registration button. Show Event Details / Recap link */
                    <Link href={`/events/${evt.slug}`} className="w-full">
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full justify-center"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        View Event Details & Recap
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
