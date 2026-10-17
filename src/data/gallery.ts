export interface GalleryPhoto {
  id: string;
  title: string;
  album: "Hackathons" | "Workshops" | "Ceremonies" | "Competitions";
  date: string;
  venue: string;
  caption: string;
  isPlaceholder: boolean;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "gal-001",
    title: "CodeMatrix Hackathon: Midnight Sprint",
    album: "Hackathons",
    date: "November 2025",
    venue: "Main Auditorium, DPG University",
    caption: "Teams collaborating on distributed systems during the midnight sprint.",
    isPlaceholder: true
  },
  {
    id: "gal-002",
    title: "Cloud Architecture Masterclass in Session",
    album: "Workshops",
    date: "October 2025",
    venue: "Advanced Computing Lab 304",
    caption: "Hands-on lab demonstration of containerized services and database modeling.",
    isPlaceholder: true
  },
  {
    id: "gal-003",
    title: "Chapter Annual Inauguration Ceremony",
    album: "Ceremonies",
    date: "August 2025",
    venue: "DPG University Convention Hall",
    caption: "Faculty coordinator and executive committee lighting the inaugural lamp.",
    isPlaceholder: true
  },
  {
    id: "gal-004",
    title: "Algorithmic Speed Contest Arena",
    album: "Competitions",
    date: "September 2025",
    venue: "Computer Center Lab 302",
    caption: "Student programmers participating in the live 2-hour speed coding round.",
    isPlaceholder: true
  },
  {
    id: "gal-005",
    title: "Hardware Soldering & Edge AI Prototype",
    album: "Workshops",
    date: "December 2025",
    venue: "Robotics & Innovation Lab",
    caption: "Testing sensor telemetry data transmission on custom ESP32 breakout boards.",
    isPlaceholder: true
  },
  {
    id: "gal-006",
    title: "Hackathon Finalist Project Demonstration",
    album: "Hackathons",
    date: "November 2025",
    venue: "Auditorium Stage",
    caption: "Podium team presenting their decentralized storage engine to industry judges.",
    isPlaceholder: true
  }
];

export function getAllPhotos(): GalleryPhoto[] {
  return GALLERY_PHOTOS;
}
