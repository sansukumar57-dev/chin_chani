import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://studygenie-ai-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StudyGenie - AI Personalized Learning Assistant",
    template: "%s | StudyGenie AI",
  },
  description:
    "Transform your notes into summaries, quizzes, flashcards and interactive AI tutoring.",
  applicationName: "StudyGenie AI",
  keywords: [
    "StudyGenie",
    "StudyGenie AI",
    "AI learning assistant",
    "personalized learning",
    "AI tutor",
    "quiz generator",
    "flashcards",
    "exam preparation",
    "study planner",
  ],
  openGraph: {
    type: "website",
    siteName: "StudyGenie AI",
    title: "StudyGenie - AI Personalized Learning Assistant",
    description:
      "Upload notes, get AI summaries, quizzes, 3D flashcards and a grounded AI tutor. Free for students.",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
