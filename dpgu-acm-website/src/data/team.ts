export interface ChapterOfficer {
  id: string;
  roleTitle: string;
  category: "FACULTY" | "EXECUTIVE" | "LEAD";
  namePlaceholder: string;
  department: string;
  tenureYear: string;
  bio: string;
  responsibilities: string[];
  isVerified: boolean; // Set to true once verified by chapter lead
  githubPlaceholder?: string;
  linkedinPlaceholder?: string;
}

export const FACULTY_COORDINATOR: ChapterOfficer = {
  id: "fac-001",
  roleTitle: "Faculty Sponsor & Chapter Coordinator",
  category: "FACULTY",
  namePlaceholder: "[Prof. Faculty Coordinator Name — Pending Official Chapter Submission]",
  department: "Department of Computer Science & Engineering, DPG University",
  tenureYear: "Academic Term 2026–2027",
  bio: "Directing faculty oversight, institutional liaison, and academic mentorship for the DPG University ACM Student Chapter. Guiding student engineers toward scientific rigor, ethical leadership, and innovation.",
  responsibilities: [
    "Academic sponsorship and institutional compliance with ACM International guidelines",
    "Advisory on technical symposia, research workshops, and hackathon venues",
    "Liaison between DPG University administration and student executive committee"
  ],
  isVerified: false
};

export const EXECUTIVE_OFFICERS: ChapterOfficer[] = [
  {
    id: "off-001",
    roleTitle: "Chapter Chair (President)",
    category: "EXECUTIVE",
    namePlaceholder: "[Chapter Chair Name — Pending Official Member Verification]",
    department: "B.Tech CSE, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Chief executive responsible for overall chapter governance, strategic vision, external partnerships, and general body assemblies.",
    responsibilities: [
      "Presiding over chapter executive meetings and general membership assemblies",
      "Representing the student chapter in ACM India and ACM International conventions",
      "Guiding domain leads and monitoring annual event execution"
    ],
    isVerified: false
  },
  {
    id: "off-002",
    roleTitle: "Vice Chair (Vice President)",
    category: "EXECUTIVE",
    namePlaceholder: "[Vice Chair Name — Pending Official Member Verification]",
    department: "B.Tech CSE, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Assisting the Chair in strategic planning, inter-society collaborations, and operational logistics across technical domains.",
    responsibilities: [
      "Managing intra-chapter communications and special interest group coordination",
      "Overseeing event execution teams and venue management",
      "Acting on behalf of the Chair in official absence"
    ],
    isVerified: false
  },
  {
    id: "off-003",
    roleTitle: "General Secretary",
    category: "EXECUTIVE",
    namePlaceholder: "[General Secretary Name — Pending Official Member Verification]",
    department: "B.Tech CSE, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Maintaining official chapter archives, correspondence, meeting minutes, membership rosters, and formal university documentation.",
    responsibilities: [
      "Recording and archiving proceedings of all official chapter meetings",
      "Maintaining official membership rolls and university communication records",
      "Managing event attendance certifications and verification documents"
    ],
    isVerified: false
  },
  {
    id: "off-004",
    roleTitle: "Treasurer (Finance Officer)",
    category: "EXECUTIVE",
    namePlaceholder: "[Treasurer Name — Pending Official Member Verification]",
    department: "B.Tech CSE / IT, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Overseeing chapter finances, annual budgets, event ticket reconciliation, financial audits, and sponsor disbursements.",
    responsibilities: [
      "Managing chapter financial accounts, event ledger, and balance sheets",
      "Preparing transparent financial statements for university review",
      "Coordinating sponsorship disbursements and hackathon prize distributions"
    ],
    isVerified: false
  },
  {
    id: "off-005",
    roleTitle: "Lead Webmaster & Systems Architect",
    category: "LEAD",
    namePlaceholder: "[Webmaster Lead Name — Pending Official Member Verification]",
    department: "B.Tech CSE, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Directing the engineering, security, and maintenance of the official DPGU ACM web application, registration engine, and server infrastructure.",
    responsibilities: [
      "Maintaining the Next.js App Router portal and Supabase database",
      "Ensuring uptime, mobile responsiveness, and zero credential exposure",
      "Directing student code reviews and repository pull requests"
    ],
    isVerified: false
  },
  {
    id: "off-006",
    roleTitle: "Head of Events & Public Relations",
    category: "LEAD",
    namePlaceholder: "[PR & Events Lead Name — Pending Official Member Verification]",
    department: "B.Tech CSE, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Orchestrating event announcements, social media broadcasts, attendee helpdesk, and community outreach campaigns.",
    responsibilities: [
      "Promoting upcoming workshops across campus noticeboards and social channels",
      "Handling attendee inquiries and ticketing customer support",
      "Coordinating on-stage moderation and guest speaker hospitality"
    ],
    isVerified: false
  },
  {
    id: "off-007",
    roleTitle: "Creative Director (UI/UX & Media)",
    category: "LEAD",
    namePlaceholder: "[Design Lead Name — Pending Official Member Verification]",
    department: "B.Tech CSE, DPG University",
    tenureYear: "Term 2026–2027",
    bio: "Directing chapter visual aesthetics, event branding posters, stage backdrops, UI design tokens, and media production.",
    responsibilities: [
      "Designing high-resolution banners, social creatives, and printed badges",
      "Maintaining the chapter design system and aesthetic standards",
      "Supervising event photography and after-movie visual production"
    ],
    isVerified: false
  }
];

export function getFacultyCoordinator(): ChapterOfficer {
  return FACULTY_COORDINATOR;
}

export function getAllOfficers(): ChapterOfficer[] {
  return [FACULTY_COORDINATOR, ...EXECUTIVE_OFFICERS];
}
