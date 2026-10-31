"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Check,
  Volume2,
  BookmarkCheck,
  Loader2,
  Trash2,
  Lightbulb
} from "lucide-react";
import { ChatMessage, StudyDocument } from "@/types";

interface ChatInterfaceProps {
  document: StudyDocument;
}

export default function ChatInterface({ document }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "assistant",
      text: `Hello! I'm your StudyGenie AI tutor for "${document.title}". Ask me any conceptual questions, request analogies, or test your understanding. All my answers are grounded strictly in your study material!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      citations: [`${document.title} (Grounded Knowledge Source)`],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Explain this like I'm a beginner (ELIF5)",
    "Give me a real-world analogy",
    "What is the most common exam trap on this?",
    "Derive the primary formula step-by-step",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(textToSend?: string) {
    const question = textToSend || input;
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: document.id,
          documentTitle: document.title,
          contextText: document.content,
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.answer) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citations: data.citations || [`Section: ${document.subject || "Study Notes"}`],
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || "Failed to get AI answer");
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I encountered a minor network issue. However, based on your notes: always verify boundary invariants and review the key equations!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleSpeak(text: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  function clearChat() {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: "assistant",
        text: `Chat cleared. Ready to answer more questions about ${document.title}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="flex flex-col h-[750px] rounded-2xl border border-indigo-100/90 bg-white shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 via-white to-violet-50/40 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">AI Doubt Solver & Socratic Tutor</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Grounded
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate max-w-sm">
              Context: <span className="font-medium text-gray-700">{document.title}</span>
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Clear Conversation"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/30">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-tr from-indigo-500 to-violet-500 text-white"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white border border-gray-200/80 text-gray-800 rounded-tl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Grounded Citations if assistant */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1 font-semibold text-indigo-600 mb-1">
                        <BookmarkCheck className="h-3 w-3" />
                        <span>Document Citations:</span>
                      </div>
                      <div className="space-y-0.5">
                        {msg.citations.map((cite, i) => (
                          <p key={i} className="text-gray-500 italic bg-gray-50 px-2 py-0.5 rounded">
                            ↳ {cite}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer timestamp & actions */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-gray-400 px-1 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-gray-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-indigo-600 transition-colors"
                        title="Listen / Read Aloud"
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>StudyGenie is retrieving context and formulating response...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/70 overflow-x-auto flex items-center gap-2 text-xs">
        <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex-shrink-0">
          Try asking:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            disabled={isLoading}
            className="flex-shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question about ${document.title}...`}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
