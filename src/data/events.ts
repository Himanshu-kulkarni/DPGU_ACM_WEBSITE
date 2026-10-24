export interface EventAgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface EventSpeaker {
  name: string;
  role: string;
  organization: string;
  bio?: string;
  avatarUrl?: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface ChapterEventDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: "Workshops" | "Hackathons" | "Tech Talks" | "Coding Contests" | "Bootcamps";
  bannerUrl: string;
  eventType: "FREE" | "PAID";
  priceInr: number;
  capacity: number;
  registeredCount: number;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  registrationDeadline: string; // ISO 8601
  venue: string;
  isOnline: boolean;
  meetingLink?: string;
  status: "UPCOMING" | "PAST" | "COMPLETED";
  isFeatured?: boolean;
  isPlaceholderData: boolean; // Flag to indicate template vs official announcement
  agenda: EventAgendaItem[];
  prerequisites: string[];
  speakers: EventSpeaker[];
  faqs: EventFAQ[];
}

export const CHAPTER_EVENTS: ChapterEventDetail[] = [
  {
    id: "evt-001",
    slug: "codematrix-2026",
    title: "CodeMatrix 2026: Annual Chapter Hackathon",
    subtitle: "36-Hour National Student Hackathon across AI, Web3, and Systems",
    description: `CodeMatrix 2026 is the flagship annual software hackathon hosted by the DPGU ACM Student Chapter. Over 36 continuous hours, teams of student developers, designers, and researchers will collaborate to build innovative solutions solving real-world challenges in healthcare, sustainable energy, autonomous robotics, and accessible developer tooling.

Participants will have access to industry mentors, hands-on cloud credits, and judging from engineering leaders. Prizes, certificates, and potential incubator sponsorships will be awarded to top podium finishes.`,
    category: "Hackathons",
    bannerUrl: "/images/events/hackathon.webp",
    eventType: "FREE",
    priceInr: 0,
    capacity: 120,
    registeredCount: 84,
    startTime: "2026-11-14T09:00:00+05:30",
    endTime: "2026-11-15T21:00:00+05:30",
    registrationDeadline: "2026-11-10T23:59:00+05:30",
    venue: "Main Auditorium & Computing Labs, DPG University",
    isOnline: false,
    status: "UPCOMING",
    isFeatured: true,
    isPlaceholderData: true,
    agenda: [
      { time: "Day 1 - 09:00 AM", title: "Registration & Breakfast", description: "Badge pickup, swags collection, and team desk allocation." },
      { time: "Day 1 - 10:30 AM", title: "Opening Ceremony & Problem Statements", description: "Welcome address by chapter chair and revelation of challenge tracks." },
      { time: "Day 1 - 12:00 PM", title: "Hacking Commences", description: "Teams begin sprint 1; mentor office hours open." },
      { time: "Day 1 - 08:00 PM", title: "Mid-Way Progress Review", description: "Milestone architecture check-in with technical judges." },
      { time: "Day 2 - 09:00 AM", title: "Final Sprint & Testing", description: "Preparing deployment demos and code submissions." },
      { time: "Day 2 - 03:00 PM", title: "Judging & Project Presentations", description: "Podium finalists demonstrate live applications to jury." },
      { time: "Day 2 - 07:00 PM", title: "Award Ceremony & Closing", description: "Prize distribution, certificates, and keynote." }
    ],
    prerequisites: [
      "Bring your own laptop and charging hardware",
      "Team size: 2 to 4 members (Individual entries will be matched during mixer)",
      "Basic proficiency in any programming language (JavaScript/TypeScript, Python, C++, etc.)",
      "Valid college ID card required at entry gate"
    ],
    speakers: [
      {
        name: "[Guest Keynote Speaker - Pending Official Confirmation]",
        role: "Principal Systems Architect",
        organization: "Tech Industry Partner",
        bio: "Specializing in distributed computing and large-scale cloud resilience."
      }
    ],
    faqs: [
      {
        question: "Is there any registration fee for CodeMatrix 2026?",
        answer: "No, participation in CodeMatrix 2026 is completely free of charge. Food, high-speed Wi-Fi, and mentor support are provided for all registered attendees."
      },
      {
        question: "Can beginners participate?",
        answer: "Absolutely! We encourage freshmen and beginners to join. There are dedicated workshops and mentors on-site to assist with git, APIs, and deployments."
      },
      {
        question: "Are external college students allowed?",
        answer: "Yes, students from any recognized university or polytechnic institution are welcome to register."
      }
    ]
  },
  {
    id: "evt-002",
    slug: "fullstack-nextjs-cloud-architectures",
    title: "Fullstack Next.js & Cloud Architectures",
    subtitle: "Hands-on masterclass in building modern serverless web applications",
    description: `A hands-on, intensive technical workshop focused on building production-grade fullstack web applications. Learn App Router fundamentals, Server Actions, PostgreSQL connection pooling via Supabase, and automated deployment pipelines with zero configuration.

By the end of this 5-hour lab, attendees will build and deploy a live database-backed event application.`,
    category: "Workshops",
    bannerUrl: "/images/events/workshop.webp",
    eventType: "FREE",
    priceInr: 0,
    capacity: 60,
    registeredCount: 48,
    startTime: "2026-10-28T10:00:00+05:30",
    endTime: "2026-10-28T16:00:00+05:30",
    registrationDeadline: "2026-10-27T18:00:00+05:30",
    venue: "Advanced Computing Lab 304, DPG University",
    isOnline: false,
    status: "UPCOMING",
    isFeatured: false,
    isPlaceholderData: true,
    agenda: [
      { time: "10:00 AM", title: "Next.js App Router & React 19 Paradigms", description: "Deep dive into Server vs Client Components and hydration." },
      { time: "11:30 AM", title: "Supabase Relational Data Modeling", description: "Hands-on PostgreSQL schema creation, RLS, and queries." },
      { time: "01:00 PM", title: "Lunch & Networking Break", description: "Informal discussions and Q&A with chapter leads." },
      { time: "02:00 PM", title: "Authentication & Security Architecture", description: "JWT session handling and protecting API routes." },
      { time: "03:30 PM", title: "Production Deployment & CDN Tuning", description: "Live edge deployment and performance audits." }
    ],
    prerequisites: [
      "Laptop with Node.js 20+ and VS Code installed",
      "Basic familiarity with HTML, CSS, and modern JavaScript",
      "GitHub account for live repository deployments"
    ],
    speakers: [
      {
        name: "[Chapter Technical Lead - Pending Member Verification]",
        role: "Web & Systems Domain Lead",
        organization: "DPGU ACM Student Chapter",
        bio: "Full-stack engineer passionate about modern web standards and developer tooling."
      }
    ],
    faqs: [
      {
        question: "Will certificates be provided?",
        answer: "Yes, verified digital participation certificates will be issued to attendees who complete the hands-on lab."
      }
    ]
  },
  {
    id: "evt-003",
    slug: "ai-robotics-hardware-summit",
    title: "AI & Embedded Systems Summit 2026",
    subtitle: "Edge AI inference, ROS2 robotics, and hardware prototyping",
    description: `A specialized hands-on summit bridging embedded systems and machine learning. Explore deploying quantized neural networks on edge microcontrollers (ESP32 / Raspberry Pi), robot perception with ROS2, and sensor fusion for autonomous mobile robots.`,
    category: "Workshops",
    bannerUrl: "/images/events/robotics.webp",
    eventType: "PAID",
    priceInr: 199,
    capacity: 40,
    registeredCount: 29,
    startTime: "2026-11-28T10:00:00+05:30",
    endTime: "2026-11-28T17:00:00+05:30",
    registrationDeadline: "2026-11-25T23:59:00+05:30",
    venue: "Robotics & IoT Innovation Lab, DPG University",
    isOnline: false,
    status: "UPCOMING",
    isFeatured: false,
    isPlaceholderData: true,
    agenda: [
      { time: "10:00 AM", title: "Edge AI Concepts & MicroPython Setup", description: "Overview of tinyML and embedded neural compute." },
      { time: "12:00 PM", title: "Sensor Interfacing & Telemetry", description: "I2C/SPI sensor acquisition and real-time visualization." },
      { time: "02:00 PM", title: "ROS2 Autonomous Navigation Lab", description: "Simulated SLAM mapping and path planning." }
    ],
    prerequisites: [
      "Basic understanding of C/C++ or Python",
      "Interest in hardware and robotics"
    ],
    speakers: [
      {
        name: "[Guest Robotics Specialist - Pending Official Announcement]",
        role: "Embedded Systems Engineer",
        organization: "Robotics Industry Partner"
      }
    ],
    faqs: [
      {
        question: "What does the registration fee cover?",
        answer: "The ₹199 nominal charge covers the physical microcontroller component kit used during the workshop, printed lab workbook, and refreshments."
      }
    ]
  },
  {
    id: "evt-004",
    slug: "competitive-programming-bootcamp",
    title: "Algorithms & ICPC Preparation Bootcamp",
    subtitle: "Advanced data structures, dynamic programming, and contest strategies",
    description: `A 4-week structured training bootcamp designed for students aiming for ICPC regional rounds, Google Code Jam, and technical interviews at top-tier software companies. Covering graph algorithms, segment trees, DP with bitmasks, and complexity optimization.`,
    category: "Bootcamps",
    bannerUrl: "/images/events/algo.webp",
    eventType: "FREE",
    priceInr: 0,
    capacity: 75,
    registeredCount: 56,
    startTime: "2026-12-05T14:00:00+05:30",
    endTime: "2026-12-05T17:00:00+05:30",
    registrationDeadline: "2026-12-03T23:59:00+05:30",
    venue: "Online Webinar / Codeforces Virtual Arena",
    isOnline: true,
    meetingLink: "https://meet.google.com/placeholder-dpgu-acm",
    status: "UPCOMING",
    isFeatured: false,
    isPlaceholderData: true,
    agenda: [
      { time: "02:00 PM", title: "Session 1: Advanced Graph Theory", description: "Dijkstra, Bellman-Ford, and Minimum Spanning Trees." },
      { time: "03:30 PM", title: "Live Contest Walkthrough", description: "Speed problem-solving on past ICPC regional problems." }
    ],
    prerequisites: [
      "Proficiency in C++ (STL) or Java",
      "Active Codeforces or LeetCode account"
    ],
    speakers: [
      {
        name: "[Competitive Programming Lead - Pending Member Verification]",
        role: "Algorithms SIG Lead",
        organization: "DPGU ACM Chapter"
      }
    ],
    faqs: [
      {
        question: "Is this bootcamp entirely virtual?",
        answer: "Yes, this bootcamp will be conducted virtually with live contests hosted on Codeforces."
      }
    ]
  },
  {
    id: "evt-005",
    slug: "intro-to-quantum-computing",
    title: "Introduction to Quantum Computing & Qiskit",
    subtitle: "Qubits, quantum superposition, and entanglement fundamentals",
    description: `A foundational seminar examining quantum computing principles, physical qubit architectures, and writing quantum circuits using IBM's open-source Qiskit SDK.`,
    category: "Tech Talks",
    bannerUrl: "/images/events/quantum.webp",
    eventType: "FREE",
    priceInr: 0,
    capacity: 100,
    registeredCount: 92,
    startTime: "2026-09-12T11:00:00+05:30",
    endTime: "2026-09-12T13:30:00+05:30",
    registrationDeadline: "2026-09-11T20:00:00+05:30",
    venue: "Auditorium Hall B, DPG University",
    isOnline: false,
    status: "PAST",
    isFeatured: false,
    isPlaceholderData: true,
    agenda: [
      { time: "11:00 AM", title: "Quantum Computing Principles", description: "Superposition, entanglement, and quantum gates." },
      { time: "12:15 PM", title: "Qiskit Hands-on Notebook", description: "Simulating Bell state and quantum teleportation algorithm." }
    ],
    prerequisites: ["Basic linear algebra and Python"],
    speakers: [
      {
        name: "[Guest Quantum Researcher - Archived Speaker Record]",
        role: "Quantum Computing Fellow",
        organization: "Research Consortium"
      }
    ],
    faqs: [
      {
        question: "Are recordings and slides available?",
        answer: "Yes, past event slides and Qiskit Jupyter notebooks are archived in the chapter GitHub organization."
      }
    ]
  }
];

// Helper queries
export function getAllEvents(): ChapterEventDetail[] {
  return CHAPTER_EVENTS;
}

export function isEventUpcoming(event: { startTime: string; endTime?: string; status: string }): boolean {
  if (event.status === "COMPLETED" || event.status === "PAST" || event.status === "CANCELLED" || event.status === "ARCHIVED") {
    return false;
  }
  const now = new Date();
  const endDateTime = event.endTime ? new Date(event.endTime) : new Date(event.startTime);
  return endDateTime.getTime() >= now.getTime();
}

export function getUpcomingEvents(): ChapterEventDetail[] {
  return CHAPTER_EVENTS.filter((e) => isEventUpcoming(e));
}

export function getPastEvents(): ChapterEventDetail[] {
  return CHAPTER_EVENTS.filter((e) => !isEventUpcoming(e));
}

export function getFeaturedEvent(): ChapterEventDetail | undefined {
  return CHAPTER_EVENTS.find((e) => e.isFeatured) || CHAPTER_EVENTS[0];
}

export function getEventBySlug(slug: string): ChapterEventDetail | undefined {
  return CHAPTER_EVENTS.find((e) => e.slug === slug);
}
