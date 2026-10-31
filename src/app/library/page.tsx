'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import UploadModal from '@/components/upload-modal';
import { getDocuments } from '@/lib/store';
import { StudyDocument } from '@/types';
import {
  FileText,
  Search,
  PlusCircle,
  Brain,
  MessageSquare,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';

export default function LibraryPage() {
  const [documents, setDocuments] = useState<StudyDocument[]>(() => getDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const subjects = ['All', ...Array.from(new Set(documents.map((d) => d.subject)))];

  const filteredDocs = documents.filter((doc) => {
    const matchesSubject = selectedSubject === 'All' || doc.subject === selectedSubject;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="min-w-0 flex-1 overflow-x-hidden space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Study Material Library
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                All cataloged textbook chapters, PDF handouts, and lecture notes.
              </p>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Upload Notes / PDF</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes, topics, or formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${selectedSubject === subj
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow-lg transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {doc.subject}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3.5 w-3.5" />
                      {doc.uploadDate} • {doc.fileSize}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mt-1">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 transition">
                        {doc.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {doc.summary?.overview || doc.content.slice(0, 140)}...
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {doc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/study/${doc.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Study Center</span>
                  </Link>

                  <Link
                    href={`/study/${doc.id}?tab=quiz`}
                    className="flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 transition"
                  >
                    <Brain className="h-3.5 w-3.5" />
                    <span>Quiz</span>
                  </Link>

                  <Link
                    href={`/study/${doc.id}?tab=flashcards`}
                    className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 transition"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Cards</span>
                  </Link>

                  <Link
                    href={`/study/${doc.id}?tab=chat`}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                    title="AI Doubt Solver"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                No matching study materials found
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Try searching for another keyword or upload new course notes.
              </p>
            </div>
          )}
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => setDocuments(getDocuments())}
      />
    </div>
  );
}

