'use client';

import { useState, useEffect } from 'react';
import { Flashcard } from '@/types';
import { updateFlashcardStatus } from '@/lib/store';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  Clock,
  Volume2,
  Keyboard,
  Layers,
} from 'lucide-react';

interface FlashcardDeckProps {
  cards: Flashcard[];
  documentId: string;
  documentTitle?: string;
}

export default function FlashcardDeck({
  cards: initialCards,
  documentId,
  documentTitle,
}: FlashcardDeckProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Keyboard navigation support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1') {
        handleMarkStatus('learning');
      } else if (e.key === '2') {
        handleMarkStatus('mastered');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards]);

  if (!cards || cards.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <Layers className="mx-auto h-12 w-12 text-indigo-400 mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          No Flashcards Created Yet
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Generate flashcards from this study material for active recall revision.
        </p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  function handleFlip() {
    setIsFlipped((prev) => !prev);
  }

  function handleNext() {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }

  function handlePrev() {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  function handleShuffle() {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  }

  function handleMarkStatus(status: 'learning' | 'mastered') {
    if (!currentCard) return;
    updateFlashcardStatus(documentId, currentCard.id, status);
    const updated = cards.map((c, i) => (i === currentIndex ? { ...c, status } : c));
    setCards(updated);
    handleNext();
  }

  function handleReadAloud(e: React.MouseEvent, text: string) {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  const masteredCount = cards.filter((c) => c.status === 'mastered').length;
  const learningCount = cards.filter((c) => c.status === 'learning').length;
  const progressPct = Math.round((masteredCount / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Deck Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>{masteredCount} Mastered</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
            <Clock className="h-3.5 w-3.5" />
            <span>{learningCount} Learning</span>
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {progressPct}% Deck Mastery
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-xs transition"
          >
            <Shuffle className="h-3.5 w-3.5 text-indigo-500" />
            <span>Shuffle Deck</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card Deck Wrapper (with subtle stacked cards depth effect) */}
      <div className="relative pt-2">
        {/* Layer 2 Background Stack */}
        <div className="absolute inset-x-6 top-0 h-4 rounded-3xl bg-indigo-100/60 dark:bg-slate-800/60 -z-20 transform -translate-y-2 scale-[0.96]" />
        {/* Layer 1 Background Stack */}
        <div className="absolute inset-x-3 top-1 h-4 rounded-3xl bg-indigo-50 dark:bg-slate-800/90 -z-10 transform -translate-y-1 scale-[0.98]" />

        {/* Main 3D Flashcard */}
        <div
          onClick={handleFlip}
          className="cursor-pointer group relative min-h-[300px] sm:min-h-[340px] rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500 flex flex-col justify-between select-none"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              {currentCard.topic || 'Revision Concept'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) =>
                  handleReadAloud(e, isFlipped ? currentCard.back : currentCard.front)
                }
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition"
                title="Read Aloud"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Card {currentIndex + 1} of {cards.length}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="my-auto py-6 space-y-3">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider block ${
                isFlipped ? 'text-purple-600 dark:text-purple-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {isFlipped ? '✦ Answer / High-Yield Explanation' : '✦ Recall Prompt / Question'}
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed max-w-xl mx-auto">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
          </div>

          {/* Card Footer Hint */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-400">
            <span className="text-[11px]">
              Status:{' '}
              <strong
                className={
                  currentCard.status === 'mastered'
                    ? 'text-emerald-600'
                    : currentCard.status === 'learning'
                    ? 'text-amber-600'
                    : 'text-slate-400'
                }
              >
                {currentCard.status.toUpperCase()}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
              <RotateCw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Click card or hit Space to flip</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Mastery Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkStatus('learning')}
            className="flex items-center gap-1.5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 transition shadow-xs"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Still Learning (1)</span>
          </button>

          <button
            onClick={() => handleMarkStatus('mastered')}
            className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Mastered (2)</span>
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-center text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
          <Keyboard className="h-3.5 w-3.5 text-indigo-500" />
          <span>Hotkeys:</span>
        </span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-mono text-[10px] dark:bg-slate-800 dark:border-slate-700">Space</kbd> Flip</span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-mono text-[10px] dark:bg-slate-800 dark:border-slate-700">←/→</kbd> Navigate</span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-mono text-[10px] dark:bg-slate-800 dark:border-slate-700">1</kbd> Learning</span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-mono text-[10px] dark:bg-slate-800 dark:border-slate-700">2</kbd> Mastered</span>
      </div>
    </div>
  );
}
