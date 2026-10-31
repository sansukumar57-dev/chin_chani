'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  BookOpen,
  Brain,
  BarChart3,
  MessageSquareQuote,
  Flame,
  Layers,
  Upload,
  Terminal,
  Menu,
  X,
  Plus
} from 'lucide-react';
import ArchitectureModal from '@/components/architecture-modal';
import UploadModal from '@/components/upload-modal';

export default function Navbar() {
  const pathname = usePathname();
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/library', label: 'My Library', icon: BookOpen },
    { href: '/quiz', label: 'Quiz Arena', icon: Brain },
    { href: '/flashcards', label: 'Flashcards', icon: Layers },
    { href: '/analytics', label: 'Weak Topics', icon: BarChart3 },
    { href: '/chat', label: 'AI Doubt Solver', icon: MessageSquareQuote },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight flex items-center gap-1.5 font-black">
                  Study<span className="text-indigo-600">Genie</span>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800">
                    AI v2.0
                  </span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 -mt-0.5 hidden sm:block">
                  Adaptive AI Learning Assistant
                </span>
              </div>
            </Link>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side items */}
          <div className="flex items-center gap-2.5">
            {/* Quick Upload CTA */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 transition active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload Notes</span>
            </button>

            {/* Architecture / Blueprint Button */}
            <button
              onClick={() => setIsArchOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
              title="View Hackathon Architecture & Schema"
            >
              <Terminal className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden xl:inline">Blueprint</span>
            </button>

            {/* Daily streak */}
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50">
              <Flame className="h-4 w-4 text-amber-500 animate-pulse fill-amber-500" />
              <span className="hidden sm:inline">5-Day</span>
              <span>🔥</span>
            </div>

            {/* User profile avatar */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm ring-2 ring-indigo-100 dark:ring-indigo-950">
                AV
              </div>
            </Link>

            {/* Mobile Hamburger - Only visible on mobile (hidden on md and above where sidebar is active) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 space-y-1 dark:border-slate-800 dark:bg-slate-900/95 animate-in slide-in-from-top-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsUploadOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Notes</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsArchOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Blueprint</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <ArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </>
  );
}
