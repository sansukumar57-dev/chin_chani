"use client";

import { useState } from "react";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Layers,
  MessageSquare,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";
import { StudyDocument, DocumentSummary } from "@/types";
import { saveDocument } from "@/lib/store";

interface SummaryViewProps {
  document: StudyDocument;
  onNavigateToQuiz: () => void;
  onNavigateToChat: () => void;
  onNavigateToFlashcards: () => void;
}

export default function SummaryView({
  document,
  onNavigateToQuiz,
  onNavigateToChat,
  onNavigateToFlashcards,
}: SummaryViewProps) {
  const [summary, setSummary] = useState<DocumentSummary | undefined>(document.summary);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateOrRefreshSummary() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: document.id,
          title: document.title,
          content: document.content,
        }),
      });

      const data = await response.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
        saveDocument({ ...document, summary: data.summary });
      }
    } catch (err) {
      console.error("Summary regeneration failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopyMarkdown() {
    if (!summary) return;
    const md = `# ${summary.mainTopic}

## Overview
${summary.overview}

## Key Concepts
${summary.keyConcepts.map((c) => `- **${c.term}** (${c.importance}): ${c.explanation}`).join("\n")}

## Definitions
${summary.definitions.map((d) => `- **${d.term}**: ${d.definition}`).join("\n")}

## High-Yield Takeaways
${summary.highYieldTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n")}

## Exam Tips
${summary.examTips.map((tip) => `* ${tip}`).join("\n")}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50 p-5 border border-indigo-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              {document.subject || "Study Notes"}
            </span>
            <span className="text-xs text-gray-400">• {document.fileSize || "Text Document"}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{document.title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            AI-extracted pedagogical summary with key definitions & exam takeaways.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied MD!" : "Export MD"}</span>
          </button>

          <button
            onClick={generateOrRefreshSummary}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100/70 transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Synthesizing..." : "Regenerate AI"}</span>
          </button>

          <button
            onClick={onNavigateToQuiz}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-500/20"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Start Practice Quiz</span>
          </button>
        </div>
      </div>

      {!summary ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-gray-50/50">
          <Sparkles className="mx-auto h-8 w-8 text-indigo-500 animate-bounce" />
          <h3 className="mt-2 text-sm font-bold text-gray-900">No Summary Generated Yet</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Click below to generate a complete structured study breakdown using StudyGenie AI.
          </p>
          <button
            onClick={generateOrRefreshSummary}
            disabled={isLoading}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all"
          >
            {isLoading ? "Analyzing Text..." : "Generate AI Summary Now"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-column breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                <BookOpen className="h-4 w-4" />
                <h3 className="text-sm font-bold text-gray-900">Core Topic & High-Level Synthesis</h3>
              </div>
              <h4 className="text-base font-semibold text-indigo-900">{summary.mainTopic}</h4>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{summary.overview}</p>
            </div>

            {/* Key Concepts */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Lightbulb className="h-4 w-4" />
                  <h3 className="text-sm font-bold text-gray-900">Key Concepts & Formulations</h3>
                </div>
                <span className="text-[11px] text-gray-400">{summary.keyConcepts.length} concepts</span>
              </div>

              <div className="space-y-3">
                {summary.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-900">{concept.term}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          concept.importance === "Critical"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : concept.importance === "High"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {concept.importance}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 leading-normal">{concept.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Essential Definitions */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 text-indigo-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Essential Academic Definitions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary.definitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 bg-white p-3 shadow-xs hover:border-indigo-100"
                  >
                    <p className="text-xs font-bold text-indigo-900">{def.term}</p>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">{def.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Takeaways & Exam Alerts */}
          <div className="space-y-6">
            {/* High-Yield Takeaways */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-4 w-4" />
                <span>High-Yield Takeaways</span>
              </h3>
              <ul className="space-y-2.5">
                {summary.highYieldTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam Tips & Traps */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Exam Tips & Frequent Traps</span>
              </h3>
              <div className="space-y-2.5">
                {summary.examTips.map((tip, idx) => (
                  <div key={idx} className="rounded-xl bg-white/90 p-3 border border-amber-200/60">
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      💡 {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Deepen Understanding
              </p>
              <button
                onClick={onNavigateToChat}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 p-2.5 text-xs font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-indigo-600" />
                  <span>Ask AI Tutor Questions</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button
                onClick={onNavigateToFlashcards}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 p-2.5 text-xs font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-600" />
                  <span>Practice Revision Flashcards</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
