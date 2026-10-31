'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Terminal,
  MessageSquare,
  Check,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import ArchitectureModal from '@/components/architecture-modal';

export default function Home() {
  const [showArchModal, setShowArchModal] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'summary' | 'chat' | 'quiz' | 'analytics'>('summary');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Study<span className="text-indigo-600 dark:text-indigo-400">Genie</span>
                </span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                  AI v2.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchModal(true)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition hidden sm:flex items-center gap-1.5"
            >
              <Terminal className="h-3.5 w-3.5 text-indigo-600" />
              <span>Blueprint</span>
            </button>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 dark:text-slate-300"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition active:scale-95"
            >
              <span>Launch Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.22),rgba(2,6,23,0))]">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-blue-500/15 blur-3xl pointer-events-none rounded-full" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-5">
            {/* Consolidated Single Hackathon Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Shinchan Online Hackathon 2026</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-600 dark:text-slate-400">Devengers Open Innovation</span>
            </div>

            {/* Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] text-balance">
              Transform Any Notes Into An{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Adaptive AI Study Companion
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Upload course PDFs, textbook chapters, or lecture notes. StudyGenie automatically synthesizes 
              high-yield exam summaries, answers doubts grounded in your notes, generates interactive quizzes, and diagnoses your weak topics.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open Live Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setShowArchModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition shadow-xs"
              >
                <Terminal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>View System Architecture</span>
              </button>
            </div>

            {/* Preloaded Judge Test Decks */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">⚡ Instant Judge Decks:</span>
              <Link
                href="/study/doc-physics-101"
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/90 bg-white/90 px-3 py-1 font-semibold text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-300 transition shadow-xs"
              >
                <span>⚛️</span> AP Physics Mechanics
              </Link>
              <Link
                href="/study/doc-cs-algo"
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/90 bg-white/90 px-3 py-1 font-semibold text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-300 transition shadow-xs"
              >
                <span>💻</span> CS Algorithms & Big-O
              </Link>
              <Link
                href="/study/doc-bio-cell"
                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/90 bg-white/90 px-3 py-1 font-semibold text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-300 transition shadow-xs"
              >
                <span>🧬</span> Cellular Biology
              </Link>
            </div>

            {/* App-Window Styled Interactive Preview */}
            <div className="pt-6 max-w-4xl mx-auto">
              <div className="rounded-3xl border border-indigo-500/30 bg-white/95 dark:bg-slate-900/95 shadow-2xl shadow-indigo-950/40 backdrop-blur text-left overflow-hidden">
                {/* App Window Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="ml-2 font-mono text-[11px] text-slate-400">
                      studygenie-app-preview.tsx
                    </span>
                  </div>

                  {/* Grounded Citation Badge */}
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800">
                    <span>📄</span> Grounded Source: Page 12 • Mechanics.pdf
                  </span>
                </div>

                {/* Playground Tab Selector */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-2.5 gap-2 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setActivePreviewTab('summary')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activePreviewTab === 'summary'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Pedagogical Summary</span>
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('chat')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activePreviewTab === 'chat'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Grounded Socratic Tutor</span>
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('quiz')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activePreviewTab === 'quiz'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <BrainCircuit className="h-3.5 w-3.5" />
                      <span>Practice Quiz Arena</span>
                    </button>
                    <button
                      onClick={() => setActivePreviewTab('analytics')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activePreviewTab === 'analytics'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Weak-Topic Diagnostics</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Live Interactive Preview
                  </span>
                </div>

                {/* Playground Content Area */}
                <div className="p-4 sm:p-6 min-h-[220px]">
                  {activePreviewTab === 'summary' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                          Physics • Newtonian Mechanics
                        </span>
                        <span className="text-[11px] text-slate-400">4 Key Concepts Extracted</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Newton’s Second Law & Equilibrium Mechanics (F = ma)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        The net external force on a body is directly proportional to its rate of change of momentum. When external forces sum to zero, velocity remains constant (Law of Inertia).
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Action-Reaction Pairs:</span>
                          <p className="text-slate-500 dark:text-slate-400 mt-0.5">Act on separate bodies; never cancel on a single free-body diagram.</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Friction Hierarchy:</span>
                          <p className="text-slate-500 dark:text-slate-400 mt-0.5">Static threshold (μs · N) is strictly higher than kinetic friction (μk · N).</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === 'chat' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200 shrink-0">
                          YOU
                        </div>
                        <div className="rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200">
                          Why don&apos;t action and reaction forces cancel each other out?
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          AI
                        </div>
                        <div className="rounded-2xl rounded-tl-none border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/40 p-3 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                          <p>
                            Because they act on <strong>two completely different objects</strong>! When you push against a wall, your hands apply force to the wall, but the wall pushes back on your body.
                          </p>
                          <div className="pt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                            <span>↳ Cited from Chapter 3: Newton&apos;s Third Law (Section 3.2)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === 'quiz' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Question 1 of 5 • Mechanics</span>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                          Adaptive Practice
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Which statement correctly explains why static friction exceeds kinetic friction?
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="rounded-xl border border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 p-2.5 text-emerald-900 dark:text-emerald-200 font-medium flex items-center justify-between">
                          <span>Microscopic surface asperities settle deeper when stationary</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                          Normal force vanishes during kinetic sliding
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === 'analytics' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Weak-Topic Diagnostic Breakdown
                        </h4>
                        <span className="text-[11px] font-semibold text-rose-600">2 Focus Areas Needed</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between font-semibold mb-1">
                            <span className="text-slate-800 dark:text-slate-200">Action-Reaction Free Body Diagrams</span>
                            <span className="text-rose-600">42% • Needs Revision</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-2 rounded-full w-[42%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between font-semibold mb-1">
                            <span className="text-slate-800 dark:text-slate-200">F = ma Momentum Calculations</span>
                            <span className="text-emerald-600">88% • Mastered</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-2 rounded-full w-[88%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Playground Bottom CTA bar */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Ready to test with your own study material?</span>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <span>Try All Features in Dashboard</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison: StudyGenie vs Generic AI */}
        <section className="py-14 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Why StudyGenie Stands Out
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Engineered for High-Stakes Exams
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Unlike generic chatbots, StudyGenie is grounded directly in your syllabus with continuous mastery tracking.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Feature</th>
                    <th className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-bold">StudyGenie AI Companion</th>
                    <th className="py-3 px-4 text-slate-400">Generic Chatbots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Document Grounding (Zero Hallucination)
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4 shrink-0" /> Strictly grounded + verified section citations
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Frequently invents out-of-syllabus terms
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Weak-Topic Diagnostic Engine
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 shrink-0" />
                        <span>Weighted Topic Mastery &amp; Knowledge Gap Analysis</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Zero memory of student error patterns
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Active Recall (Quizzes &amp; 3D Cards)
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4 shrink-0" /> Instant MCQ Scoring + 3D SRS Flashcard Decks
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Passive walls of text output only
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      Adaptive Study Timetable
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4 shrink-0" /> Prioritizes weak chapters dynamically in 7-day plan
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        ✕ None
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Hackathon Pitch CTA */}
        <section className="py-12 bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-900 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to test StudyGenie?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto">
              Preloaded with verified AP Physics, Operating Systems, and Biology decks so judges can test every feature immediately.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-xs sm:text-sm font-bold text-indigo-950 shadow-md hover:bg-indigo-50 transition active:scale-95"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">StudyGenie AI</span>
            <span>• Shinchan Online Hackathon 2026 by Devengers</span>
          </div>
          <p>Solo Developer Submission • Next.js 16 + Supabase + Tailwind CSS v4</p>
        </div>
      </footer>

      {/* System Blueprint Inspector Modal */}
      <ArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
    </div>
  );
}
