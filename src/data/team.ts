export interface ChapterOfficer {
  id: string;
  name: string;
  roleTitle: string;
  category: "FACULTY" | "EXECUTIVE" | "LEAD";
  namePlaceholder: string; // Provided for backwards compatibility with existing templates
  department: string;
  tenureYear: string;
  bio: string;
  responsibilities: string[];
  isVerified: boolean;
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  githubPlaceholder?: string;
  linkedinPlaceholder?: string;
}

export const FACULTY_COORDINATOR: ChapterOfficer = {
  id: "fac-001",
  name: "Dr. Rajesh Sharma",
  namePlaceholder: "Dr. Rajesh Sharma",
  roleTitle: "Faculty Sponsor & Chapter Coordinator",
  category: "FACULTY",
  department: "Department of Computer Science & Engineering, DPG University",
  tenureYear: "Academic Term 2026–2027",
  bio: "Directing faculty oversight, institutional liaison, and academic mentorship for the DPG University ACM Student Chapter. Guiding student engineers toward scientific rigor, ethical leadership, and innovation.",
  responsibilities: [
    "Academic sponsorship and institutional compliance with ACM International guidelines",
    "Advisory on technical symposia, research workshops, and hackathon venues",
    "Liaison between DPG University administration and student executive committee"
  ],
  isVerified: true,
  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  photoUrl: ""
};

export const EXECUTIVE_OFFICERS: ChapterOfficer[] = [
  {
    id: "off-001",
    name: "Aryan Verma",
    namePlaceholder: "Aryan Verma",
    roleTitle: "Chapter Chair (President)",
    category: "EXECUTIVE",
    department: "B.Tech CSE (4th Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Chief executive responsible for overall chapter governance, strategic vision, external partnerships, and general body assemblies.",
    responsibilities: [
      "Presiding over chapter executive meetings and general membership assemblies",
      "Representing the student chapter in ACM India and ACM International conventions",
      "Guiding domain leads and monitoring annual event execution"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  },
  {
    id: "off-002",
    name: "Ananya Sharma",
    namePlaceholder: "Ananya Sharma",
    roleTitle: "Vice Chair (Vice President)",
    category: "EXECUTIVE",
    department: "B.Tech CSE (3rd Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Assisting the Chair in strategic planning, inter-society collaborations, and operational logistics across technical domains.",
    responsibilities: [
      "Managing intra-chapter communications and special interest group coordination",
      "Overseeing event execution teams and venue management",
      "Acting on behalf of the Chair in official absence"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  },
  {
    id: "off-003",
    name: "Rohit Kumar",
    namePlaceholder: "Rohit Kumar",
    roleTitle: "General Secretary",
    category: "EXECUTIVE",
    department: "B.Tech IT (3rd Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Maintaining official chapter archives, correspondence with ACM India, meeting minutes, membership rosters, and university filings.",
    responsibilities: [
      "Recording and archiving proceedings of all official chapter meetings",
      "Maintaining official membership rolls and university communication records",
      "Managing event attendance certifications and verification documents"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  },
  {
    id: "off-004",
    name: "Neha Patel",
    namePlaceholder: "Neha Patel",
    roleTitle: "Treasurer (Finance Lead)",
    category: "EXECUTIVE",
    department: "B.Tech CSE (3rd Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Administering fiscal accounts, chapter sponsorships, workshop fee audits, event ticket reconciliation, and prize distributions.",
    responsibilities: [
      "Managing chapter financial accounts, event ledger, and balance sheets",
      "Preparing transparent financial statements for university review",
      "Coordinating sponsorship disbursements and hackathon prize distributions"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  },
  {
    id: "off-005",
    name: "Sneha Rao",
    namePlaceholder: "Sneha Rao",
    roleTitle: "Technical Lead & Webmaster",
    category: "LEAD",
    department: "B.Tech CSE (3rd Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Directing the engineering, security, and maintenance of the official DPGU ACM web application, registration engine, and server infrastructure.",
    responsibilities: [
      "Maintaining the Next.js App Router portal and Supabase database",
      "Ensuring uptime, mobile responsiveness, and zero credential exposure",
      "Directing student code reviews and repository pull requests"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  },
  {
    id: "off-006",
    name: "Vikram Malhotra",
    namePlaceholder: "Vikram Malhotra",
    roleTitle: "AI & Systems Research Lead",
    category: "LEAD",
    department: "B.Tech AI & Data Science (3rd Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Organizing machine learning reading groups, hands-on PyTorch workshops, edge computing experiments, and student research paper initiatives.",
    responsibilities: [
      "Directing technical workshops on neural architectures and cloud deployment",
      "Mentoring student hackathon teams on algorithmic innovation",
      "Reviewing chapter research manuscripts and preprints"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  },
  {
    id: "off-007",
    name: "Priya Singh",
    namePlaceholder: "Priya Singh",
    roleTitle: "Creative Design & Outreach Lead",
    category: "LEAD",
    department: "B.Tech CSE (2nd Year), DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Directing chapter visual aesthetics, event branding posters, stage backdrops, UI design tokens, social broadcasts, and attendee outreach.",
    responsibilities: [
      "Designing high-resolution banners, social creatives, and printed badges",
      "Maintaining the chapter design system and aesthetic standards",
      "Supervising event photography and after-movie visual production"
    ],
    isVerified: true,
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    photoUrl: ""
  }
];

export function getFacultyCoordinator(): ChapterOfficer {
  return FACULTY_COORDINATOR;
}

export function getAllOfficers(): ChapterOfficer[] {
  return [FACULTY_COORDINATOR, ...EXECUTIVE_OFFICERS];
}

export function getExecutiveLeadership(): ChapterOfficer[] {
  return [FACULTY_COORDINATOR, ...EXECUTIVE_OFFICERS.filter((o) => o.category === "EXECUTIVE")];
}
