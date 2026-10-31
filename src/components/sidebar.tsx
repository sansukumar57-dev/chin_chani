'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  PieChart,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  onOpenUpload?: () => void;
}

export default function Sidebar({ onOpenUpload }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Library', href: '/library', icon: BookOpen },
    { name: 'Practice Quizzes', href: '/quiz', icon: BrainCircuit },
    { name: 'Flashcards', href: '/flashcards', icon: Layers },
    { name: 'Weak Topic Analytics', href: '/analytics', icon: PieChart },
    { name: 'AI Doubt Solver', href: '/chat', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-6">
        {/* Quick Upload Action */}
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:brightness-105 active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload Notes / PDF</span>
          </button>
        )}

        {/* Navigation list */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Study Workspace
          </p>
          <nav className="space-y-1 mt-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Shinchan Hackathon subtle contrast card */}
        <div className="mt-auto rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950 p-4 shadow-lg text-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-300 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>SHINCHAN HACKATHON</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Built for Devengers 24h Hackathon. Fully integrated with Next.js 16, Supabase, and dynamic AI tutor engine.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] font-medium">
            <span className="text-slate-300">Theme: Open Innovation</span>
            <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-indigo-300">EdTech</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
