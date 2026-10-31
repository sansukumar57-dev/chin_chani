"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  Target,
} from "lucide-react";
import { TopicMastery, StudyPlanItem } from "@/types";
import { INITIAL_TOPIC_MASTERY, INITIAL_STUDY_PLAN } from "@/lib/store";

interface AnalyticsViewProps {
  topics?: TopicMastery[];
  studyPlan?: StudyPlanItem[];
  onStartTopicReview?: (topicName: string) => void;
}

export default function AnalyticsView({
  topics = INITIAL_TOPIC_MASTERY,
  studyPlan = INITIAL_STUDY_PLAN,
  onStartTopicReview,
}: AnalyticsViewProps) {
  const [planItems, setPlanItems] = useState<StudyPlanItem[]>(studyPlan);
  const [filterSubject, setFilterSubject] = useState<string>("All");

  function togglePlanItem(id: string) {
    setPlanItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }

  const subjects = ["All", ...Array.from(new Set(topics.map((t) => t.subject)))];
  const filteredTopics = filterSubject === "All" ? topics : topics.filter((t) => t.subject === filterSubject);

  const totalQuestions = topics.reduce((sum, t) => sum + t.totalQuestions, 0);
  const totalCorrect = topics.reduce((sum, t) => sum + t.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const weakTopics = topics.filter((t) => t.status === "Needs Revision");
  const masteredTopics = topics.filter((t) => t.status === "Mastered");

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                Adaptive Learning Engine
              </span>
              <span className="text-xs text-indigo-200">• Continuous Evaluation</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              Weak-Topic & Knowledge Gap Diagnostics
            </h2>
            <p className="mt-1 text-xs text-indigo-200 max-w-xl">
              StudyGenie tracks question accuracy across concepts to construct your personalized revision schedule and target areas that need reinforcement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 text-center border border-white/15">
              <span className="text-2xl font-black text-white">{overallAccuracy}%</span>
              <p className="text-[10px] font-semibold uppercase text-indigo-200">Overall Accuracy</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 text-center border border-white/15">
              <span className="text-2xl font-black text-emerald-400">{masteredTopics.length}</span>
              <p className="text-[10px] font-semibold uppercase text-indigo-200">Mastered</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 text-center border border-white/15">
              <span className="text-2xl font-black text-rose-400">{weakTopics.length}</span>
              <p className="text-[10px] font-semibold uppercase text-indigo-200">Need Revision</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Topic Mastery Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Topic-by-Topic Mastery Matrix</h3>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setFilterSubject(subj)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterSubject === subj
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTopics.map((item, idx) => {
              const isWeak = item.status === "Needs Revision";
              const isMastered = item.status === "Mastered";

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs hover:border-indigo-200 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{item.topic}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                          {item.subject}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-gray-900">{item.accuracy}%</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isMastered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isWeak
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isMastered ? "bg-emerald-500" : isWeak ? "bg-rose-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>

                  {/* Algorithmic recommendation */}
                  <div className="flex items-start justify-between gap-2 pt-1 text-xs">
                    <p className="text-gray-500 text-[11px] leading-snug">
                      <span className="font-semibold text-gray-700">Recommendation:</span>{" "}
                      {item.recommendation}
                    </p>

                    {isWeak && onStartTopicReview && (
                      <button
                        onClick={() => onStartTopicReview(item.topic)}
                        className="flex-shrink-0 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Revise</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Personalized Weekly Study Plan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Personalized Study Schedule</h3>
            </div>
            <span className="text-xs text-gray-400">
              {planItems.filter((p) => p.completed).length} / {planItems.length} done
            </span>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs space-y-3">
            <p className="text-xs text-gray-500 leading-snug">
              Dynamically scheduled to prioritize weak topics before exam day.
            </p>

            <div className="space-y-2.5 pt-1">
              {planItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => togglePlanItem(item.id)}
                  className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition-all ${
                    item.completed
                      ? "bg-gray-50/70 border-gray-200 opacity-60 line-through"
                      : "bg-white border-gray-200/80 hover:border-indigo-300 hover:bg-indigo-50/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="h-4 w-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-gray-900">{item.topic}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {item.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="rounded bg-indigo-50 px-1.5 py-0.2 text-indigo-700 font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Goal: 45 mins/day</span>
              <span className="font-semibold text-indigo-600">Adaptive Planner Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
