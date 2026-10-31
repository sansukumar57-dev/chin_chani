'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Shuffle, RotateCcw } from 'lucide-react';

type CardStatus = 'MASTERED' | 'LEARNING';

interface Flashcard {
  id: number;
  topic: string;
  question: string;
  answer: string;
  status: CardStatus;
}

const DECKS: Record<string, Flashcard[]> = {
  'Newtonian Mechanics & Laws of Motion.pdf': [
    {
      id: 1,
      topic: 'Newton Laws',
      question: "State Newton's 1st Law of Motion and its defining property.",
      answer:
        'An object at rest stays at rest, and an object in motion stays in motion at constant velocity unless acted upon by a net external force. Its defining property is Inertia.',
      status: 'MASTERED',
    },
    {
      id: 2,
      topic: 'Newton Laws',
      question: "How is linear momentum defined, and how does it relate to Newton's 2nd Law?",
      answer:
        "Linear momentum is p = mv. Newton's 2nd Law states that net external force equals the rate of change of momentum (F_net = dp/dt = ma for constant mass).",
      status: 'LEARNING',
    },
    {
      id: 3,
      topic: 'Work & Energy',
      question: 'State the Work-Energy Theorem and when mechanical energy is conserved.',
      answer:
        'Net work done on a particle equals its change in kinetic energy (W_net = ΔK). Total mechanical energy (K + U) is conserved when only conservative forces do work.',
      status: 'MASTERED',
    },
    {
      id: 4,
      topic: 'Rotational Dynamics',
      question: "What is the rotational analog of Newton's 2nd Law for a rigid body?",
      answer:
        'Net external torque equals moment of inertia times angular acceleration (τ_net = Iα), where I = Σm_i r_i² depends on the axis of rotation.',
      status: 'LEARNING',
    },
    {
      id: 5,
      topic: 'Impulse',
      question: 'Define Impulse and explain why padding reduces injury during collisions.',
      answer:
        'Impulse (J = F_avg · Δt = Δp) is the change in momentum. Padding increases collision time Δt for a fixed Δp, reducing the peak impact force F_avg.',
      status: 'LEARNING',
    },
  ],
  'Cellular Biology & Mitosis vs Meiosis.pdf': [
    {
      id: 1,
      topic: 'Cell Division',
      question: 'What is the primary genetic difference between daughter cells in Mitosis vs. Meiosis?',
      answer:
        'Mitosis produces 2 genetically identical diploid (2n) somatic cells, while Meiosis produces 4 genetically unique haploid (n) gametes via crossing over and independent assortment.',
      status: 'MASTERED',
    },
    {
      id: 2,
      topic: 'Meiosis I',
      question: 'During which phase of Meiosis does synapsis and crossing over occur?',
      answer:
        'Prophase I. Homologous chromosomes pair up to form tetrads (synapsis) and exchange genetic material at chiasmata.',
      status: 'LEARNING',
    },
  ],
  'Data Structures & Big-O Time Complexity.pdf': [
    {
      id: 1,
      topic: 'Hash Tables',
      question: 'What are the average and worst-case time complexities for lookup in a Hash Table?',
      answer:
        'Average case is O(1) with a good hash function and low load factor; worst case is O(n) when hash collisions place all keys in the same bucket.',
      status: 'MASTERED',
    },
    {
      id: 2,
      topic: 'Trees',
      question: 'Why do self-balancing BSTs (like AVL or Red-Black trees) guarantee O(log n) search?',
      answer:
        'They use rotations on insertion and deletion to constrain tree height to O(log n), preventing degeneration into an O(n) linked list.',
      status: 'LEARNING',
    },
  ],
};

export default function FlashcardsPage() {
  const deckNames = Object.keys(DECKS);
  const [selectedDeck, setSelectedDeck] = useState<string>(deckNames[0]);
  const [cards, setCards] = useState<Flashcard[]>(DECKS[deckNames[0]]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const selectDeck = (deckName: string) => {
    setSelectedDeck(deckName);
    setCards(DECKS[deckName]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex] || cards[0];
  const masteredCount = cards.filter((c) => c.status === 'MASTERED').length;
  const learningCount = cards.length - masteredCount;
  const masteryPercent = Math.round((masteredCount / cards.length) * 100);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const updateStatus = useCallback(
    (newStatus: CardStatus) => {
      setCards((prev) =>
        prev.map((card, idx) =>
          idx === currentIndex ? { ...card, status: newStatus } : card
        )
      );
    },
    [currentIndex]
  );

  const shuffleDeck = () => {
    setIsFlipped(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1') {
        updateStatus('LEARNING');
      } else if (e.key === '2') {
        updateStatus('MASTERED');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, updateStatus]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        <Sidebar />

        {/* Bound main container with min-w-0 and overflow-x-hidden to prevent horizontal clipping */}
        <main className="min-w-0 flex-1 overflow-x-hidden space-y-5">
          {/* Compact Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 font-semibold text-purple-700 dark:text-purple-300">
                  Active Recall Practice
                </span>
                <span className="text-slate-400">Spaced Repetition</span>
              </div>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Interactive Flashcards
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Master critical formulas, definitions, and high-yield concepts using 3D flip flashcards.
              </p>
            </div>

            <Link
              href="/library"
              className="shrink-0 self-start sm:self-end rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition"
            >
              Back to Library →
            </Link>
          </div>

          {/* Wrapped Study Material Selector + Mastery Toolbar (No horizontal scrollbars!) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">Study Material:</span>
              {deckNames.map((deck) => {
                const isSelected = deck === selectedDeck;
                return (
                  <button
                    key={deck}
                    onClick={() => selectDeck(deck)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span>📑</span>
                    <span className="max-w-[200px] truncate">{deck}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ {masteredCount} Mastered
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-bold text-amber-600 dark:text-amber-400">
                  ⏳ {learningCount} Learning
                </span>
                <div className="flex items-center gap-2 pl-1">
                  <div className="h-2 w-24 sm:w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${masteryPercent}%` }}
                    />
                  </div>
                  <span className="text-slate-500 font-semibold text-[11px]">{masteryPercent}% Mastery</span>
                </div>
              </div>

              <button
                onClick={shuffleDeck}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition shadow-xs flex items-center gap-1.5"
              >
                <Shuffle className="h-3.5 w-3.5 text-indigo-500" />
                <span>Shuffle Deck</span>
              </button>
            </div>
          </div>

          {/* Bounded & Centered Flashcard */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="group relative mx-auto w-full max-w-3xl cursor-pointer select-none"
          >
            <div className="relative min-h-[260px] sm:min-h-[300px] w-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col justify-between">
              {/* Card Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                    {currentCard.topic}
                  </span>
                  <span className="text-slate-400 font-medium text-xs">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                </div>
                <span className="font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase text-[11px]">
                  {isFlipped ? '✦ VERIFIED EXPLANATION' : '✦ RECALL PROMPT'}
                </span>
              </div>

              {/* Card Center Prompt / Answer */}
              <div className="my-auto py-6 text-center">
                {!isFlipped ? (
                  <h2 className="mx-auto max-w-2xl text-xl sm:text-2xl font-bold leading-snug text-slate-900 dark:text-white">
                    {currentCard.question}
                  </h2>
                ) : (
                  <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-indigo-950 dark:text-indigo-100 font-medium">
                    {currentCard.answer}
                  </p>
                )}
              </div>

              {/* Card Bottom Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs text-slate-400">
                <span className="font-medium">
                  Status:{' '}
                  <strong
                    className={
                      currentCard.status === 'MASTERED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }
                  >
                    {currentCard.status}
                  </strong>
                </span>
                <span className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition flex items-center gap-1 font-semibold">
                  <RotateCcw className="h-3 w-3" />
                  <span>Click card or hit <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 border text-slate-700 dark:text-slate-300 text-[10px]">Space</kbd> to flip</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Controls & Hotkeys */}
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition"
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition"
              >
                Next →
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => updateStatus('LEARNING')}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                  currentCard.status === 'LEARNING'
                    ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                Still Learning (1)
              </button>
              <button
                onClick={() => updateStatus('MASTERED')}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                  currentCard.status === 'MASTERED'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                Mastered (2)
              </button>
            </div>
          </div>

          {/* Compact Hotkey Legend */}
          <div className="text-center text-[11px] text-slate-400 pt-1">
            <strong className="text-slate-500">Hotkeys:</strong>{' '}
            <span className="mx-1.5">
              <kbd className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">Space</kbd> Flip
            </span>
            <span className="mx-1.5">
              <kbd className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">←/→</kbd> Navigate
            </span>
            <span className="mx-1.5">
              <kbd className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">1</kbd> Learning
            </span>
            <span className="mx-1.5">
              <kbd className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">2</kbd> Mastered
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
