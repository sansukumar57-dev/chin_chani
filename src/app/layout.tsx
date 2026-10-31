import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyGenie - AI Personalized Learning Assistant",
  description: "Transform your notes into summaries, quizzes, flashcards and interactive AI tutoring.",
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
