export interface StudentProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: "Web & Cloud" | "AI & Machine Learning" | "Embedded & IoT" | "Systems & Tools";
  tags: string[];
  teamName: string;
  repoUrl?: string;
  demoUrl?: string;
  isFeatured: boolean;
  status: "ACTIVE" | "COMPLETED" | "PROTOTYPE";
  isPlaceholder: boolean;
}

export interface ChapterAchievement {
  id: string;
  title: string;
  category: "Hackathon" | "Contest" | "Research" | "Honor";
  eventName: string;
  organizer: string;
  rankBadge: string;
  year: string;
  description: string;
  teamMembersPlaceholder: string;
  isPlaceholder: boolean;
}

export const STUDENT_PROJECTS: StudentProject[] = [
  {
    id: "proj-001",
    slug: "autonomous-campus-navigator",
    title: "CampusPath: Autonomous Indoor Navigator",
    summary: "Accessible indoor navigation system with real-time route optimization for university buildings.",
    description: "Built by student developers in the AI & Systems SIG, CampusPath utilizes BLE beacons and graph routing algorithms to provide accessible, turn-by-turn indoor directions across DPG University campus blocks.",
    category: "AI & Machine Learning",
    tags: ["Next.js", "Python", "ROS2", "Graph Algorithms", "BLE"],
    teamName: "Team DevGuild (DPGU ACM)",
    repoUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
    isFeatured: true,
    status: "ACTIVE",
    isPlaceholder: true
  },
  {
    id: "proj-002",
    slug: "iot-attendance-edge-node",
    title: "Smart Attendance Edge Node",
    summary: "Hardware IoT scanner using ESP32 and optical QR validation with offline SQLite syncing.",
    description: "An embedded hardware prototype built for high-throughput event check-in. Validates cryptographic HMAC tokens locally without requiring continuous cloud connectivity, syncing logs when reconnected.",
    category: "Embedded & IoT",
    tags: ["ESP32", "C++", "FreeRTOS", "MQTT", "Supabase"],
    teamName: "Hardware & IoT SIG",
    repoUrl: "https://github.com",
    isFeatured: true,
    status: "COMPLETED",
    isPlaceholder: true
  },
  {
    id: "proj-003",
    slug: "collegiate-code-judge",
    title: "CodeSphere: Sandboxed Contest Runner",
    summary: "Lightweight algorithmic execution sandbox with memory and time caps for coding competitions.",
    description: "A secure online code execution engine leveraging Docker containers and Linux cgroups to evaluate student C++, Python, and Java submissions against automated test cases with millisecond precision.",
    category: "Systems & Tools",
    tags: ["Go", "Docker", "Linux cgroups", "gRPC", "PostgreSQL"],
    teamName: "Systems Engineering Group",
    repoUrl: "https://github.com",
    isFeatured: false,
    status: "ACTIVE",
    isPlaceholder: true
  },
  {
    id: "proj-004",
    slug: "dpgu-acm-official-portal",
    title: "Official Chapter Web Platform",
    summary: "Fullstack event ticketing, QR pass generation, and administrative portal built with Next.js 16.",
    description: "The core digital infrastructure powering this website. Implements frictionless public registrations, cryptographic ticket tokens, in-browser mobile camera attendance scanning, and single-admin operational tools.",
    category: "Web & Cloud",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Zod"],
    teamName: "Webmaster Directorate",
    repoUrl: "https://github.com",
    isFeatured: true,
    status: "ACTIVE",
    isPlaceholder: false
  }
];

export const CHAPTER_ACHIEVEMENTS: ChapterAchievement[] = [
  {
    id: "ach-001",
    title: "Smart India Hackathon Finalist",
    category: "Hackathon",
    eventName: "Smart India Hackathon (SIH)",
    organizer: "Ministry of Education & AICTE",
    rankBadge: "National Finalist",
    year: "2025–2026",
    description: "Selected among thousands of collegiate teams for developing an automated telemetry prediction node for rural electrical distribution systems.",
    teamMembersPlaceholder: "[Student Team Leads — Pending Chapter Verification]",
    isPlaceholder: true
  },
  {
    id: "ach-002",
    title: "ICPC Regional Contest Qualification",
    category: "Contest",
    eventName: "ACM ICPC Asia Regional Round",
    organizer: "ICPC Foundation & Host University",
    rankBadge: "Regional Rank Tier",
    year: "2025",
    description: "Chapter competitive programming team solved complex algorithmic challenges during the preliminary round to secure regional qualification.",
    teamMembersPlaceholder: "[Algorithms Squad — Pending Chapter Verification]",
    isPlaceholder: true
  },
  {
    id: "ach-003",
    title: "1st Place — Inter-University Hackfest",
    category: "Hackathon",
    eventName: "Haryana State Student Hackathon",
    organizer: "State Technical Consortium",
    rankBadge: "1st Place Winner (Gold)",
    year: "2025",
    description: "Awarded top podium position for an edge AI acoustic monitoring prototype detecting mechanical bearing failures in industrial turbines.",
    teamMembersPlaceholder: "[Student Team — Pending Chapter Verification]",
    isPlaceholder: true
  },
  {
    id: "ach-004",
    title: "Student Research Paper Publication",
    category: "Research",
    eventName: "International Computing Conference",
    organizer: "IEEE / ACM Conference Series",
    rankBadge: "Peer-Reviewed Paper",
    year: "2026",
    description: "Authored peer-reviewed paper on lightweight consensus protocols for resource-constrained edge sensor microcontrollers.",
    teamMembersPlaceholder: "[Student Authors & Faculty Advisor — Pending Verification]",
    isPlaceholder: true
  }
];

export function getAllProjects(): StudentProject[] {
  return STUDENT_PROJECTS;
}

export function getAllAchievements(): ChapterAchievement[] {
  return CHAPTER_ACHIEVEMENTS;
}
