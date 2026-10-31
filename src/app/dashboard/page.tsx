'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import UploadModal from '@/components/upload-modal';
import {
  getDocuments,
  getUserProfile,
  getTopicMastery,
  getStudyPlan,
  toggleStudyPlanItem,
} from '@/lib/store';
import { StudyDocument, UserProfile, TopicMastery, StudyPlanItem } from '@/types';
import {
  Flame,
  BookOpen,
  Brain,
  Trophy,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  FileText,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [documents, setDocuments] = useState<StudyDocument[]>(() => getDocuments());
  const [mastery] = useState<TopicMastery[]>(() => getTopicMastery());
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(() => getStudyPlan());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  const weakTopics = mastery.filter((m) => m.status === 'Needs Revision');
  const completedTasks = studyPlan.filter((t) => t.completed).length;

  function handlePlanToggle(id: string) {
    const updated = toggleStudyPlanItem(id);
    setStudyPlan(updated);

    const toggled = updated.find((t) => t.id === id);
    if (toggled && toggled.completed) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe confetti fallback
      }
    }
  }

  function handleUploadSuccess() {
    setDocuments(getDocuments());
    setProfile(getUserProfile());
  }

  // Days for weekly streak visualizer
  const weekDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="min-w-0 flex-1 overflow-x-hidden space-y-6">
          {/* Hero Welcome Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white shadow-lg">
            {/* Soft decorative background circles */}
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
            <div className="absolute right-40 -top-10 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/10 backdrop-blur">
                  <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span>{profile.streakDays}-Day Focus Streak</span>
                  <span className="text-white/40">•</span>
                  <span>Top 5% Learner</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {greeting}, {profile.fullName} 👋
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
                  Your personalized study schedule has prioritized <strong>{weakTopics.length} weak areas</strong> to review today. Complete your tasks to preserve your study streak!
                </p>

                {/* Weekly Streak Tracker Dots */}
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] text-indigo-300 font-medium">This Week:</span>
                  <div className="flex items-center gap-1.5">
                    {weekDays.map((w, idx) => (
                      <div
                        key={idx}
                        className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold ${
                          w.active
                            ? 'bg-amber-400 text-amber-950 shadow-xs'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {w.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-indigo-950 shadow-md hover:bg-indigo-50 transition active:scale-95"
                >
                  <PlusCircle className="h-4 w-4 text-indigo-600" />
                  <span>Upload Material</span>
                </button>
                <Link
                  href="/quiz"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/15 transition active:scale-95"
                >
                  <Brain className="h-4 w-4 text-purple-300" />
                  <span>Start Rapid Quiz</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Focus Streak</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {profile.streakDays} Days
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>On fire! Keep it going</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Study Materials</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {documents.length} Docs
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Physics, CS & Biology</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Quizzes Taken</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <Brain className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {profile.quizzesCount} Sessions
              </div>
              <p className="mt-1 text-[11px] text-purple-600 font-semibold">Active recall testing</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Avg. Accuracy</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {profile.avgAccuracy}%
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>+6% higher this week</span>
              </p>
            </div>
          </div>

          {/* Differentiating Weak Topic Alert Banner */}
          {weakTopics.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/90 via-orange-50/60 to-white p-5 shadow-sm dark:border-rose-900/60 dark:from-rose-950/40 dark:to-slate-900">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 ring-4 ring-rose-50 dark:ring-rose-950/50">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        Adaptive Diagnostic Alert
                      </span>
                      <span className="text-xs text-rose-600 font-semibold">{weakTopics[0].accuracy}% Accuracy</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      Priority Revision: {weakTopics[0].topic}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {weakTopics[0].recommendation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href="/chat"
                    className="rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 transition"
                  >
                    Ask AI Tutor
                  </Link>
                  <Link
                    href="/quiz"
                    className="flex items-center gap-1 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
                  >
                    <span>Launch Drill</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Active Documents Grid & Today's Adaptive Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Documents (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Cataloged Study Notes
                  </h2>
                </div>
                <Link
                  href="/library"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                >
                  <span>Explore Library ({documents.length})</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {documents.slice(0, 3).map((doc) => {
                  const isPhysics = doc.subject.toLowerCase().includes('physics');
                  const isCS = doc.subject.toLowerCase().includes('computer');

                  return (
                    <div
                      key={doc.id}
                      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            isPhysics
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                              : isCS
                              ? 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}
                        >
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                isPhysics
                                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                  : isCS
                                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {doc.subject}
                            </span>
                            <span className="text-[11px] text-slate-400">{doc.fileSize}</span>
                            <span className="text-[11px] text-slate-400">• Added {doc.uploadDate}</span>
                          </div>
                          <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {doc.summary?.overview || 'Ready for AI synthesis and practice questions.'}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <Link
                          href={`/study/${doc.id}?tab=summary`}
                          className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
                        >
                          Summary
                        </Link>
                        <Link
                          href={`/study/${doc.id}?tab=quiz`}
                          className="rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 transition"
                        >
                          Quiz
                        </Link>
                        <Link
                          href={`/study/${doc.id}?tab=flashcards`}
                          className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
                        >
                          Cards
                        </Link>
                        <Link
                          href={`/study/${doc.id}?tab=chat`}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                          title="Ask AI Doubt Solver"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personalized Weekly Study Schedule (1 Col) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Adaptive Study Plan
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {completedTasks} of {studyPlan.length} done
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Dynamically scheduled to reinforce your weak topics before exams:
              </p>

              <div className="space-y-2.5">
                {studyPlan.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePlanToggle(item.id)}
                    className={`cursor-pointer flex items-center justify-between rounded-xl p-3 border transition ${
                      item.completed
                        ? 'bg-slate-50 border-slate-200/60 opacity-60 dark:bg-slate-800/40 dark:border-slate-800'
                        : 'bg-white border-slate-200/80 hover:border-indigo-300 dark:bg-slate-800/80 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <p
                          className={`text-xs font-semibold leading-tight ${
                            item.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {item.topic}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {item.day} • {item.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-medium">
                      <Clock className="h-3 w-3" />
                      <span>{item.durationMinutes}m</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/analytics"
                className="w-full flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/60 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 transition"
              >
                <span>View Full Adaptive Schedule</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
