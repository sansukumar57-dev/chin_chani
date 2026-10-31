"use client";

import { X, Database, ShieldCheck, Cpu, Code2, Layers, CheckCircle2, Award } from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  StudyGenie System Architecture & Hackathon Blueprint
                </h3>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Devengers 2026
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Shinchan 24-Hour Online Hackathon • Solo Developer Blueprint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-xs sm:text-sm">
          {/* Architecture Visual Grid */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/40 p-5">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>End-to-End System Flow</span>
            </h4>
            <div className="font-mono text-[11px] leading-relaxed text-indigo-950 bg-white/80 p-4 rounded-xl border border-indigo-100 overflow-x-auto whitespace-pre">
{`[ STUDENT ] ────► [ NEXT.JS 16 FRONTEND ] (React 19 + Tailwind CSS)
                         │
        ┌────────────────┼────────────────┬────────────────┐
        ▼                ▼                ▼                ▼
   PDF Upload       AI Tutor Chat    Practice Quiz    Flashcards Deck
   (pdf-parse)      (Grounded RAG)   (Zod Validation) (3D Interactive)
        │                │                │                │
        └────────────────┴────────┬───────┴────────────────┘
                                  ▼
                     [ NEXT.JS API ROUTE HANDLERS ]
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      [ SUPABASE BACKEND ]                  [ AI LLM ENGINE ]
   • PostgreSQL Relational DB          • OpenAI GPT-4o-mini / Gemini
   • Row Level Security (RLS)          • Context-Aware Prompts
   • Private 'study-materials' Bucket  • Zod Validated Structured JSON`}
            </div>
          </div>

          {/* Database Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <Database className="h-4 w-4 text-indigo-600" />
                <span>Supabase PostgreSQL Schema</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li><strong className="text-gray-900">profiles:</strong> User profile, streak, study time</li>
                <li><strong className="text-gray-900">documents:</strong> Extracted notes, title, file size, user_id</li>
                <li><strong className="text-gray-900">study_outputs:</strong> Summaries, quizzes, flashcards (JSONB)</li>
                <li><strong className="text-gray-900">chat_messages:</strong> Context-grounded tutor QA & citations</li>
                <li><strong className="text-gray-900">quiz_attempts:</strong> Scores, percentages, topic accuracy</li>
                <li><strong className="text-gray-900">topic_mastery:</strong> Weak/strong topic mastery matrix</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Security & Row Level Security (RLS)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li><strong className="text-gray-900">Strict User Isolation:</strong> (auth.uid() = user_id) on all tables</li>
                <li><strong className="text-gray-900">Private Bucket:</strong> study-materials partitioned by user folder</li>
                <li><strong className="text-gray-900">Server Authentication:</strong> Verified via supabase.auth.getUser()</li>
                <li><strong className="text-gray-900">Fallback Resilience:</strong> In-memory demo sandbox for zero-key evaluation</li>
              </ul>
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h4 className="font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>Why StudyGenie Stands Out in Hackathons</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Document-Grounded RAG prevents hallucination with citations</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Adaptive Weak-Topic Diagnostic recalculates accuracy on every quiz</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Instant-test sample decks so judges don&apos;t need to upload their own files</span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Complete learning cycle: Upload → Understand → Practice → Evaluate → Master</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
