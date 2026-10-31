'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, Loader2 } from 'lucide-react';
import { StudyDocument } from '@/types';
import { saveDocument } from '@/lib/store';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (newDoc: StudyDocument) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  async function handleFileUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      saveDocument(data.document);
      if (onUploadSuccess) onUploadSuccess(data.document);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasteUpload() {
    if (!pastedTitle.trim() || !pastedText.trim()) {
      setError('Please provide both title and notes text.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', pastedTitle.trim());
      formData.append('text', pastedText.trim());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process notes');
      }

      saveDocument(data.document);
      if (onUploadSuccess) onUploadSuccess(data.document);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process pasted notes');
    } finally {
      setLoading(false);
    }
  }

  function loadSampleChemistry() {
    setPastedTitle('Organic Chemistry & Reaction Mechanisms.pdf');
    setPastedText(`Organic Chemistry: Nucleophilic Substitution & Elimination Mechanisms

1. SN1 vs SN2 Reactions:
- SN1 (Substitution Nucleophilic Unimolecular):
  Two-step mechanism passing through a planar carbocation intermediate.
  Reaction rate depends only on substrate: Rate = k[Substrate].
  Favored by tertiary (3°) carbons, polar protic solvents (H2O, EtOH), and weak nucleophiles.
  Produces racemic mixture of enantiomers due to front and back attack on the planar intermediate.

- SN2 (Substitution Nucleophilic Biomolecular):
  One-step concerted mechanism with backside attack.
  Reaction rate: Rate = k[Substrate][Nucleophile].
  Favored by primary (1°) or methyl substrates, polar aprotic solvents (DMSO, Acetone), and strong nucleophiles.
  Features 100% Walden inversion of stereochemical configuration!

2. E1 and E2 Elimination:
Competes directly with substitution.
- E2 mechanism requires anti-periplanar arrangement of hydrogen and leaving group.
- Zaitsev's rule: The most substituted, thermodynamically stable alkene is the major product when using small unhindered bases.
- Hofmann rule: Bulky bases (e.g. Potassium tert-butoxide) abstract the least sterically hindered proton, yielding the less substituted alkene.

Exam High-Yield Tip:
Tertiary halides NEVER undergo SN2 due to severe steric hindrance! They exclusively undergo SN1, E1, or E2 depending on base strength and temperature.`);
    setActiveTab('paste');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload Study Material</h2>
              <p className="text-xs text-slate-500">PDF, TXT, or markdown study notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-4 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === 'file'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upload PDF / Document
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === 'paste'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Paste Raw Notes
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File upload tab */}
        {activeTab === 'file' ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50/20 dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/20"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {file ? file.name : 'Click to select or drag and drop your document'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supports PDF, TXT, Markdown (Max size 10 MB)
              </p>
              {file && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB selected</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={loadSampleChemistry}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Quick demo: Load Organic Chemistry notes</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!file || loading}
                  onClick={handleFileUpload}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{loading ? 'Processing & Extracting...' : 'Upload & Catalog'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Paste raw notes tab */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document / Subject Title
              </label>
              <input
                type="text"
                placeholder="e.g. Molecular Biology - DNA Replication.pdf"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paste Academic Notes Text
              </label>
              <textarea
                rows={7}
                placeholder="Paste class notes, chapter excerpts, or syllabus points here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono leading-relaxed focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={loadSampleChemistry}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Fill sample Chemistry notes</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!pastedTitle.trim() || !pastedText.trim() || loading}
                  onClick={handlePasteUpload}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{loading ? 'Analyzing & Cataloging...' : 'Save & Analyze'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
