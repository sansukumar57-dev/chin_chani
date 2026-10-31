'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import QuizPlayer from '@/components/quiz-player';
import FlashcardDeck from '@/components/flashcard-deck';
import AIChatBox from '@/components/ai-chat-box';
import {
  getDocumentById,
  getQuizQuestions,
  getFlashcards,
  saveQuizQuestions,
  saveDocument,
} from '@/lib/store';
import { StudyDocument, QuizQuestion, Flashcard, DocumentSummary } from '@/types';
import {
  BookOpen,
  Brain,
  Layers,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowLeft,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

function StudyDocumentContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as 'summary' | 'quiz' | 'flashcards' | 'chat' | 'text' || 'summary';

  const [activeTab, setActiveTab] = useState<'summary' | 'quiz' | 'flashcards' | 'chat' | 'text'>(
    initialTab
  );
  const [doc, setDoc] = useState<StudyDocument | null>(() => {
    return params?.id ? getDocumentById(params.id) || null : null;
  });
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(() => {
    return params?.id ? getQuizQuestions(params.id) : [];
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    return params?.id ? getFlashcards(params.id) : [];
  });
  const [copiedText, setCopiedText] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const found = getDocumentById(params.id);
      if (found) {
        setDoc(found);
        setQuizzes(getQuizQuestions(found.id));
        setFlashcards(getFlashcards(found.id));
      }
    }
  }, [params?.id]);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'summary' | 'quiz' | 'flashcards' | 'chat' | 'text';
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="mx-auto max-w-4xl w-full p-8 text-center my-auto">
          <HelpCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Document Not Found
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            The study document requested could not be located in your library.
          </p>
          <Link
            href="/library"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Library</span>
          </Link>
        </div>
      </div>
    );
  }

  async function handleGenerateNewQuiz() {
    if (!doc) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: doc.title, content: doc.content }),
      });
      const data = await res.json();
      if (data.questions) {
        saveQuizQuestions(doc.id, data.questions);
        setQuizzes(data.questions);
        setActiveTab('quiz');
      }
    } catch (e) {
      console.warn('Quiz generation error', e);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopyText() {
    if (!doc) return;
    navigator.clipboard.writeText(doc.content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  const tabs = [
    { id: 'summary', label: 'AI Structured Summary', icon: Sparkles },
    { id: 'quiz', label: `Practice Quiz (${quizzes.length})`, icon: Brain },
    { id: 'flashcards', label: `Flashcards (${flashcards.length})`, icon: Layers },
    { id: 'chat', label: 'AI Doubt Solver', icon: MessageSquare },
    { id: 'text', label: 'Raw Notes', icon: FileText },
  ];

  const summary = doc.summary;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Library</span>
          </Link>

          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {doc.subject}
          </span>
        </div>

        {/* Title Bar Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {doc.title}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Uploaded on {doc.uploadDate}
                </span>
                <span>•</span>
                <span>Size: {doc.fileSize}</span>
                <span>•</span>
                <span>{doc.content.split(/\s+/).length} words</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateNewQuiz}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 transition shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Refresh AI Questions'}</span>
          </button>
        </div>

        {/* Interactive Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: AI Structured Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {summary ? (
              <>
                {/* Overview banner */}
                <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-white p-6 shadow-sm dark:border-indigo-950 dark:from-indigo-950/40 dark:to-slate-900">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      AI Executive Synthesis
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {summary.mainTopic}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {summary.overview}
                  </p>
                </div>

                {/* Key Concepts Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    Key Concepts & Principles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summary.keyConcepts.map((item, idx) => {
                      const badgeColor =
                        item.importance === 'Critical'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : item.importance === 'High'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {item.term}
                            </h4>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}
                            >
                              {item.importance}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* High Yield Takeaways + Exam Tips in 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* High Yield Takeaways */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        5 High-Yield Examination Takeaways
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {summary.highYieldTakeaways.map((takeaway, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {idx + 1}
                          </span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exam Tips & Definitions */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2">
                        <Lightbulb className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          High-Probability Exam Watch-Outs
                        </h4>
                      </div>
                      <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        {summary.examTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        Key Definitions
                      </h4>
                      <div className="space-y-2.5">
                        {summary.definitions.map((def, idx) => (
                          <div key={idx} className="text-xs leading-relaxed">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {def.term}:{' '}
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {def.definition}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <Sparkles className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Summary Generated Yet
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Click below to generate structured takeaways from this material.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Practice Quiz */}
        {activeTab === 'quiz' && (
          <QuizPlayer
            questions={quizzes}
            documentId={doc.id}
            documentTitle={doc.title}
            onRestart={() => setQuizzes(getQuizQuestions(doc.id))}
          />
        )}

        {/* TAB 3: Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardDeck
            cards={flashcards}
            documentId={doc.id}
            documentTitle={doc.title}
          />
        )}

        {/* TAB 4: AI Doubt Solver */}
        {activeTab === 'chat' && (
          <AIChatBox document={doc} />
        )}

        {/* TAB 5: Raw Notes */}
        {activeTab === 'text' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Document Text
              </span>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 transition"
              >
                {copiedText ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {doc.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudyDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading study workspace...</p>
          </div>
        </div>
      }
    >
      <StudyDocumentContent />
    </Suspense>
  );
}

