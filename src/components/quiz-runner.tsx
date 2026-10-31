"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle, Sparkles, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { QuizQuestion, QuizAttempt } from "@/types";

interface QuizRunnerProps {
  documentTitle: string;
  documentId: string;
  questions: QuizQuestion[];
  onQuizComplete?: (attempt: QuizAttempt) => void;
  onNavigateToAnalytics?: () => void;
}

export default function QuizRunner({
  documentTitle,
  documentId,
  questions,
  onQuizComplete,
  onNavigateToAnalytics,
}: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState<number>(Date.now());

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;

  function handleSelectOption(optIdx: number) {
    if (isAnswered || isCompleted) return;
    const newAnswers = { ...selectedAnswers, [currentIndex]: optIdx };
    setSelectedAnswers(newAnswers);
    setShowExplanation({ ...showExplanation, [currentIndex]: true });

    // If this was the last question, complete quiz
    if (Object.keys(newAnswers).length === questions.length) {
      finishQuiz(newAnswers);
    }
  }

  function finishQuiz(answersMap: Record<number, number>) {
    let score = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      const isCorrect = answersMap[idx] === q.correctAnswer;
      if (isCorrect) score += 1;

      const t = q.topic || "General";
      if (!topicBreakdown[t]) {
        topicBreakdown[t] = { correct: 0, total: 0 };
      }
      topicBreakdown[t].total += 1;
      if (isCorrect) {
        topicBreakdown[t].correct += 1;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      documentId,
      documentTitle,
      date: new Date().toISOString().split("T")[0],
      score,
      totalQuestions: questions.length,
      percentage,
      topicBreakdown,
    };

    setIsCompleted(true);

    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn("Confetti skipped:", e);
      }
    }

    onQuizComplete?.(attempt);
  }

  function resetQuiz() {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setIsCompleted(false);
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-gray-50/50">
        <HelpCircle className="mx-auto h-8 w-8 text-indigo-400" />
        <h3 className="mt-2 text-sm font-bold text-gray-900">No Quiz Questions Available</h3>
        <p className="mt-1 text-xs text-gray-500">
          Generate a quiz using StudyGenie AI for this study document.
        </p>
      </div>
    );
  }

  // Completed State View
  if (isCompleted) {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correctCount++;
    });
    const finalPct = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm space-y-6 animate-in fade-in">
        <div className="text-center max-w-md mx-auto py-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-sm ring-8 ring-indigo-50/50">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Completed!</h2>
          <p className="text-xs text-gray-500 mt-1">
            Performance assessment for <span className="font-semibold text-gray-700">{documentTitle}</span>
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 px-6 py-4 text-center">
              <span className="text-3xl font-extrabold text-indigo-700">{finalPct}%</span>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Accuracy</p>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-200 px-6 py-4 text-center">
              <span className="text-3xl font-extrabold text-gray-900">
                {correctCount} / {questions.length}
              </span>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Score</p>
            </div>
          </div>
        </div>

        {/* Detailed Topic Assessment breakdown */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Topic Mastery & Weak-Spot Diagnostics
          </h4>
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const selected = selectedAnswers[idx];
              const isCorrect = selected === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`rounded-xl p-3 border text-xs ${
                    isCorrect
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50/50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">
                      Q{idx + 1}. {q.question}
                    </p>
                    <span className="flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/80">
                      {q.topic}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-600">
                    <span className="font-bold">Explanation:</span> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Quiz</span>
          </button>

          {onNavigateToAnalytics && (
            <button
              onClick={onNavigateToAnalytics}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
            >
              <span>View Weak Topic Analytics</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Question View
  return (
    <div className="rounded-2xl border border-indigo-100/80 bg-white p-6 shadow-sm space-y-6">
      {/* Top status */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100">
            {currentQ.topic || "Core Subject"}
          </span>
          <h3 className="text-xs font-medium text-gray-500 mt-1">{documentTitle}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question prompt */}
      <div>
        <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
          {currentQ.question}
        </h4>
      </div>

      {/* Options grid */}
      <div className="space-y-3">
        {currentQ.options.map((option, optIdx) => {
          const isSelected = selectedAnswers[currentIndex] === optIdx;
          const isCorrect = optIdx === currentQ.correctAnswer;
          const showResult = isAnswered;

          let btnStyle = "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-800";
          if (showResult) {
            if (isCorrect) {
              btnStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-400";
            } else if (isSelected) {
              btnStyle = "border-rose-500 bg-rose-50/80 text-rose-950 font-semibold ring-1 ring-rose-400";
            } else {
              btnStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
            }
          }

          const optionLabels = ["A", "B", "C", "D"];

          return (
            <button
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              disabled={isAnswered}
              className={`w-full text-left flex items-start gap-3 rounded-xl border p-4 transition-all text-xs sm:text-sm ${btnStyle}`}
            >
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  showResult && isCorrect
                    ? "bg-emerald-600 text-white"
                    : showResult && isSelected
                    ? "bg-rose-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {optionLabels[optIdx]}
              </span>
              <span className="flex-1 mt-0.5 leading-relaxed">{option}</span>
              {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Explanation Callout */}
      {showExplanation[currentIndex] && (
        <div
          className={`rounded-xl p-4 text-xs leading-relaxed border animate-in fade-in duration-200 ${
            selectedAnswers[currentIndex] === currentQ.correctAnswer
              ? "bg-emerald-50 border-emerald-200 text-emerald-950"
              : "bg-indigo-50/80 border-indigo-200 text-indigo-950"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Explanation & High-Yield Concept:</span>
          </div>
          <p>{currentQ.explanation}</p>
        </div>
      )}

      {/* Navigation between questions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-30"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={!isAnswered}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-all"
          >
            <span>Next Question</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={() => finishQuiz(selectedAnswers)}
            disabled={!isAnswered}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Submit Quiz</span>
          </button>
        )}
      </div>
    </div>
  );
}
