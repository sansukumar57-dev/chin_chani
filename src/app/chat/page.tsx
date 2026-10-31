'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import AIChatBox from '@/components/ai-chat-box';
import { getDocuments } from '@/lib/store';
import { StudyDocument } from '@/types';
import { MessageSquare, BookOpen } from 'lucide-react';

export default function ChatPage() {
  const [documents] = useState<StudyDocument[]>(() => getDocuments());
  const [activeDoc, setActiveDoc] = useState<StudyDocument | null>(() => {
    const docs = getDocuments();
    return docs.length > 0 ? docs[0] : null;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-x-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Document Grounded
                </span>
                <span className="text-xs text-slate-400">Zero Hallucinations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                AI Doubt Solver & Tutor
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Ask questions directly grounded in your uploaded textbooks and course notes.
              </p>
            </div>
          </div>

          {/* Quick-switch document pills */}
          {documents.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                <span>Reference Notes:</span>
              </span>
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activeDoc?.id === doc.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className="max-w-[200px] truncate">{doc.title}</span>
                </button>
              ))}
            </div>
          )}

          {activeDoc ? (
            <AIChatBox
              document={activeDoc}
              allDocuments={documents}
              onSelectDoc={(doc) => setActiveDoc(doc)}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No documents found
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Please upload a study document in the library to start asking questions.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

