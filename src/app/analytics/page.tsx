'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import {
  getTopicMastery,
  getStudyPlan,
  toggleStudyPlanItem,
} from '@/lib/store';
import { TopicMastery, StudyPlanItem } from '@/types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Circle,
  Lightbulb,
  TrendingUp,
  Brain,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [mastery] = useState<TopicMastery[]>(() => getTopicMastery());
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(() => getStudyPlan());
  const [filter, setFilter] = useState<'all' | 'weak' | 'mastered'>('all');

  function handleTogglePlan(id: string) {
    const updated = toggleStudyPlanItem(id);
    setStudyPlan(updated);
  }

  const weakTopics = mastery.filter((m) => m.status === 'Needs Revision');
  const improvingTopics = mastery.filter((m) => m.status === 'Improving');
  const masteredTopics = mastery.filter((m) => m.status === 'Mastered');

  const displayedMastery =
    filter === 'weak'
      ? weakTopics
      : filter === 'mastered'
      ? masteredTopics
      : mastery;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-x-hidden space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Adaptive Intelligence
                </span>
                <span className="text-xs text-slate-400">Shinchan Hackathon Feature</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Weak-Topic Analyzer & Study Planner
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Identifies knowledge gaps from your quiz attempts and auto-generates a personalized study schedule.
              </p>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm dark:border-rose-950 dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span>Needs Revision</span>
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400">
                {weakTopics.length} Topics
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Accuracy &lt; 60% — Highest study priority
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-950 dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Improving</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="mt-2 text-3xl font-black text-amber-600 dark:text-amber-400">
                {improvingTopics.length} Topics
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Accuracy 60% - 79% — Reinforce with flashcards
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Mastered</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {masteredTopics.length} Topics
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Accuracy &gt;= 80% — Solid conceptual base
              </p>
            </div>
          </div>

          {/* Topic Mastery Table */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Knowledge Gap Identification by Topic
                </h2>
                <p className="text-xs text-slate-500">
                  Scored live across your quiz attempts with tailored AI recommendations.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setFilter('all')}
                  className={`rounded-lg px-3 py-1 transition ${
                    filter === 'all'
                      ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All ({mastery.length})
                </button>
                <button
                  onClick={() => setFilter('weak')}
                  className={`rounded-lg px-3 py-1 transition ${
                    filter === 'weak'
                      ? 'bg-white text-rose-700 shadow-sm dark:bg-slate-700 dark:text-rose-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Weak ({weakTopics.length})
                </button>
                <button
                  onClick={() => setFilter('mastered')}
                  className={`rounded-lg px-3 py-1 transition ${
                    filter === 'mastered'
                      ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Mastered ({masteredTopics.length})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {displayedMastery.map((item, idx) => {
                const statusColor =
                  item.status === 'Mastered'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : item.status === 'Improving'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

                const barColor =
                  item.status === 'Mastered'
                    ? 'bg-emerald-500'
                    : item.status === 'Improving'
                    ? 'bg-amber-500'
                    : 'bg-rose-500';

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-300 transition-all dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {item.subject}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.topic}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.correctAnswers} of {item.totalQuestions} questions answered correctly
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {item.accuracy}%
                        </span>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Accuracy Bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                      <div
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>

                    {/* AI Recommendation */}
                    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">AI Suggestion: </strong>
                        {item.recommendation}
                      </span>
                    </div>

                    {/* Action Drill Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      <Link
                        href={`/quiz?topic=${encodeURIComponent(item.topic)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 transition"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>Practice Drill</span>
                      </Link>
                      <Link
                        href="/flashcards"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Flashcard Review</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adaptive Weekly Timetable */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Personalized 7-Day Adaptive Timetable
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calculated to target your weakest concepts first.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {studyPlan.filter((s) => s.completed).length} / {studyPlan.length} Tasks Done
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {studyPlan.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTogglePlan(task.id)}
                  className={`cursor-pointer flex items-center justify-between rounded-2xl p-4 border transition ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200/60 opacity-60 dark:bg-slate-800/40 dark:border-slate-800'
                      : 'bg-white border-slate-200 hover:border-indigo-400 dark:bg-slate-800/80 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {task.day}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          {task.type}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-semibold mt-1 leading-snug ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.topic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task.durationMinutes}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

