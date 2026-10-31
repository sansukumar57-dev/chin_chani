'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudyDocument } from '@/types';
import { getChatMessages, addChatMessage } from '@/lib/store';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  BookOpen,
  Lightbulb,
  Volume2,
  Trash2,
} from 'lucide-react';

let messageCounter = 0;
function createUniqueMsgId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${Date.now()}-${messageCounter}`;
}

function formatCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitialChatMessages(doc: StudyDocument): ChatMessage[] {
  const msgs = getChatMessages(doc.id);
  if (msgs.length > 0) return msgs;
  const welcomeMsg: ChatMessage = {
    id: `welcome-${doc.id}`,
    sender: 'assistant',
    text: `Hello! I am your AI Doubt Solver for **${doc.title}**. Ask me any question, request real-world examples, or test your understanding!`,
    timestamp: formatCurrentTime(),
    citations: [`Document: ${doc.title}`],
  };
  addChatMessage(doc.id, welcomeMsg);
  return [welcomeMsg];
}

interface AIChatBoxProps {
  document: StudyDocument;
  allDocuments?: StudyDocument[];
  onSelectDoc?: (doc: StudyDocument) => void;
}

export default function AIChatBox({
  document: currentDoc,
  allDocuments = [],
  onSelectDoc,
}: AIChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialChatMessages(currentDoc)
  );
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync when document changes
  const [prevDocId, setPrevDocId] = useState(currentDoc.id);
  if (prevDocId !== currentDoc.id) {
    setPrevDocId(currentDoc.id);
    setMessages(getInitialChatMessages(currentDoc));
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(textToSend?: string) {
    const q = (textToSend || inputQuestion).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: createUniqueMsgId('msg-user'),
      sender: 'user',
      text: q,
      timestamp: formatCurrentTime(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    addChatMessage(currentDoc.id, userMsg);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentDoc.title,
          content: currentDoc.content,
          question: q,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: createUniqueMsgId('msg-ai'),
        sender: 'assistant',
        text: data.answer || "I've analyzed your notes and formulated an explanation.",
        timestamp: formatCurrentTime(),
        citations: data.citations || [`Source: ${currentDoc.title}`],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      addChatMessage(currentDoc.id, assistantMsg);
    } catch (err) {
      console.warn('Chat request failed:', err);
      const errorMsg: ChatMessage = {
        id: createUniqueMsgId('msg-err'),
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary issue processing your question. Please try again.',
        timestamp: formatCurrentTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleSpeak(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  function handleClear() {
    const welcomeMsg: ChatMessage = {
      id: createUniqueMsgId(`welcome-${currentDoc.id}`),
      sender: 'assistant',
      text: `Chat cleared. Ready for your questions on **${currentDoc.title}**!`,
      timestamp: formatCurrentTime(),
      citations: [`Document: ${currentDoc.title}`],
    };
    setMessages([welcomeMsg]);
  }

  const promptChips = [
    'Explain in simple terms (ELI5)',
    'Give a real-world analogy',
    'What are the high-yield exam traps?',
    'Give a 3-bullet revision summary',
  ];

  return (
    <div className="flex flex-col h-[650px] rounded-3xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              StudyGenie AI Tutor
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate max-w-xs sm:max-w-md">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">Grounded in: {currentDoc.title}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allDocuments.length > 1 && onSelectDoc && (
            <select
              value={currentDoc.id}
              onChange={(e) => {
                const selected = allDocuments.find((d) => d.id === e.target.value);
                if (selected) onSelectDoc(selected);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {allDocuments.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isAI
                    ? 'bg-slate-100/80 text-slate-800 border border-slate-200/60 dark:bg-slate-800/80 dark:text-slate-100 dark:border-slate-700/60'
                    : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-line space-y-2">{msg.text}</div>

                {/* Footer with citations and copy */}
                <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px] opacity-75">
                  <span className="flex items-center gap-1">
                    {msg.citations?.[0] && (
                      <span className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10 font-mono text-[10px]">
                        {msg.citations[0]}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </span>

                  {isAI && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:opacity-100 transition flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Read Aloud"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span className="text-[10px]">Listen</span>
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:opacity-100 transition flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span className="text-[10px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Analyzing notes & crafting answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 dark:bg-slate-900/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip)}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-indigo-400 transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-white border-t border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Ask about ${currentDoc.title}...`}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

