'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import QuizPlayer from '@/components/quiz-player';
import { getDocuments, getQuizQuestions, getQuizAttempts } from '@/lib/store';
import { StudyDocument, QuizQuestion, QuizAttempt } from '@/types';
import { Brain, Trophy, History, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

function QuizArenaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicFilter = searchParams.get('topic');
  const docParam = searchParams.get('doc');

  const [documents] = useState<StudyDocument[]>(() => getDocuments());
  const [attempts] = useState<QuizAttempt[]>(() => getQuizAttempts());

  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    const docs = getDocuments();
    if (docs.length === 0) return '';
    if (docParam && docs.some((d) => d.id === docParam)) return docParam;
    if (topicFilter) {
      for (const d of docs) {
        const qs = getQuizQuestions(d.id);
        if (qs.some((q) => q.topic && q.topic.toLowerCase().includes(topicFilter.toLowerCase()))) {
          return d.id;
        }
      }
    }
    return docs[0].id;
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    const docs = getDocuments();
    if (docs.length === 0) return [];
    let chosenDocId = docs[0].id;
    if (docParam && docs.some((d) => d.id === docParam)) chosenDocId = docParam;
    else if (topicFilter) {
      for (const d of docs) {
        const qs = getQuizQuestions(d.id);
        if (qs.some((q) => q.topic && q.topic.toLowerCase().includes(topicFilter.toLowerCase()))) {
          chosenDocId = d.id;
          break;
        }
      }
    }
    let qs = getQuizQuestions(chosenDocId);
    if (topicFilter) {
      const filtered = qs.filter((q) => q.topic && q.topic.toLowerCase().includes(topicFilter.toLowerCase()));
      if (filtered.length > 0) qs = filtered;
    }
    return qs;
  });

  function loadQuestions(docId: string, topic?: string | null) {
    let qs = getQuizQuestions(docId);
    if (topic) {
      const filtered = qs.filter((q) =>
        q.topic && q.topic.toLowerCase().includes(topic.toLowerCase())
      );
      if (filtered.length > 0) {
        qs = filtered;
      }
    }
    setQuestions(qs);
  }

  function handleSelectDoc(id: string) {
    setSelectedDocId(id);
    loadQuestions(id, topicFilter);
  }

  function clearTopicFilter() {
    router.push('/quiz');
    if (selectedDocId) {
      setQuestions(getQuizQuestions(selectedDocId));
    }
  }

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Active Recall Practice
              </span>
              <span className="text-xs text-slate-400">Adaptive Scoring Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Practice Quiz Arena
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Self-evaluate knowledge retention with AI-generated multiple choice questions.
            </p>
          </div>

          <Link
            href="/analytics"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition shrink-0"
          >
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>View Weak-Topic Analysis</span>
          </Link>
        </div>

        {/* Targeted Topic Drill Notice Banner */}
        {topicFilter && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-950/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                Targeted Weak-Concept Drill: <strong className="font-bold underline">{topicFilter}</strong>
              </span>
            </div>
            <button
              onClick={clearTopicFilter}
              className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-100"
            >
              <X className="h-3.5 w-3.5" />
              <span>Show All Questions</span>
            </button>
          </div>
        )}

        {/* Document selector buttons (Wrapped, clean and responsive) */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 mr-1">Study Material:</span>
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleSelectDoc(doc.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedDocId === doc.id
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              <span className="max-w-[220px] truncate">{doc.title}</span>
            </button>
          ))}
        </div>

        {/* Active Quiz Player */}
        {selectedDoc && (
          <QuizPlayer
            questions={questions}
            documentId={selectedDoc.id}
            documentTitle={selectedDoc.title}
            onRestart={() => loadQuestions(selectedDoc.id, topicFilter)}
          />
        )}

        {/* Recent Quiz Attempts Table */}
        {attempts.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Quiz Attempts & Scores
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                    <th className="pb-2 font-semibold">Subject / Document</th>
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold">Score</th>
                    <th className="pb-2 font-semibold">Accuracy</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attempts.slice(0, 5).map((att) => (
                    <tr key={att.id} className="py-2.5">
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                        {att.documentTitle}
                      </td>
                      <td className="py-3 text-slate-400">{att.date}</td>
                      <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {att.percentage}%
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            att.percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : att.percentage >= 60
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {att.percentage >= 80
                            ? 'Mastered'
                            : att.percentage >= 60
                            ? 'Improving'
                            : 'Needs Revision'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function QuizArenaPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400">
            Loading Quiz Arena...
          </div>
        }
      >
        <QuizArenaContent />
      </Suspense>
    </div>
  );
}
