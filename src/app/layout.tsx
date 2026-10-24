import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { InitialScreenLoader } from "@/components/layout/InitialScreenLoader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | DPGU ACM Student Chapter",
    default: "DPGU ACM Student Chapter | Official Portal",
  },
  description:
    "Official website of DPG University ACM Student Chapter. Advancing computing as a science and profession through events, workshops, hackathons, and technical projects.",
  keywords: [
    "ACM",
    "DPG University",
    "DPGU",
    "Student Chapter",
    "Computer Science",
    "Hackathon",
    "Workshops",
    "Gurugram",
  ],
  authors: [{ name: "DPGU ACM Student Chapter" }],
};

export const viewport: Viewport = {
  themeColor: "#080B12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#080B12] text-[#F5F7FB] antialiased selection:bg-[#648CFF]/20 selection:text-[#F5F7FB]">
        <InitialScreenLoader />
        {children}
      </body>
    </html>
  );
}
