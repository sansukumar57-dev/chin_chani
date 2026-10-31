'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizAttempt } from '@/types';
import { recordQuizAttempt } from '@/lib/store';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  BarChart2,
  Sparkles,
  Volume2,
  Award,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface QuizPlayerProps {
  questions: QuizQuestion[];
  documentId: string;
  documentTitle: string;
  onRestart?: () => void;
}

export default function QuizPlayer({
  questions,
  documentId,
  documentTitle,
  onRestart,
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answersState, setAnswersState] = useState<
    Array<{ selected: number; isCorrect: boolean; topic: string }>
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMistakesOnly, setShowMistakesOnly] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti effect failed', e);
      }
    }
  }, [isCompleted]);

  // Keyboard shortcut support (1-4 to choose, Enter to confirm/advance)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isCompleted) return;
      if (['1', '2', '3', '4'].includes(e.key) && !isAnswerSubmitted) {
        setSelectedOption(parseInt(e.key, 10) - 1);
      } else if (e.key === 'Enter') {
        if (!isAnswerSubmitted && selectedOption !== null) {
          handleSubmitAnswer();
        } else if (isAnswerSubmitted) {
          handleNext();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedOption, isAnswerSubmitted, isCompleted]);

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <HelpCircle className="mx-auto h-12 w-12 text-indigo-400 mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          No Quiz Questions Available
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Click generate practice quiz to build AI questions from this document.
        </p>
      </div>
    );
  }

  function handleSelectOption(index: number) {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  }

  function handleSubmitAnswer() {
    if (selectedOption === null || isAnswerSubmitted) return;
    const isCorrect = selectedOption === currentQ.correctAnswer;
    setIsAnswerSubmitted(true);

    const updated = [
      ...answersState,
      {
        selected: selectedOption,
        isCorrect,
        topic: currentQ.topic || 'General Concept',
      },
    ];
    setAnswersState(updated);
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finalize quiz
      const correctCount = answersState.filter((a) => a.isCorrect).length;
      const percentage = Math.round((correctCount / questions.length) * 100);

      const topicBreakdown: Record<string, { correct: number; total: number }> = {};
      answersState.forEach((ans) => {
        if (!topicBreakdown[ans.topic]) {
          topicBreakdown[ans.topic] = { correct: 0, total: 0 };
        }
        topicBreakdown[ans.topic].total += 1;
        if (ans.isCorrect) {
          topicBreakdown[ans.topic].correct += 1;
        }
      });

      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        documentId,
        documentTitle,
        date: new Date().toISOString().split('T')[0],
        score: correctCount,
        totalQuestions: questions.length,
        percentage,
        topicBreakdown,
      };

      recordQuizAttempt(attempt);
      setIsCompleted(true);
    }
  }

  function restartQuiz() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswersState([]);
    setIsCompleted(false);
    setShowMistakesOnly(false);
    if (onRestart) onRestart();
  }

  function handleReadQuestion() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${currentQ.question}. Option A: ${currentQ.options[0]}. Option B: ${currentQ.options[1]}. Option C: ${currentQ.options[2]}. Option D: ${currentQ.options[3]}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Completion view
  if (isCompleted) {
    const correctCount = answersState.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    const mistakes = questions.filter((_, idx) => !answersState[idx]?.isCorrect);

    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900 max-w-2xl mx-auto space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25">
          <Trophy className="h-8 w-8" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Quiz Completed!
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Study Material: <span className="font-semibold text-slate-700 dark:text-slate-300">{documentTitle}</span>
          </p>
        </div>

        {/* Score Card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 p-6 border border-indigo-100 dark:from-indigo-950/40 dark:to-slate-900 dark:border-indigo-900/50">
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
            {percentage}%
          </div>
          <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            {correctCount} of {questions.length} Questions Correct
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>
              {percentage >= 80
                ? 'Mastery Level Achieved! Results synced to your diagnostic matrix.'
                : percentage >= 60
                ? 'Good effort! Focus on your weak topics in the planner.'
                : 'Priority revision scheduled before your upcoming exams.'}
            </span>
          </div>
        </div>

        {/* Mistakes Review Drawer */}
        {mistakes.length > 0 && (
          <div className="text-left space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Review Identified Mistakes ({mistakes.length})</span>
              </span>
              <button
                onClick={() => setShowMistakesOnly(!showMistakesOnly)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                {showMistakesOnly ? 'Hide Explanations' : 'View Explanations'}
              </button>
            </div>

            {showMistakesOnly && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const ans = answersState[idx];
                  if (!ans || ans.isCorrect) return null;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs dark:border-rose-900/50 dark:bg-rose-950/30 space-y-1.5"
                    >
                      <p className="font-bold text-slate-900 dark:text-white">
                        Q: {q.question}
                      </p>
                      <p className="text-rose-700 dark:text-rose-300">
                        <strong>Your answer:</strong> {q.options[ans.selected]} (Incorrect)
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-300">
                        <strong>Correct answer:</strong> {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 pt-1 border-t border-rose-200/60 dark:border-rose-900/60 leading-relaxed">
                        💡 {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={restartQuiz}
            className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Quiz</span>
          </button>

          <Link
            href="/analytics"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition"
          >
            <BarChart2 className="h-4 w-4" />
            <span>Open Weak-Topic Diagnostics</span>
          </Link>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Quiz Progress header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {currentQ.topic && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              • Topic: <strong className="text-slate-700 dark:text-slate-300">{currentQ.topic}</strong>
            </span>
          )}
        </div>

        {/* Question dots & Audio Read */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReadQuestion}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition"
            title="Listen to question"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          {/* Dot Tracker */}
          <div className="flex items-center gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-indigo-600'
                    : i < currentIndex
                    ? 'w-2.5 bg-emerald-500'
                    : 'w-2.5 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div>
        <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          let btnStyle = 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/80';
          let letterBg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

          if (isAnswerSubmitted) {
            if (idx === currentQ.correctAnswer) {
              btnStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-500 ring-2 ring-emerald-500/20';
              letterBg = 'bg-emerald-600 text-white';
            } else if (idx === selectedOption) {
              btnStyle = 'border-rose-500 bg-rose-50/80 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-500 ring-2 ring-rose-500/20';
              letterBg = 'bg-rose-600 text-white';
            } else {
              btnStyle = 'border-slate-200 opacity-60 dark:border-slate-800';
            }
          } else if (selectedOption === idx) {
            btnStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-500';
            letterBg = 'bg-indigo-600 text-white';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handleSelectOption(idx)}
              className={`w-full flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${btnStyle}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${letterBg}`}
              >
                {optionLetters[idx]}
              </div>
              <span className="text-xs sm:text-sm font-medium leading-normal flex-1">{opt}</span>
              {isAnswerSubmitted && idx === currentQ.correctAnswer && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              )}
              {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctAnswer && (
                <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation Box (Appears after submission) */}
      {isAnswerSubmitted && (
        <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/40 text-xs leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200 mb-1">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Pedagogical Explanation:</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">{currentQ.explanation}</p>
        </div>
      )}

      {/* Bottom controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Tip: Use keys <kbd className="rounded bg-slate-100 px-1 py-0.5 border text-[10px] dark:bg-slate-800">1-4</kbd> to select, <kbd className="rounded bg-slate-100 px-1 py-0.5 border text-[10px] dark:bg-slate-800">Enter</kbd> to confirm
        </span>

        <div className="flex items-center gap-3 ml-auto">
          {!isAnswerSubmitted ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-40"
            >
              <span>Confirm Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'See Final Score'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
