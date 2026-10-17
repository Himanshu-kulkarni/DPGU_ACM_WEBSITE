export interface TechnicalDomain {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  leadPlaceholder: string;
  iconName: "Globe" | "Brain" | "Binary" | "Shield" | "Cpu" | "Palette";
  technologies: string[];
  keyInitiatives: string[];
  meetingSchedule: string;
}

export const TECHNICAL_DOMAINS: TechnicalDomain[] = [
  {
    id: "dom-web",
    slug: "web-cloud",
    title: "Web & Cloud Architecture",
    shortDescription: "Building resilient distributed systems, edge architectures, and high-performance fullstack web applications.",
    fullDescription: "The Web & Cloud Architecture domain focuses on building enterprise-grade, accessible, and highly scalable software. Members explore modern frontend frameworks, serverless runtimes, microservices, database tuning, and automated CI/CD infrastructure.",
    leadPlaceholder: "[Web Domain Lead - Pending Official Member Appointment]",
    iconName: "Globe",
    technologies: ["Next.js", "TypeScript", "React", "PostgreSQL", "Docker", "Go", "Tailwind CSS"],
    keyInitiatives: [
      "Official Chapter Portal engineering & maintenance",
      "Bi-weekly workshops on modern cloud paradigms",
      "Fullstack hackathon mentorship and architecture audits"
    ],
    meetingSchedule: "Every Tuesday • 04:30 PM (Lab 304)"
  },
  {
    id: "dom-ai",
    slug: "ai-ml",
    title: "Artificial Intelligence & ML",
    shortDescription: "Exploring neural architectures, computer vision, transformer models, and edge inference systems.",
    fullDescription: "The AI/ML Special Interest Group explores both foundational mathematics and practical implementation of modern machine learning. From training convolutional vision models to fine-tuning transformers and deploying quantized models on edge devices.",
    leadPlaceholder: "[AI/ML Domain Lead - Pending Official Member Appointment]",
    iconName: "Brain",
    technologies: ["PyTorch", "Python", "Hugging Face", "Scikit-Learn", "OpenCV", "ONNX", "NumPy"],
    keyInitiatives: [
      "Reading group on breakthrough NeurIPS/ICLR research papers",
      "Kaggle competition sprints and collaborative teams",
      "Campus AI assistant and optical character recognition project"
    ],
    meetingSchedule: "Every Wednesday • 04:30 PM (Seminar Hall B)"
  },
  {
    id: "dom-cp",
    slug: "competitive-programming",
    title: "Competitive Programming & DSA",
    shortDescription: "Mastering algorithms, data structures, and algorithmic problem-solving for ICPC and international contests.",
    fullDescription: "Dedicated to sharpening analytical problem-solving skills, algorithmic efficiency, and rapid code execution. The domain organizes mock contests, problem analysis sessions, and structured training paths.",
    leadPlaceholder: "[Algorithms Domain Lead - Pending Official Member Appointment]",
    iconName: "Binary",
    technologies: ["C++20 (STL)", "Java", "Python", "Codeforces", "CSES Problem Set", "LeetCode"],
    keyInitiatives: [
      "Weekly virtual speed contest on Codeforces",
      "ICPC regional team formation & training bootcamps",
      "Advanced DSA masterclasses on graphs, trees, and dynamic programming"
    ],
    meetingSchedule: "Every Thursday • 05:00 PM (Lab 302)"
  },
  {
    id: "dom-sec",
    slug: "cybersecurity",
    title: "Cybersecurity & Cryptography",
    shortDescription: "Offensive and defensive security, Capture The Flag (CTF) contests, reverse engineering, and threat modeling.",
    fullDescription: "The Cybersecurity domain educates students on ethical security practices, software vulnerability assessments, network protocol analysis, applied cryptography, and reverse engineering.",
    leadPlaceholder: "[Security Domain Lead - Pending Official Member Appointment]",
    iconName: "Shield",
    technologies: ["Linux", "Wireshark", "Burp Suite", "Ghidra", "Python", "OpenSSL", "Metasploit"],
    keyInitiatives: [
      "Collegiate CTF competition squads",
      "OWASP Top 10 web vulnerability walkthroughs",
      "Cryptographic protocols and secure coding guidelines"
    ],
    meetingSchedule: "Every Monday • 04:30 PM (Lab 305)"
  },
  {
    id: "dom-iot",
    slug: "iot-robotics",
    title: "Embedded Systems & IoT",
    shortDescription: "Hardware prototyping, microcontrollers, real-time operating systems, and autonomous robotics with ROS2.",
    fullDescription: "Bridging physical computing and software engineering. Members design custom PCB circuits, interface industrial sensors, program real-time microcontrollers, and develop autonomous mobile robotics.",
    leadPlaceholder: "[Hardware Domain Lead - Pending Official Member Appointment]",
    iconName: "Cpu",
    technologies: ["ESP32", "C/C++", "FreeRTOS", "ROS2", "MQTT", "Rust", "KiCAD", "Raspberry Pi"],
    keyInitiatives: [
      "Autonomous campus ground robot development",
      "Smart classroom environment telemetry node",
      "Hands-on soldering and hardware hacking workshops"
    ],
    meetingSchedule: "Every Friday • 03:30 PM (Robotics Lab)"
  },
  {
    id: "dom-design",
    slug: "ui-ux-design",
    title: "UI/UX & Brand Design",
    shortDescription: "Crafting intuitive digital interfaces, accessible user experiences, typography, and chapter visual identity.",
    fullDescription: "Design is central to everything we build. The UI/UX domain ensures all chapter products, event platforms, and publications adhere to world-class visual aesthetics, responsive standards, and WCAG accessibility guidelines.",
    leadPlaceholder: "[Design Domain Lead - Pending Official Member Appointment]",
    iconName: "Palette",
    technologies: ["Figma", "Tailwind CSS", "Design Systems", "Framer", "Adobe Illustrator"],
    keyInitiatives: [
      "DPGU ACM brand guidelines & visual identity maintenance",
      "User research and wireframe sprints for student hackathon apps",
      "Accessibility reviews and usability audits"
    ],
    meetingSchedule: "Every Saturday • 11:00 AM (Design Studio / Virtual)"
  }
];

export function getAllDomains(): TechnicalDomain[] {
  return TECHNICAL_DOMAINS;
}

export function getDomainBySlug(slug: string): TechnicalDomain | undefined {
  return TECHNICAL_DOMAINS.find((d) => d.slug === slug);
}
